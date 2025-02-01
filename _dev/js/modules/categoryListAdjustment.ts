export class categoryListAdjustment {
  o: { activeClass: string };
  item: HTMLElement | null;
  categoryListRoots: NodeListOf<HTMLElement> | null;
  categoryListItems: NodeListOf<HTMLElement> | undefined;

  /**
   * @param  {Element} elements rootとなる要素
   * @returns void
   */
  constructor(item: HTMLElement | null, categoryListRoots: NodeListOf<HTMLElement> | null) {
    const defaultOptions = {
      activeClass: 'is-active',
    };

    this.o = Object.assign(defaultOptions);
    this.item = item;
    this.categoryListRoots = categoryListRoots;
    this.categoryListItems = this.item?.querySelectorAll('.js-category-adjustment__target');
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
      window.addEventListener('load', this.loadEvent.bind(this));
      window.addEventListener('resize', this.loadEvent.bind(this));
  }

  /**
   * ページロード時に情報を取得
   *
   * @returns void
   */
  loadEvent() {
    const width = window.innerWidth;

    if (width <= 768) {
      if (this.categoryListItems && this.categoryListItems.length % 2 !== 0) {
        this.categoryListItems?.forEach((item, index) => {
          if (this.categoryListItems && index === this.categoryListItems.length - 1) {
            item.style.width = '100%';
          } else {
            item.style.width = '50%';
          }
        })
      } else {
        this.categoryListItems?.forEach((item) => {
          item.style.width = '50%';
        })
      }
    } else {
      this.categoryListItems?.forEach((item) => {
        item.style.width = `calc(100% / ${this.categoryListItems?.length})`
      })
    }
  }
}
