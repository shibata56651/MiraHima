export class fade {
  o: { activeFadeClass: string, activeSlideLeftClass: string, activeSlideRightClass: string };
  element: HTMLElement;
  /**
   * @param  {Element} element rootとなる要素
   * @returns void
   */
  constructor(element: HTMLElement) {
    const defaultOptions = {
      activeFadeClass: 'is-fade',
      activeSlideLeftClass: 'is-slide-left',
      activeSlideRightClass: 'is-slide-right',
    };

    this.o = Object.assign(defaultOptions);
    this.element = element;

    window.addEventListener('scroll', () => {
      this.scrollHandler();
    });
  }

  /**
   * @param  {object} event 発火ボタンのイベント
   */
  scrollHandler() {
    const position = Math.floor(window.innerHeight * .6);
    const offsetTop = Math.floor(this.element.getBoundingClientRect().top);

    if (offsetTop < position) {
      if (this.element.dataset.fadeKind === 'fade') {
        this.element.classList.add(this.o.activeFadeClass);
      } else if (this.element.dataset.fadeKind === 'slideLeft') {
        this.element.classList.add(this.o.activeSlideLeftClass);
      } else if (this.element.dataset.fadeKind === 'slideRight') {
        this.element.classList.add(this.o.activeSlideRightClass);
      }
    }
  }
}
