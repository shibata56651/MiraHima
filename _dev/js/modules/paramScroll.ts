import { offsetTop } from '../utility/OffsetTop';
/**
 * パラメータから表示させたい要素までスクロールさせる機能
 */
export class paramScroll {
  o: { offset: number; };
  element: string;
  displayElms: HTMLElement;
  scrollTarget: HTMLElement | null;
  scrollFlg: boolean;
  scrollTargetPos: number;
  scrollHandler: () => void;

  /**
   * @param  {HTMLElement} element rootとなる要素
   * @param  {Element} displayElms aタグ要素
   * @returns void
   */
  constructor(element: string, displayElms: HTMLElement) {
    const defaultOptions = {
      offset: 134
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.displayElms = displayElms;
    this.scrollTarget = document.getElementById(this.element.substring(1));
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
    window.addEventListener('load', this.clickHandler.bind(this));
  }

  /**
   * クリック時スクロール対象要素までスクロール
   *
   * @param  {MouseEvent} e イベント
   * @returns void
   */
  clickHandler() {

    if (!this.scrollTarget) {
      return;
    }

    this.displayElms.classList.add('is-active');
    this.displayElms.style.display = 'none';
    if (document.body.clientWidth <= 1170) {
      this.o.offset = 87;
    }
    this.scrollTargetPos = offsetTop(this.scrollTarget) - this.o.offset;

    history.pushState(null, '', this.element);

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

    if (!hasTabindex) {
      this.scrollTarget.setAttribute('tabindex', '-1');
    }
    this.scrollTarget.focus();
    this.scrollTarget.blur();
    window.scrollTo(0, this.scrollTargetPos);
    if (!hasTabindex) {
      this.scrollTarget.removeAttribute('tabindex');
    }
  }
}
