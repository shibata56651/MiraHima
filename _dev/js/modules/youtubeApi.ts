export class youtubeApi {
  o: { activeClass: string, CHANNEL_ID_01: string, CHANNEL_ID_02: string, CHANNEL_ID_03: string, APIKEY: string, ID: string, LIVESTATUS: string, statusFlg: boolean };
  element: HTMLElement | null;
  liveElement: HTMLElement | null;
  elmCount: number;
  liveRoot: HTMLElement;
  reservationRoot: HTMLElement;
  fixedItem: undefined;

  /**
   * @param  {Element} element rootとなる要素
   * @returns void
   */
  constructor(element: HTMLElement | null, liveElement: HTMLElement | null) {
    const defaultOptions = {
      activeClass: 'is-active',
      CHANNEL_ID_01: 'UCg7ayfyvQWbruGAlLy9F8EQ',
      CHANNEL_ID_02: 'UCuCRPpSFUXrvBK__75GT8Yg',
      CHANNEL_ID_03: 'UCqKexNL7YoueTlGSNZXoqPQ',
      APIKEY: 'AIzaSyDpGvB-IA0WgEVBYrMdW-dl8zm4emzLYwE',
      ID: '',
      LIVESTATUS: '',
      statusFlg: false,
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.liveElement = liveElement;
    this.elmCount = 0;
    this.liveRoot = document.createElement('ul'); //配信中ul
    this.liveRoot.classList.add('temporary-element');
    this.element?.appendChild(this.liveRoot);

    this.reservationRoot = document.createElement('ul'); //予約ul
    this.reservationRoot.classList.add('temporary-element');
    this.liveElement?.appendChild(this.reservationRoot);
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    window.addEventListener('load', this.onJSClientLoad.bind(this));
  }

  /**
   * ページロード時にスライドショーを再生する
   *
   * @returns void
   */

  /* APIロード */
  onJSClientLoad() {
    const getYouTube = async (api: string, query: any, cooldown = 300) => {
      await new Promise((r) => setTimeout(r, cooldown));
      return await (
        await fetch(`https://www.googleapis.com/youtube/v3/${api}${Object.entries(query).reduce((p, [k, v]) => `${p}&${k}=${v}`, `?key=${this.o.APIKEY}`)}`)
      ).json();
    };

    const getVideos = async (channelId: string) => {
      const playlistId = (
        await getYouTube("channels", {
          part: "contentDetails",
          id: channelId,
        })
      ).items[0].contentDetails.relatedPlaylists.uploads;

      switch (channelId) {
        case this.o.CHANNEL_ID_01:
          break;

        case this.o.CHANNEL_ID_02:
          break;

        case this.o.CHANNEL_ID_03:
          break;
      }

      return await getYouTube("playlistItems", {
        part: "snippet",
        maxResults: 5,
        playlistId,
      })
    };

    const liveStatusFunc = (resolveItem: { items: { snippet: { resourceId: { videoId: number; }; }; }[]; }, i: number) => {
      return getYouTube("videos", {
        part: "snippet",
        id: resolveItem.items[i].snippet.resourceId.videoId,
      })
    }

    const liveFunc = (resolveItem: { items: { snippet: { resourceId: { videoId: number; }; }; }[]; }, i: number) => {
      return getYouTube("videos", {
        part: "liveStreamingDetails",
        id: resolveItem.items[i].snippet.resourceId.videoId,
      })
    }

    const liveStatus = (resolveItem: { items: { snippet: { liveBroadcastContent: string, thumbnails: { maxres: { url: string } }, channelTitle: string, title: string }, id: number }[]; }, rootitems: HTMLLIElement, i: number, detailcontent: HTMLParagraphElement, livecontent: HTMLLIElement) => {

      if (resolveItem.items[0].snippet) {
        if (resolveItem.items[0].snippet.liveBroadcastContent === 'upcoming') {
          console.log(resolveItem.items[0].snippet)
          this.elmCount += 1;
          this.reservationRoot.appendChild(rootitems);
          const movieRoot = document.createElement('div');
          movieRoot.classList.add('youtube-content');
          rootitems.appendChild(movieRoot);
          rootitems.appendChild(detailcontent);

          if (this.elmCount === 1) {
            this.reservationRoot.classList.add('youtube-list');
            this.reservationRoot.classList.add('youtube-list--col1');
          } else if (this.elmCount === 2) {
            this.reservationRoot.classList.add('youtube-list');
            this.reservationRoot.classList.remove('youtube-list--col1');
            this.reservationRoot.classList.add('youtube-list--col2');
          } else if (this.elmCount === 3) {
            this.reservationRoot.classList.add('youtube-list');
            this.reservationRoot.classList.remove('youtube-list--col2');
            this.reservationRoot.classList.add('youtube-list--col3');
          } else if (this.elmCount === 4) {
            this.reservationRoot.classList.add('youtube-list');
            this.reservationRoot.classList.remove('youtube-list--col3');
            this.reservationRoot.classList.add('youtube-list--col4');
          }

          movieRoot.innerHTML = `<div class="youtube-content__items-img">
          <a href="https://www.youtube.com/watch?v=${resolveItem.items[0].id}">
          <img src="${resolveItem.items[0].snippet.thumbnails.maxres.url}">
          </a>
          </div>
        <p class="youtube-content__items-channel">${resolveItem.items[0].snippet.channelTitle}</p>
        <p class="youtube-content__items-text">${resolveItem.items[0].snippet.title}</p>`;
        } else if (resolveItem.items[0].snippet.liveBroadcastContent === 'live') {
          this.elmCount += 1;
          this.liveRoot.appendChild(rootitems);
          const liveRoot = document.createElement('div');
          livecontent.classList.add('youtube-content__items');
          rootitems.appendChild(liveRoot);
          liveRoot.appendChild(detailcontent);

          if (this.elmCount === 1) {
            this.liveRoot.classList.add('youtube-list');
            this.liveRoot.classList.add('youtube-list--col1');
          } else if (this.elmCount === 2) {
            this.liveRoot.classList.add('youtube-list');
            this.liveRoot.classList.remove('youtube-list--col1');
            this.liveRoot.classList.add('youtube-list--col2');
          } else if (this.elmCount === 3) {
            this.liveRoot.classList.add('youtube-list');
            this.liveRoot.classList.remove('youtube-list--col2');
            this.liveRoot.classList.add('youtube-list--col3');
          } else if (this.elmCount === 4) {
            this.liveRoot.classList.add('youtube-list');
            this.liveRoot.classList.remove('youtube-list--col3');
            this.liveRoot.classList.add('youtube-list--col4');
          }

          liveRoot.innerHTML = `<div class="live-content__items-img"><a href="https://www.youtube.com/watch?v=${resolveItem.items[0].id}"><img src="${resolveItem.items[0].snippet.thumbnails.maxres.url}"></a></div>
      <p class="live-content__items-channel">${resolveItem.items[0].snippet.channelTitle}</p>
      <p class="live-content__items-text">${resolveItem.items[0].snippet.title}</p>`;
        }

        // console.log(root)
      }
    }

    const liveDetailsFunc = (resolveItem: { items: { liveStreamingDetails: { scheduledStartTime: string; }; }[]; }, rootitems: HTMLLIElement, i: number, detailcontent: HTMLParagraphElement) => {
      const normalizeDateArry = resolveItem.items[0].liveStreamingDetails.scheduledStartTime.split('T');

      let normalizeDate = normalizeDateArry[0].split('-').join('/');
      let hour = Number(normalizeDateArry[1].split(':')[0]);
      let minit = Number(normalizeDateArry[1].split(':')[1]);
      const today = new Date();
      const year = String(today.getFullYear());
      const nowHour = String(today.getHours());
      const nowMinit = String(today.getMinutes());
      let month = today.getMonth() + 1;
      let day = today.getDate();

      if ((today.getMonth() + 1) <= 10) {
        month = Number('0' + month);
      }

      if (day <= 10) {
        day = Number('0' + day);
      }

      const sum = year + String(month) + String(day) + nowHour + nowMinit;
      Number(sum)
      hour = hour + 9;

      const liveTime = String(normalizeDateArry[0].split('-').join('')) + String(hour) + (minit === 0 ? '00' : String(minit));

      if (sum <= liveTime) {
        detailcontent.innerHTML = `<span class="details-content__items-scheduled-date">${normalizeDate}</span><span class="details-content__items-scheduled-time">${hour}:${minit}</span>`;
      }
    };

    const resolveFunc = (resolveItem: { items: { snippet: { resourceId: { videoId: number; }; }; }[] | { snippet: { resourceId: { videoId: number; }; }; }[]; }) => {
      this.elmCount = 0;
      for (let i = 0; i < 10; i++) {
        const rootitems = document.createElement('li');
        const rootitemsLive = document.createElement('li');
        const livecontent = document.createElement('div');
        livecontent.classList.add('live-content');
        const detailcontent = document.createElement('p');
        detailcontent.classList.add('details-content');

        liveFunc(resolveItem, i).then(r => liveDetailsFunc(r, rootitems, i, detailcontent));
        liveStatusFunc(resolveItem, i).then(r => liveStatus(r, rootitems, i, detailcontent, rootitemsLive));
      }
    }

    getVideos(this.o.CHANNEL_ID_01).then(r => resolveFunc(r));

    getVideos(this.o.CHANNEL_ID_02).then(r => resolveFunc(r));

    getVideos(this.o.CHANNEL_ID_03).then(r => resolveFunc(r));
  }
}