export class jsonGetData {
  o: { activeClass: string, changeClass: string, pauseClass: string, jsonPath: string, count: number };
  elements: HTMLElement;
  carouselBtn: HTMLElement | null;
  jsonObj: {};
  obj: XMLHttpRequest;
  json_data: any;
  ul_element: HTMLUListElement | undefined;
  /**
   * @param  {Element} elements rootとなる要素
   * @returns void
   */
  constructor(elements: HTMLElement) {
    const defaultOptions = {
      activeClass: 'is-active',
      changeClass: 'is-changing',
      pauseClass: 'is-pause',
      jsonPath: '/common/data/newsData.json',
      count: 0,
    };

    this.o = Object.assign(defaultOptions);
    this.elements = elements;
    this.carouselBtn = document.querySelector('.js-carousel-mv-btn');
    this.jsonObj = {};
    this.obj = new XMLHttpRequest();
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
   * ページロード時にスライドショーを再生する
   *
   * @returns void
   */
  getDataFunc() {
    // 取得したレスポンスをページに表示
    // console.log(JSON.parse(this.responseText))

    this.obj.open('get', this.o.jsonPath, false);

    const _this = this;
    this.obj.onreadystatechange = function () {
        try {
            _this.jsonObj = JSON.parse(this.responseText);
        } catch (e) {

        }
    };
    this.obj.send(null);

    this.json_data = JSON.parse(JSON.stringify(this.jsonObj));
    this.ul_element = document.createElement('ul');

    for(let data in this.json_data) {
      const li_element = document.createElement('li');
      li_element.classList.add('list-person');
      li_element.innerHTML = `<div class="list-person__content">
      <p class="person-name">${this.json_data[data].name}</p>
      <p class="release-day">(リリース日：${this.json_data[data].details.photo_number})</p>
      </div>`;

      this.ul_element.appendChild(li_element);
    }

    this.elements.appendChild(this.ul_element);
  }
}
