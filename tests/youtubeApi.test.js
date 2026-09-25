const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const compiled = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, '../_dev/js/modules/youtubeApi.ts'), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2016 } },
).outputText;
const apiExports = {};
new Function('exports', compiled)(apiExports);
const { youtubeApi } = apiExports;

let api;
const success = data => ({ ok: true, status: 200, json: async () => data });
const video = (id, status, details) => ({
  id,
  snippet: { liveBroadcastContent: status, title: '<配信タイトル>', channelTitle: 'チャンネル', thumbnails: { high: { url: 'https://example.com/image.jpg' } } },
  ...(details ? { liveStreamingDetails: details } : {}),
});

function mockApi(videos, playlist = [{ snippet: { resourceId: { videoId: 'v1' } } }]) {
  global.fetch = jest.fn(async url => {
    const endpoint = new URL(url).pathname.split('/').pop();
    if (endpoint === 'channels') return success({ items: [{ contentDetails: { relatedPlaylists: { uploads: 'uploads' } } }] });
    if (endpoint === 'playlistItems') return success({ items: playlist });
    if (endpoint === 'videos') return success({ items: videos });
    throw new Error('Unexpected API endpoint');
  });
}

beforeEach(() => {
  // 呼び出すタイミングをテスト側で制御する。
  jest.spyOn(youtubeApi.prototype, 'init').mockImplementation(() => {});
  document.body.innerHTML = '<div id="current"></div><div id="scheduled"></div>';
  api = new youtubeApi(document.getElementById('current'), document.getElementById('scheduled'));
});
afterEach(() => { jest.restoreAllMocks(); delete global.fetch; });

test('少数の取得結果・通常動画・削除済み動画で例外が発生しない', async () => {
  mockApi([video('normal', 'none'), {}, { id: 'missing-snippet' }]);
  await expect(api.onJSClientLoad()).resolves.toBeUndefined();
  expect(document.querySelectorAll('li')).toHaveLength(0);
  expect(api.liveMessage.textContent).toContain('現在配信中の動画はありません');
  const requests = global.fetch.mock.calls.map(([url]) => new URL(url));
  expect(requests).toHaveLength(6);
  expect(requests.filter(url => url.pathname.endsWith('/videos'))).toHaveLength(2);
  expect(requests.every(url => !url.toString().includes('undefined'))).toBe(true);
});

test('空のプレイリストでは動画情報APIを呼ばない', async () => {
  mockApi([], []);
  await api.onJSClientLoad();
  expect(global.fetch).toHaveBeenCalledTimes(4);
  expect(api.reservationMessage.hidden).toBe(false);
});

test('配信時刻やmaxres画像がなくても配信中と配信予定を表示できる', async () => {
  mockApi([video('current', 'live'), video('scheduled', 'upcoming')]);
  await api.onJSClientLoad();
  expect(api.liveRoot.children).toHaveLength(2);
  expect(api.reservationRoot.children).toHaveLength(2);
  expect(api.liveRoot.classList.contains('youtube-list--col2')).toBe(true);
  expect(api.reservationRoot.classList.contains('youtube-list--col2')).toBe(true);
  expect(api.liveRoot.querySelector('img').src).toBe('https://example.com/image.jpg');
  expect(api.liveRoot.querySelector('.youtube-content__items-text').textContent).toBe('<配信タイトル>');
  expect(document.querySelectorAll('.details-content')).toHaveLength(0);
  expect(api.liveMessage.hidden).toBe(true);
});

test('サムネイルが一切なくても動画へのリンクを表示する', async () => {
  mockApi([{ id: 'no-thumbnail', snippet: { liveBroadcastContent: 'live', title: '配信を見る' } }]);
  await api.onJSClientLoad();
  expect(api.liveRoot.querySelector('a').textContent).toBe('配信を見る');
  expect(api.liveRoot.querySelector('a').href).toContain('watch?v=no-thumbnail');
});

test('配信予定時刻を日付をまたいで日本時間に変換し、不正な時刻は無視する', async () => {
  mockApi([
    video('scheduled', 'upcoming', { scheduledStartTime: '2026-09-24T18:05:00Z' }),
    video('invalid-date', 'upcoming', { scheduledStartTime: 'invalid' }),
  ]);
  await api.onJSClientLoad();
  expect(document.querySelector('.details-content__items-scheduled-date').textContent).toBe('2026/09/25');
  expect(document.querySelector('.details-content__items-scheduled-time').textContent).toBe('03:05');
  expect(document.querySelectorAll('.details-content')).toHaveLength(2);
});

test.each(['http', 'network', 'malformed', 'empty-channel', 'json'])(
  'API取得失敗(%s)を処理して取得失敗の案内を表示する', async kind => {
    global.fetch = jest.fn(async () => {
      if (kind === 'network') throw new Error('Network unavailable');
      if (kind === 'http') return { ok: false, status: 403, json: async () => ({ error: { code: 403 } }) };
      if (kind === 'json') return { ok: true, status: 200, json: async () => { throw new Error('Invalid JSON'); } };
      return success(kind === 'empty-channel' ? { items: [] } : {});
    });
    await expect(api.onJSClientLoad()).resolves.toBeUndefined();
    expect(api.liveMessage.textContent).toContain('取得できませんでした');
    expect(api.reservationMessage.textContent).toContain('取得できませんでした');
    expect(api.liveMessage.hidden).toBe(false);
  },
);

test('1チャンネルが失敗しても残りのチャンネルを表示する', async () => {
  mockApi([video('current', 'live')]);
  const fetchSuccess = global.fetch;
  global.fetch = jest.fn(url => {
    if (new URL(url).searchParams.get('id') === api.o.CHANNEL_ID_01) return Promise.reject(new Error('Unavailable'));
    return fetchSuccess(url);
  });
  await api.onJSClientLoad();
  expect(api.liveRoot.children).toHaveLength(1);
  expect(api.liveMessage.hidden).toBe(false);
  expect(api.liveMessage.textContent).toContain('取得できませんでした');
});
