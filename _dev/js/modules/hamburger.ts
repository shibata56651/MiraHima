export class hamburger {
  o: { activeClass: string };
  element: HTMLElement | null;
  display: HTMLElement | null;
  roots: NodeListOf<HTMLElement> | null;

  /**
   * @param  {Element} elements rootとなる要素
   * @returns void
   */
  constructor(elements: HTMLElement | null, display: HTMLElement | null, roots: NodeListOf<HTMLElement> | null) {
    const defaultOptions = {
      activeClass: 'is-active',
    };

    this.o = Object.assign(defaultOptions);
    this.element = elements;
    this.display = display;
    this.roots = roots;
    this.init();
  }
  /**
   * 初期化処理
   *
   * @returns void
   */
  init() {
    this.element?.addEventListener('click', this.clickFunc.bind(this));
  }

  parentFadeAnimation(target: HTMLElement, kind: 'open' | 'close') {
    if (target && kind === 'open') {
      target.style.display = 'block';
      target.style.width = '0';

      const fadeAnimation = kind === 'open' ? target.animate(
        { width: ['0', '100vw']},
        { duration: 600, easing: 'ease' }
      ) : target.animate(
        { width: ['100vw', '0']},
        { duration: 600, easing: 'ease' }
      );

      fadeAnimation.onfinish = () => {
        target.style.width = '100vw';
        this.roots?.forEach((item) => {
          this.linksFadeAnimation(item, kind)
        })
      };
    } else {
      target.style.width = '100vw';

      this.roots?.forEach((item) => {
        this.linksFadeAnimation(item, kind, this.display)
      })
    }
  }

  linksFadeAnimation(target: HTMLElement, kind: 'open' | 'close', display?: HTMLElement | null) {
    if (target && kind === 'open') {
      target.style.display = 'block';

      const fadeAnimation = target.animate(
        { transform: ['translateX(200px)', 'translateX(0)']},
        { duration: 600, easing: 'ease' }
      );

      fadeAnimation.onfinish = () => {
        target && (target.style.transform = 'translateX(0)');
      };
    } else {
      target.style.display = 'block';

      const fadeAnimation = target.animate(
        { transform: ['translateX(0)', 'translateX(500px)']},
        { duration: 600, easing: 'ease' }
      );

      fadeAnimation.onfinish = () => {
        target.style.transform = 'translateX(500px)';
        target.style.display = 'none';

        if (display) {
          display.style.width = '100vw';

          const bgAnimation = display.animate(
            { width: ['100vw', '0']},
            { duration: 600, easing: 'ease' }
          );

          bgAnimation.onfinish = () => {
            display.style.width = '0';
          }
        }
      };
    }
  }

  /**
   * ページロード時に情報を取得
   *
   * @returns void
   */
  clickFunc() {
    if (this.element?.classList.contains(this.o.activeClass)) {
      this.element?.classList.remove(this.o.activeClass);
      this.display?.classList.remove(this.o.activeClass);
      this.display && this.parentFadeAnimation(this.display, 'close');

      return;
    }

    this.element?.classList.add(this.o.activeClass);
    this.display?.classList.add(this.o.activeClass);
    this.display && this.parentFadeAnimation(this.display, 'open');
  }
}
