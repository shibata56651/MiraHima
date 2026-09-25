type YouTubeItem = {
  id?: string;
  contentDetails?: { relatedPlaylists?: { uploads?: string } };
  snippet?: {
    resourceId?: { videoId?: string };
    liveBroadcastContent?: string;
    thumbnails?: { [size: string]: { url?: string } };
    channelTitle?: string;
    title?: string;
  };
  liveStreamingDetails?: { scheduledStartTime?: string };
};

type YouTubeResponse = {
  items?: YouTubeItem[];
  error?: { code?: number };
};

export class youtubeApi {
  o: { CHANNEL_ID_01: string; CHANNEL_ID_02: string; APIKEY: string };
  liveRoot: HTMLUListElement;
  reservationRoot: HTMLUListElement;
  liveMessage: HTMLParagraphElement;
  reservationMessage: HTMLParagraphElement;

  constructor(element: HTMLElement | null, liveElement: HTMLElement | null) {
    this.o = {
      CHANNEL_ID_01: 'UCg7ayfyvQWbruGAlLy9F8EQ',
      CHANNEL_ID_02: 'UCuCRPpSFUXrvBK__75GT8Yg',
      APIKEY: 'AIzaSyDpGvB-IA0WgEVBYrMdW-dl8zm4emzLYwE',
    };

    this.liveRoot = document.createElement('ul');
    this.reservationRoot = document.createElement('ul');
    this.liveRoot.className = 'temporary-element';
    this.reservationRoot.className = 'temporary-element';
    element?.appendChild(this.liveRoot);
    liveElement?.appendChild(this.reservationRoot);

    this.liveMessage = this.createMessage(element);
    this.reservationMessage = this.createMessage(liveElement);
    this.init();
  }

  private createMessage(root: HTMLElement | null) {
    const message = document.createElement('p');
    message.setAttribute('role', 'status');
    message.textContent = '配信情報を読み込んでいます。';
    root?.appendChild(message);
    return message;
  }

  init() {
    if (document.readyState === 'complete') {
      void this.onJSClientLoad();
    } else {
      window.addEventListener('load', () => { void this.onJSClientLoad(); }, { once: true });
    }
  }

  private async getYouTube(api: string, query: { [key: string]: string }): Promise<YouTubeItem[]> {
    const parameters = new URLSearchParams({ key: this.o.APIKEY, ...query });
    const response = await fetch(`https://www.googleapis.com/youtube/v3/${api}?${parameters}`);
    const data: YouTubeResponse | null = await response.json();
    if (!response.ok || !data || data.error || !Array.isArray(data.items)) {
      throw new Error(`YouTube ${api} request failed (${response.status})`);
    }
    return data.items;
  }

  private async loadChannel(channelId: string) {
    const channels = await this.getYouTube('channels', {
      part: 'contentDetails', id: channelId,
    });
    const playlistId = channels[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!playlistId) {
      throw new Error('YouTube channel uploads playlist is unavailable');
    }

    const playlist = await this.getYouTube('playlistItems', {
      part: 'snippet', maxResults: '10', playlistId,
    });
    const ids = playlist.map(item => item.snippet?.resourceId?.videoId)
      .filter((id): id is string => Boolean(id));
    if (!ids.length) return;

    // 通常動画には liveStreamingDetails がなく、削除・非公開動画は返されないことがある。
    const videos = await this.getYouTube('videos', {
      part: 'snippet,liveStreamingDetails', id: ids.join(','),
    });
    videos.forEach(video => this.renderVideo(video));
  }

  private renderVideo(video: YouTubeItem) {
    const snippet = video.snippet;
    if (!video.id || !snippet) return;
    const upcoming = snippet.liveBroadcastContent === 'upcoming';
    if (!upcoming && snippet.liveBroadcastContent !== 'live') return;

    const root = upcoming ? this.reservationRoot : this.liveRoot;
    const item = document.createElement('li');
    const content = document.createElement('div');
    content.className = 'youtube-content';
    item.appendChild(content);

    const link = document.createElement('a');
    link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
    const thumbnails = snippet.thumbnails;
    const thumbnail = thumbnails?.maxres?.url || thumbnails?.standard?.url ||
      thumbnails?.high?.url || thumbnails?.medium?.url || thumbnails?.default?.url;
    if (thumbnail) {
      const image = document.createElement('img');
      image.src = thumbnail;
      image.alt = snippet.title || 'YouTubeで配信を見る';
      image.loading = 'lazy';
      link.appendChild(image);
    } else {
      link.textContent = snippet.title || 'YouTubeで配信を見る';
    }
    const imageRoot = document.createElement('div');
    imageRoot.className = 'youtube-content__items-img';
    imageRoot.appendChild(link);
    content.appendChild(imageRoot);

    const channel = document.createElement('p');
    channel.className = 'youtube-content__items-channel';
    channel.textContent = snippet.channelTitle || '';
    content.appendChild(channel);
    const title = document.createElement('p');
    title.className = 'youtube-content__items-text';
    title.textContent = snippet.title || '';
    content.appendChild(title);

    const scheduledStartTime = video.liveStreamingDetails?.scheduledStartTime;
    if (upcoming && scheduledStartTime) {
      const date = new Date(scheduledStartTime);
      if (!Number.isNaN(date.getTime())) {
        const details = document.createElement('p');
        details.className = 'details-content';
        const dateElement = document.createElement('span');
        dateElement.className = 'details-content__items-scheduled-date';
        dateElement.textContent = date.toLocaleDateString('ja-JP', {
          timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
        });
        const timeElement = document.createElement('span');
        timeElement.className = 'details-content__items-scheduled-time';
        timeElement.textContent = date.toLocaleTimeString('ja-JP', {
          timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false,
        });
        details.appendChild(dateElement);
        details.appendChild(timeElement);
        item.appendChild(details);
      }
    }
    root.appendChild(item);
  }

  private updateSection(root: HTMLUListElement, message: HTMLParagraphElement, emptyText: string, failed: boolean) {
    const count = root.children.length;
    root.className = 'temporary-element';
    if (count) root.classList.add('youtube-list', `youtube-list--col${Math.min(count, 4)}`);
    message.hidden = count > 0 && !failed;
    message.textContent = failed
      ? '一部の配信情報を取得できませんでした。時間をおいて再度お試しください。'
      : emptyText;
  }

  async onJSClientLoad() {
    this.liveRoot.textContent = '';
    this.reservationRoot.textContent = '';
    const channelIds = [this.o.CHANNEL_ID_01, this.o.CHANNEL_ID_02];
    const results = await Promise.all(channelIds.map(async channelId => {
      try {
        await this.loadChannel(channelId);
        return true;
      } catch {
        // APIのエラー・通信失敗を処理し、ほかのチャンネルの表示は継続する。
        return false;
      }
    }));
    const failed = results.some(success => !success);
    this.updateSection(this.liveRoot, this.liveMessage, '現在配信中の動画はありません。', failed);
    this.updateSection(this.reservationRoot, this.reservationMessage, '取得した動画に配信予定はありません。', failed);
  }
}
