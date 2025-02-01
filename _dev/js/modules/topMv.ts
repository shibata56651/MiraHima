export class topMv {
  o: { activeClass: string, changeClass: string, pauseClass: string, count: number };
  elements: HTMLElement;
  clientHeight: number;

  /**
   * @param  {HTMLElement} elements rootとなる要素
   * @returns void
   */
  constructor(elements: HTMLElement) {
    const defaultOptions = {
      activeClass: 'is-active',
      changeClass: 'is-changing',
      pauseClass: 'is-pause',
      count: 0,
    };

    this.o = Object.assign(defaultOptions);
    this.elements = elements;
    this.clientHeight = document.documentElement.clientHeight;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    window.addEventListener('load', this.mvHeightSetting.bind(this));
  }

  /**
   * ページロード時に画面サイズを取得し、動画の高さを指定する
   *
   * @returns void
   */
  mvHeightSetting() {
    this.elements.style.height = `${this.clientHeight}px`
  }
}
