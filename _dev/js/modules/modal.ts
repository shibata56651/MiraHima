import {setTabIndex, removeTabIndex} from "../utility/tabIndex";

export class Modal {
  o: { activeClass: string, focusElem: string };
  element: HTMLElement;
  modalOverlay: HTMLElement;
  targetElm: HTMLElement | null;
  modalContent: NodeListOf<Element>;
  disableItem: undefined;
  targetContent: HTMLElement | null;
  topElm: number | null;
  activeModalId: string;
  closeBtn: Element | null;
  youtube: any;

  /**
   * @param  {Element} element rootとなる要素
   * @param  {Element} modalOverlay モーダル起動時の黒背景
   * @returns void
   */
  constructor(element: HTMLElement, modalOverlay: HTMLElement) {
    const defaultOptions = {
      activeClass: 'is-active',
      focusElem: 'a, input, button, option',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;
    this.modalOverlay = modalOverlay;
    this.targetElm = element.querySelector('.dropdown-text');
    this.modalContent = document.querySelectorAll('.js-modal-content');
    this.disableItem = undefined;
    this.targetContent = null;
    this.topElm = null;
    this.activeModalId = '';
    this.closeBtn = null;
    this.youtube;

    this.init();
  }

  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    this.element.addEventListener('click', this.clickHandler.bind(this));
    window.addEventListener('keyup', this.escKeyEvent.bind(this));
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', this.removeModal.bind(this));
    }
    this.modalOverlay.addEventListener('click', this.removeModal.bind(this));
  }


  /**
   * モーダルを活性状態にする処理
   *
   * @param  {object} targetElm 押下したa要素のhref属性と一致するid持つ要素
   */
  activeModal(targetElm: HTMLElement) {
    const modalFocusItems = targetElm.querySelectorAll(this.o.focusElem);

    this.modalOverlay.classList.add(this.o.activeClass);
    targetElm.classList.add(this.o.activeClass);
    setTabIndex();

    // 背景固定
    document.body.classList.add('is-modal-fixed');
    document.body.style.top = `-${this.topElm}px`;

    for (const modalFocusItem of modalFocusItems) {
      modalFocusItem.setAttribute('tabIndex', '0');
    }
  };


  /**
   * クリック時itemの中のコンテンツを表示する
   *
   * @param  {MouseEvent} e クリックした要素
   * @returns void
   */
  clickHandler(e: MouseEvent) {
    const href = this.element.getAttribute('href');

      this.targetContent = href ? document.getElementById(href.substring(1)) : null;

      if (this.targetContent) {
        this.closeBtn = this.targetContent.querySelector('.js-modal-close');
        this.topElm = window.scrollY;

        // youtube動画がある場合、youtube APIを有効
        if (this.targetContent.querySelector('.lyt-movie-a > .lyt-movie-inner > iframe')) {
          this.youtube = this.targetContent.querySelector('.lyt-movie-a > .lyt-movie-inner > iframe');
          const dataSrcFlg = this.youtube.hasAttribute('data-src');
          if (dataSrcFlg && !this.youtube.src) {
            this.youtube.src = this.youtube.dataset.src;
          }

          const srcAttr = dataSrcFlg ? 'data-src' : 'src';
          let srcTxt = this.youtube.getAttribute(srcAttr);
          const separator = srcTxt.indexOf('?') !== -1 ? '&' : '?';

          if (srcTxt.indexOf('enablejsapi=1') === -1) {
            srcTxt += `${separator}enablejsapi=1`;

            this.youtube.setAttribute(srcAttr, srcTxt);
          }

        this.activeModalId = this.targetContent.id;
        e.preventDefault();
        this.activeModal(this.targetContent);
      }
      }
  };


  /**
   * モーダルを非活性にする処理
   */
  removeModal() {
    const targetHook: HTMLElement | null = document.querySelector(`[href="#${this.activeModalId}"]`);

    document.body.classList.remove('is-modal-fixed');
    document.body.style.top = '';
    this.topElm && window.scrollTo(0, this.topElm);

    removeTabIndex();
    if (targetHook) {
      for (const modalItem of this.modalContent) {
        if (modalItem.classList.contains(this.o.activeClass)) {
          modalItem.classList.remove(this.o.activeClass);
          this.modalOverlay.classList.remove(this.o.activeClass);
        }
      }

      targetHook.focus(); // フックにフォーカスを戻す
    }

    // モーダル消去時youtube再生を停止する
    if (this.youtube) {
      this.youtube.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    }
  };

  /**
   * escキーが押された際に、モーダルを削除
   *
   * @param  {KeyboardEvent} event ESCキーのイベント
   */
  escKeyEvent(event: KeyboardEvent) {
    for (const modalItem of this.modalContent) {
      if (modalItem.classList.contains(this.o.activeClass)) {
        const keyEvent = event.key;

        if (keyEvent === 'Escape' || keyEvent === 'Esc') {
          this.removeModal();
        }
      }
    }
  };
}
