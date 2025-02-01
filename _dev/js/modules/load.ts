export class load {
  o: { animationClass: string, activeClass: string, closeClass: string, toggleHeight: number };
  element: HTMLElement;
  /**
   * @param  {Element} element rootとなる要素
   * @param  {Element} toggleRoots .js-toggle-roots
   * @returns void
   */
  constructor(element: HTMLElement) {
    const defaultOptions = {
      animationClass: 'is-animation',
      activeClass: 'is-active',
      closeClass: 'is-close',
      toggleHeight: 0,
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    window.addEventListener('load', this.loadHandler.bind(this));
  }

  /**
 * ローディング機能
 *
 * @param
 * @returns void
 */
  loadHandler() {
    // ローディング画面
    const images = document.getElementsByTagName('img'); // ページ内のimgタグを取得
    const loadingRoot = document.querySelector('.loading');
    let imgCounting = 0;
    let baseCounting = 0;

    // 画像の読み込み
    for (let i = 0; i < images.length; i++) {
      const img = new Image(); // 新たなimg要素を作成
      // 画像読み込み完了したとき
      img.onload = function () {
        imgCounting += 1;
      }
      // 画像読み込み失敗したとき
      img.onerror = function () {
        imgCounting += 1;
      }
      img.src = images[i].src; // ソースのパスを設定
    };

    // setIntervalを使って一定時間ごとに処理を繰り返す
    const nowLoading: any = setInterval(() => {
      // baseCountingがimgCountingより大きくならない条件の場合に処理を実行させる。2回目以降にページを読み込んだ時に画像の読み込み履歴が残っている関係で、ローディング画面の表示が速く終わってしまうため、その対策として条件をつけている。
      if (baseCounting <= imgCounting) {
        baseCounting += 1;

        // 全て読み込んだ時
        if (baseCounting === images.length) {
          setTimeout(function () {
            // ローディング画面全体の非表示
            loadingRoot?.classList.add('is-load');
            const loadedScreen = document.createElement('span');
            loadedScreen.classList.add('js-screen');
            document.body.appendChild(loadedScreen);
            // ローディングの終了
            clearInterval(nowLoading);
          }, 300);
        }
      }
    }, 50);

    nowLoading();
  }
}
