import {setSpMenuTabIndex, removeTabIndex} from "../utility/tabIndex";

export class spMenuToggleBtn {
  o: { activeClass: string, closeClass: string, fixedClass: string };;
  element: HTMLElement;
  topElm: number;
  judgeElms: NodeListOf<Element>;
  menuStatusTxt: Element | null;
  toggleCircle: HTMLElement | null;

  /**
   * @param  {Element} element rootとなる要素
   * @returns void
   */
  constructor(element: HTMLElement) {
    const defaultOptions = {
      activeClass: 'is-active',
      closeClass: 'is-close',
      fixedClass: 'is-fixed',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.topElm = 0;
    this.judgeElms = document.querySelectorAll('.js-header-menu-items');
    this.menuStatusTxt = null;
    const newCircle = document.createElement('div');
    newCircle.id = 'js-menu-circle';
    document.body.appendChild(newCircle);
    this.toggleCircle = document.getElementById('js-menu-circle');
    this.init();
  }

  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    addEventListener('resize', this.menuResizeHandler.bind(this));
    this.element.addEventListener('click', this.menuClickHandler.bind(this));
  }

  /**
   * SPメニューボタン押下時の処理
   *
   * @returns void
   */
  menuClickHandler() {
    this.menuStatusTxt = document.querySelector('.js-menu-status');

    // ボタンが押されていない状態
    if (this.element.parentElement?.classList.contains(this.o.activeClass)) {
      this.element.parentElement.classList.add(this.o.closeClass);
      this.element.parentElement.classList.remove(this.o.activeClass);
      this.toggleCircle?.classList.add(this.o.closeClass);
      this.toggleCircle?.classList.remove(this.o.activeClass);
      document.body.classList.remove(this.o.fixedClass);
      document.body.style.top = '';
      window.scrollTo(0, this.topElm);

      if (document.body.clientWidth <= 1024) {
        removeTabIndex();
      }

      setTimeout(() => {
        if (this.toggleCircle) {
          this.toggleCircle.style.top = '';
          this.toggleCircle.classList.remove(this.o.closeClass);
          this.element.parentElement?.classList.remove(this.o.closeClass);
        }
      }, 700);

      if (this.menuStatusTxt?.textContent === '閉じる') {
        this.menuStatusTxt.innerHTML = '開く';
      }

      return;

      // ボタンが押されている状態
    } else if (!this.element.parentElement?.classList.contains(this.o.activeClass)) {
      this.topElm = window.scrollY;
      this.element.parentElement?.classList.add(this.o.activeClass);
      this.element.parentElement?.classList.remove(this.o.closeClass);

      if (this.toggleCircle) {
        this.toggleCircle.style.top = `${this.topElm}px`;
        this.toggleCircle.classList.add(this.o.activeClass);
        this.toggleCircle.classList.remove(this.o.closeClass);
      }

      document.body.classList.add(this.o.fixedClass);
      document.body.style.top = `-${this.topElm}px`;

      if (document.body.clientWidth <= 1024) {
        setSpMenuTabIndex(true, this.judgeElms);
      }

      if (this.menuStatusTxt?.textContent === '開く') {
        this.menuStatusTxt.innerHTML = '閉じる';
      }
    }
  }

  menuResizeHandler() {
    if (document.body.clientWidth <= 1024) {
      return;
    } else {
      if (this.toggleCircle?.classList.contains(this.o.activeClass)) {
        this.element.parentElement?.classList.add(this.o.closeClass);
        this.element.parentElement?.classList.remove(this.o.activeClass);
        this.toggleCircle.classList.add(this.o.closeClass);
        this.toggleCircle.classList.remove(this.o.activeClass);
        document.body.classList.remove(this.o.fixedClass);
        document.body.style.top = '';

        setTimeout(() => {
          if (this.toggleCircle) {
            this.toggleCircle.style.top = '';
            this.toggleCircle.classList.remove(this.o.closeClass);
          }

          this.element.parentElement?.classList.remove(this.o.closeClass);
        }, 700);

        if (this.menuStatusTxt?.textContent === '閉じる') {
          this.menuStatusTxt.innerHTML = '開く';
        }
      }
    }
  }
}
