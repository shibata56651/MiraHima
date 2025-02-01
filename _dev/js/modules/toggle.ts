export class Toggle {
  o: { animationClass: string, activeClass: string, closeClass: string, toggleHeight: number, closeStyle: string, openStyle: string };
  element: HTMLElement;
  elementItem: any;
  elementBtn: any;
  toggleRoots: NodeListOf<HTMLElement>;
  toggleJudge: {};
  targetContent: HTMLElement | null;
  fixedItem: undefined;
  toggleId: string;

  /**
   * @param  {Element} element rootとなる要素
   * @param  {Element} toggleRoots .js-toggle-roots
   * @returns void
   */
  constructor(element: HTMLElement, toggleRoots: NodeListOf<HTMLElement>, toggleJudge = {}) {
    const defaultOptions = {
      animationClass: 'is-animation',
      activeClass: 'is-active',
      closeClass: 'is-close',
      toggleHeight: 0,
      closeStyle: '0',
      openStyle: '',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.elementItem = this.element.querySelector('.js-toggle-item');
    this.elementBtn = this.element.querySelector('.js-toggle-btn');
    this.toggleRoots = toggleRoots;
    this.toggleJudge = toggleJudge;
    this.targetContent = null;
    this.fixedItem = undefined;
    this.toggleId = '';
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    this.elementItem.addEventListener('click', this.clickHandler.bind(this));

    if (this.elementBtn) {
      this.elementBtn.addEventListener('click', this.clickHandler.bind(this));
    }
  }

  /**
 * トグル機能
 *
 * @param  {MouseEvent} e クリックした要素
 * @returns void
 */
  clickHandler(e: MouseEvent) {
    e.preventDefault();
    const href = this.elementItem.getAttribute('href').substring(1);
    this.targetContent = document.getElementById(href);
    this.targetContent ? this.toggleId = this.targetContent.id : null;

    if (this.element.classList.contains(this.o.activeClass)) {
      this.targetContent ? this.targetContent.style.height = this.o.openStyle : '';

      setTimeout(() => {
        this.targetContent ? this.targetContent.style.height = this.o.closeStyle : '';
      }, 10);

      setTimeout(() => {
        this.element.classList.remove(this.o.activeClass);
        this.element.classList.remove(this.o.animationClass);
        this.closeHandler();
      }, 400);

        this.o.openStyle = `${this.o.toggleHeight}px`;

      return;
    } else if (!this.element.classList.contains(this.o.activeClass)) {
      // 別のメガメニューテキストをクリックした際に、現在ついているカレントを外す

      setTimeout(() => {
        this.element.classList.add(this.o.activeClass);

        if (this.targetContent) {
          this.o.toggleHeight = this.targetContent.offsetHeight + 10;
          this.targetContent.style.height = this.o.closeStyle;
          this.o.openStyle = `${this.o.toggleHeight}px`;

          // 更新されたDOMをoffsetHeightで再度読みに行く。
          this.targetContent.offsetHeight;
          this.targetContent.style.height = this.o.openStyle;
        }
      }, 50)
    }
  }

  closeHandler() {
    this.targetContent ? this.targetContent.style.height = '' : '';
  }
}
