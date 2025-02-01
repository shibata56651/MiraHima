import { offsetTop } from '../utility/OffsetTop';

export class tab {
  o: { activeClass: string, tabItem: HTMLElement, HeaderHeight: number, offset: number};
  element: HTMLButtonElement;
  urlHash: string;
  roots: NodeListOf<HTMLElement>;
  href: string | undefined;
  scrollTarget: "" | HTMLElement | null | undefined;
  loadHref: HTMLElement | null | undefined;
  displayItem: NodeListOf<HTMLElement> | null;
  contentTarget: string | null;
  content: HTMLElement | null;
  scrollFlg: boolean;
  scrollTargetPos: number;
  scrollHandler: () => void;

  /**
   * @param  {HTMLButtonElement} element rootとなる要素
   * @returns void
   */
  constructor(element: HTMLButtonElement, roots: NodeListOf<HTMLElement>, urlHash: string, displayTarget: NodeListOf<HTMLElement>) {
    const defaultOptions = {
      activeClass: 'is-active',
      offset: 0,
      HeaderHeight: 53
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.roots = roots;
    this.urlHash = urlHash;
    this.loadHref = document.getElementById(this.urlHash.substring(1));
    this.scrollTarget = this.href && document.getElementById(this.href.substring(1));
    this.displayItem = displayTarget;
    this.scrollTargetPos = 0;
    this.contentTarget = this.element.getAttribute('aria-controls');
    this.content = this.contentTarget ? document.getElementById(this.contentTarget) : null;
    this.scrollFlg = false;
    this.scrollTargetPos = 0;
    this.scrollHandler = this.scrolling.bind(this);

    this.init();
  }

  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    // モーダル発火
    window.addEventListener('load', this.loadHandler.bind(this));
    this.element.addEventListener('click', this.clickHandler.bind(this));
  }

  /**
   * スクロール中はthis.scrollFlgをtrueにする処理
   *
   * @returns void
   */
    scrolling() {
      this.scrollFlg = true;
    }

  /**
   * @returns 発火ボタンのイベント
   */
  clickHandler() {
    for (const item of this.roots) {
      item.parentElement?.classList.remove(this.o.activeClass);
    }

    if (this.displayItem) {
      for (const item of this.displayItem) {
        item.classList.remove(this.o.activeClass);
      }
    }

    this.element.parentElement?.classList.add(this.o.activeClass);
    this.content?.classList.add(this.o.activeClass);
    }

    /**
   * ページロード時の処理
   *
   * @returns void
   */
  loadHandler() {
    if (document.body.clientWidth <= 1170) {
      this.o.HeaderHeight = 20;
    } else {
      this.o.HeaderHeight = 53;
    }

    for (const item of this.roots) {
      item.parentElement?.classList.remove(this.o.activeClass);
      if (item.parentElement?.id === this.urlHash.substring(1)) {
        item.parentElement?.classList.add(this.o.activeClass);
      }
    }

    if (this.displayItem) {
      for (const item of this.displayItem) {
        item.classList.remove(this.o.activeClass);
        if (item.getAttribute("aria-labelledby") === this.urlHash.substring(1)) {
          item.classList.add(this.o.activeClass);
        }
      }
    }

    if (this.loadHref) {
      this.scrollTargetPos = offsetTop(this.loadHref) - this.o.offset - this.o.HeaderHeight;
    }

    window.scrollTo({
      top: this.scrollTargetPos,
      behavior: 'smooth'
    });

    this.scrollFlg = false;
    window.addEventListener('scroll', this.scrollHandler);
    this.setWatchScrollFlg();
  }

  /**
   * スクロール中のthis.scrollFlgを監視する処理
   *
   * @returns void
   */
    setWatchScrollFlg() {
      const watchScrollFlg = setInterval(() => {
        if (!this.scrollFlg) {
          clearInterval(watchScrollFlg);
          window.removeEventListener('scroll', this.scrollHandler);
          this.setFocusTarget();

          return;
        }

        this.scrollFlg = false;
      }, 100);
    }

  /**
   * 対象要素までスクロールが到達した時の処理
   *
   * @returns void
   */
  setFocusTarget() {
    if (!this.scrollTarget) {
      return;
    }

    const hasTabindex = this.scrollTarget.hasAttribute('tabindex');

    this.scrollTargetPos = offsetTop(this.scrollTarget) - this.o.offset;

    if (!hasTabindex) {
      this.scrollTarget.setAttribute('tabindex', '-1');
    }
    this.scrollTarget.focus();
    this.scrollTarget.blur();
    if (!hasTabindex) {
      this.scrollTarget.removeAttribute('tabindex');
    }
  }
}
