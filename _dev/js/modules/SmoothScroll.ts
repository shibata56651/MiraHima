import { offsetTop } from '../utility/OffsetTop';
/**
 * トップに戻る機能
 */
export class SmoothScroll {
  o: { offset: number; HeaderHeight: number; };
  element: HTMLAnchorElement | undefined;
  urlHash: string;
  href: string | undefined;
  scrollTarget: "" | HTMLElement | null | undefined;
  loadHref: HTMLElement | null | undefined;
  scrollFlg: boolean;
  scrollTargetPos: number;
  scrollHandler: () => void;

  /**
   * @param  {HTMLAnchorElement | undefined} element rootとなる要素
   * @returns void
   */
  constructor(element: HTMLAnchorElement | undefined, urlHash: string, options = {}) {
    const defaultOptions = {
      offset: 0,
      HeaderHeight: 53
    };

    this.o = Object.assign(defaultOptions, options);
    this.element = element;
    this.urlHash = urlHash;
    this.href = this.element && this.element.hash;
    this.loadHref = document.getElementById(this.urlHash.substring(1));
    this.scrollTarget = this.href === '#top' ? document.documentElement : this.href && document.getElementById(this.href.substring(1));
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
    this.element && this.element.addEventListener('click', this.clickHandler.bind(this));
    if (this.element === undefined && this.loadHref !== null) {
      window.addEventListener('load', this.loadHandler.bind(this));
    }
  }

  /**
   * クリック時スクロール対象要素までスクロール
   *
   * @param  {MouseEvent} e イベント
   * @returns void
   */
  clickHandler(e: MouseEvent) {
    if (!this.scrollTarget) {
      return;
    }

    e.preventDefault();

    if (document.body.clientWidth <= 1170) {
      this.o.HeaderHeight = 87;
    } else {
      this.o.HeaderHeight = 134;
    }

    this.scrollTargetPos = this.href === '#top' ? 0 : offsetTop(this.scrollTarget) - this.o.offset - this.o.HeaderHeight;

    history.pushState(null, '', this.href);

    window.scrollTo({
      top: this.scrollTargetPos,
      behavior: 'smooth'
    });

    this.scrollFlg = false;
    window.addEventListener('scroll', this.scrollHandler);
    this.setWatchScrollFlg();
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

    console.log(this.scrollTarget)

    if (this.loadHref) {
      this.scrollTargetPos = this.href === '#top' ? 0 : offsetTop(this.loadHref) - this.o.offset - this.o.HeaderHeight;
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
 * スクロール中はthis.scrollFlgをtrueにする処理
 *
 * @returns void
 */
  scrolling() {
    this.scrollFlg = true;
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

    this.scrollTargetPos = this.href === '#top' ? 0 : offsetTop(this.scrollTarget) - this.o.offset;

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
