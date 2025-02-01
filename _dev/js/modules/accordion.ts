export class accordion {
  o: { activeClass: string };
  element: HTMLElement | null;
  display: HTMLElement | null;
  roots: NodeListOf<Element> | null;
  category: string | undefined;

  /**
   * @param  {Element} elements rootとなる要素
   * @returns void
   */
  constructor(elements: HTMLElement | null, display: HTMLElement | null,  roots: NodeListOf<Element> | null, category: string) {
    const defaultOptions = {
      activeClass: 'is-active',
    };

    this.o = Object.assign(defaultOptions);
    this.element = elements;
    this.display = display;
    this.roots = roots;
    this.category = category;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    const width = window.innerWidth;

    if (width <= 768) {
      this.element?.addEventListener('click', this.clickFunc.bind(this));
    }
  }

  fadeAnimation(target: HTMLElement, kind: 'open' | 'close') {
    if (target) {
      target.style.display = 'block';
      this.category === 'footer' ? target.style.padding = '10px 24px' : null;
      const targetHeight = target.scrollHeight;

      kind === 'open' ? target.style.height = '0' : target.style.height = targetHeight + 'px';
      target.style.height = targetHeight + 'px';

      const fadeAnimation = this.category === 'footer' && kind === 'open' ? target.animate(
        { height: ['0', targetHeight + 'px'], padding: ['0', '10px 24px'] },
        { duration: 600, easing: 'ease' }
      ) : target.animate(
        { height: [targetHeight + 'px', '0'], padding: ['10px 24px', '0'] },
        { duration: 600, easing: 'ease' }
      );

      fadeAnimation.onfinish = () => {
        target && (kind === 'open' ? target.style.height = targetHeight + 'px' : target.style.height = '0');
        target && (this.category === 'footer' && kind === 'open' ? target.style.height = target.style.padding = '10px 24px' : target.style.padding = '0');
      };
    }
  }

  /**
   * ページロード時に情報を取得
   *
   * @returns void
   */
  clickFunc(e: { preventDefault: () => void; }) {
    e.preventDefault();

    if (this.element?.classList.contains(this.o.activeClass)) {
      this.element?.classList.remove(this.o.activeClass);
      this.display?.classList.remove(this.o.activeClass);
      this.display && this.fadeAnimation(this.display, 'close');

      return;
    }

    this.roots?.forEach(element => {
      const target: HTMLElement | null = element.querySelector('.js-accordion-target');
      const display: HTMLElement | null = element.querySelector('.js-accordion-display');

      if (target?.classList.contains(this.o.activeClass)) {
        target?.classList.remove(this.o.activeClass);
      }

      if (display?.classList.contains(this.o.activeClass)) {
        display?.classList.remove(this.o.activeClass);
        display && this.fadeAnimation(display, 'close');
      }
    });

    this.element?.classList.add(this.o.activeClass);
    this.display?.classList.add(this.o.activeClass);
    this.display && this.fadeAnimation(this.display, 'open');
  }
}
