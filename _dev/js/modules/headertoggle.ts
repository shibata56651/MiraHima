export class headertoggle {
  o: { activeClass: string, closeClass: string, toggleHeight: number, closeStyle: string };
  element: HTMLElement;
  toggleRoots:  NodeListOf<Element>;
  targetContent: HTMLElement | null;
  toggleId: string;
  toggleFlg: boolean;
  openStyle: string;
  /**
   * @param  {Element} element rootとなる要素
   * @param  {Element} toggleRoots aタグ
   * @returns void
   */
  constructor(element: HTMLElement, toggleRoots:  NodeListOf<Element>) {
    const defaultOptions = {
      activeClass: 'is-active',
      closeClass: 'is-close',
      toggleHeight: 0,
      closeStyle: '0',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.toggleRoots = toggleRoots;
    this.targetContent = null;
    this.toggleId = '';
    this.openStyle = '';
    this.toggleFlg = true;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    this.element.addEventListener('click', this.clickHandler.bind(this));
  }

    /**
   * トグル機能
   *
   * @param  {MouseEvent} e クリックした要素
   * @returns void
   */
  clickHandler(e: MouseEvent) {
    e.preventDefault();
    const href = this.element.getAttribute('aria-controls');
    this.targetContent = href ? document.getElementById(href) : null;

    if (this.targetContent) {
      this.toggleId = this.targetContent ? this.targetContent.id : '';

      if (this.element.classList.contains(this.o.activeClass)) {
        this.targetContent.style.height = this.openStyle;

        setTimeout(() => {
          if (this.targetContent) {
            this.targetContent.style.height = this.o.closeStyle;
          }
        }, 10);

        setTimeout(() => {
          this.element.classList.remove(this.o.activeClass);
          this.closeHandler();
        }, 400);

        return;
      } else if (!this.element.classList.contains(this.o.activeClass)) {

        // 別のメガメニューテキストをクリックした際に、現在ついているカレントを外す
        for (const item of this.toggleRoots) {
          if (item.parentNode) {
            const targetContent: HTMLElement | null = item.parentNode.querySelector('.header-menu-contents');
            if (item.classList.contains(this.o.activeClass) && targetContent) {
              item.classList.remove(this.o.activeClass);
              targetContent.style.height = '';
            }
          }
        }

        this.element.classList.add(this.o.activeClass);
        this.o.toggleHeight = this.targetContent.offsetHeight;
        this.targetContent.style.height = this.o.closeStyle;
        this.openStyle = `${this.o.toggleHeight}px;`;

        // 更新されたDOMをoffsetHeightで再度読みに行く。
        this.targetContent.offsetHeight;
        this.targetContent.style.height = this.openStyle;

        setTimeout(() => {
          this.closeHandler();
        }, 300)
      }
    }
  }

  closeHandler() {
    if (this.targetContent) {
      this.targetContent.style.height = '';
    }
  }
}
