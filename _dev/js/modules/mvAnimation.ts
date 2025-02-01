export class mvAnimation {
  element: HTMLElement;
  items: NodeListOf<Element> | undefined;

  /**
   * @param  {Element} element rootとなる要素
   * @param  {Element} dropdownRoots rootsとなる要素（別のrootクリック時の非表示処理に使用する）
   * @param  {Element} closeBtn 閉じるボタンとなる要素
   * @returns void
   */
  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  /**
   * 初期化処理
   * @returns void
   */
  init() {
    window.addEventListener('load', this.loadHandler.bind(this));
  }

  /**
   * 閉じるボタン押下時、表示している要素の表示処理
   */
  loadHandler() {
    this.items = this.element.querySelectorAll('.mv__animation-wrap--text');

    for (const item of this.items) {
      item.addEventListener('animationstart', () => {
        const animationItems = item.querySelectorAll('.view-item');
        let setAnimationCount = 0;

        const setAnimation = setInterval(() => {
          setAnimationCount++;

          if(setAnimationCount === animationItems.length) {
            clearInterval(setAnimation);
          }

          animationItems[setAnimationCount].classList.add('is-display');
        }, 400);
      })
    }
  }
}
