export class historyAnimation {
  o: { activeClass: string };
  element: HTMLElement;
  /**
   * @param  {Element} element rootとなる要素
   * @returns void
   */
  constructor(element: HTMLElement) {
    const defaultOptions = {
      activeClass: 'is-animation',
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
   * トグル機能
   *
   * @param  {MouseEvent} e クリックした要素
   * @returns void
   */
  loadHandler() {
    setTimeout(() => {
      this.element.classList.add(this.o.activeClass);
    }, 1000)
  }
}
