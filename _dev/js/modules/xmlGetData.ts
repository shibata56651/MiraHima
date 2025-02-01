export class xmlGetData {
  o: { activeClass: string, closeClass: string, changeClass: string, count: number, xmlPath: string };
  elements: HTMLElement;
  count: number;
  items: NodeListOf<Element> | null;
  ul_element: HTMLUListElement | null;

  /**
   * @param  {HTMLElement} elements rootとなる要素
   * @returns void
   */
  constructor(elements: HTMLElement, num: number) {
    const defaultOptions = {
      activeClass: 'is-active',
      changeClass: 'is-changing',
      pauseClass: 'is-pause',
      xmlPath: '/common/data/newsData.xml',
      count: 0,
    };

    this.o = Object.assign(defaultOptions);
    this.elements = elements;
    this.count = num;
    this.items = null;
    this.ul_element = null;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    window.addEventListener('DOMContentLoaded', this.getDataFunc.bind(this));
  }

  /**
   * ページロード時に情報を取得
   *
   * @returns void
   */
  getDataFunc() {
    // 取得したレスポンスをページに表示

    fetch(this.o.xmlPath)
    .then(response => response.text()) // (2) レスポンスデータを取得
    .then(data => { // (3)レスポンスデータを処理

      const parser = new DOMParser();
      const sitemap = parser.parseFromString(data, "application/xml");

      const nowDate = new Date();
      const nowYear = String(nowDate.getFullYear());
      const nowMonth = String(nowDate.getMonth() + 1).padStart(2, '0');
      const nowDay = String(nowDate.getDate()).padStart(2, '0');
      let displayCount = 0;

      this.items = sitemap.querySelectorAll('item');
      this.ul_element = document.createElement('ul');

        this.items.forEach((data, index) => {
          const id = data.querySelector('id');
          const maxLength = this.elements.dataset.displayLength;

          if (maxLength ? this.count === 99 ? (displayCount < 3) : (displayCount < Number(maxLength) && this.count === Number(id?.innerHTML)) : (this.count === Number(id?.innerHTML))) {
            const listingDate = data.querySelector('listingDate');
            const limitDate = data.querySelector('limitDate');
            const anchor = data.querySelector('anchor');

            if (listingDate ? (limitDate ? (limitDate.innerHTML.split('/').join('') > nowYear+nowMonth+nowDay && listingDate.innerHTML.split('/').join('') <= nowYear+nowMonth+nowDay) : (listingDate.innerHTML.split('/').join('') <= nowYear+nowMonth+nowDay)) : false) {
              displayCount++;

              const text = data.querySelector('text');

              const liElement = document.createElement('li');
              const anchorParentElement = document.createElement('a');
              const divChildDateElement = document.createElement('div');
              const divChildContentsElement = document.createElement('div');
              const spanDateElement = document.createElement('span');
              const spanContentsElement = document.createElement('span');

              anchorParentElement.setAttribute('href', `${anchor?.innerHTML}`)
              liElement.appendChild(anchorParentElement);
              anchorParentElement.appendChild(divChildDateElement);
              anchorParentElement.appendChild(divChildContentsElement);
              divChildDateElement.appendChild(spanDateElement);
              divChildContentsElement.appendChild(spanContentsElement);
              liElement.classList.add('news-contents-list__list');

              anchorParentElement.classList.add('news-contents-list__anchor');
              divChildDateElement.classList.add('news-contents-list__date');
              divChildContentsElement.classList.add('news-contents-list__content');
              spanDateElement.classList.add('news-contents-list__date-text');
              spanContentsElement.classList.add('news-contents-list__content-text');
              spanDateElement.innerHTML = `${listingDate?.textContent}`;
              spanContentsElement.innerHTML = `${text?.textContent}`;
              this.ul_element?.appendChild(liElement);
            }
          }
        });

      this.elements.appendChild(this.ul_element);
    });
  }
}
