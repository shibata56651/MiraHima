import "./init";
import { topMv } from './modules/topMv';
import { accordion } from './modules/accordion';
import { hamburger } from './modules/hamburger';
import { categoryListAdjustment } from './modules/categoryListAdjustment';
import { fade } from './modules/fade';
import { SmoothScroll } from './modules/SmoothScroll';
import { tab } from './modules/tab';
import { moreShow } from './modules/moreShow';
import { Modal } from './modules/modal';
import { Toggle } from './modules/toggle';
import { jsonGetData } from './modules/jsonGetData';
import { xmlGetData } from './modules/xmlGetData';
import { mvAnimation } from './modules/mvAnimation';
import { youtubeApi } from './modules/youtubeApi';
import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import "@babel/polyfill";
import "scroll-behavior-polyfill";


((win, doc) => {
  const displayWidth = window.innerWidth;

  const topMvTarget: HTMLElement | null = doc.querySelector('.js__top-mv');

  if (topMvTarget) {
    new topMv(topMvTarget);
  }

  const footerTarget: NodeListOf<Element> | null = doc.querySelectorAll('.js-footer-accordion-roots');

  for (const root of footerTarget) {
    const category = 'footer';
    const item: HTMLElement | null = root.querySelector('.js-accordion-target');
    const display: HTMLElement | null = root.querySelector('.js-accordion-display');
    new accordion(item, display, footerTarget, category);
  }

  const hamburgerTarget: HTMLElement | null = doc.querySelector('.js-hamburger-button');
  const hamburgerDisplay: HTMLElement | null = doc.querySelector('.js-hamburger-menu');
  const hamburgerLins: NodeListOf<HTMLElement> | null = doc.querySelectorAll('.js-hamburger-links');

  if (hamburgerTarget) {
    new hamburger(hamburgerTarget, hamburgerDisplay, hamburgerLins);
  }

  const categoryListRoots: NodeListOf<HTMLElement> | null = doc.querySelectorAll('.js-category-adjustment');

  for (const item of categoryListRoots) {
    new categoryListAdjustment(item, categoryListRoots);
  }

  // アンカーリンク
  const anchorLinks: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('a[href^="#anchor-"], a[href="#top"]');
  const urlHash = doc.location.hash;
  const anchorFlg = urlHash ? true : false;

  if (anchorFlg) {
    new SmoothScroll(undefined, urlHash);
  } else {
    for (const item of anchorLinks) {
      const linkItem = item;
      new SmoothScroll(linkItem, urlHash);
    }
  }

    // モーダル
    const modalRoots: NodeListOf<HTMLElement> = doc.querySelectorAll('.js-modal-hook');
    const modalOverlay = doc.getElementById('js-modal-overlay');

    for (const item of modalRoots) {
      modalOverlay && new Modal(item, modalOverlay);
    }

  const tabRoots: NodeListOf<HTMLButtonElement> = doc.querySelectorAll('[aria-controls^="tabpanel-"]');
  // const tabRoots2: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('.js-tab-hook-02');

  if (tabRoots.length) {
    const displayTarget: NodeListOf<HTMLButtonElement> = doc.querySelectorAll('.js-tab-news-items');

    for (const item of tabRoots) {
      new tab(item, tabRoots, urlHash, displayTarget);
    }
  }

  // if (tabRoots2.length) {
  //   displayTarget = 'js-tab-member-items';
  //   for (const item of tabRoots2) {
  //     new tab(item, tabRoots2, displayTarget);
  //   }
  // }

  const targets = doc.querySelectorAll('.js-history-animations');
  const wrapTarget = doc.querySelector('.box-history');

  if (targets.length) {
    addEventListener('scroll', () => {
      if (scrollY >= 200) {
        wrapTarget && wrapTarget.classList.add('is-animation');
        let i = 0;

        const setAnimation = setInterval(() => {
          if (targets.length > i) {
            targets[i].classList.add('is-fade');
            i++;
          } else {
            clearInterval(setAnimation);
          }
        }, 200);
      }
    })
  }

  window.addEventListener('DOMContentLoaded', ()=> {
    // コンテナを指定
    const container = document.querySelector('.feather-container');

    // 羽を生成する関数
    const createFeather = (leafClass: any, minSizeVal: any, maxSizeVal: any) => {
      const leafEl = document.createElement('span');
      leafEl.className = `feather ${leafClass}`;
      const minSize = minSizeVal;
      const maxSize = maxSizeVal;
      const size = Math.random() * (maxSize + 1 - minSize) + minSize;
      leafEl.style.width = `${size}px`;
      leafEl.style.height = `${size}px`;
      leafEl.style.left = Math.random() * 100 + '%';
      container?.appendChild(leafEl);
  
      // 一定時間が経てば葉っぱを消す
      setTimeout(() => {
        leafEl.remove();
      }, 8000);
    }

    const createStar = (leafClass: any, minSizeVal: any, maxSizeVal: any) => {
      const leafEl = document.createElement('span');
      leafEl.className = `star ${leafClass}`;
      const minSize = minSizeVal;
      const maxSize = maxSizeVal;
      const size = Math.random() * (maxSize + 1 - minSize) + minSize;
      leafEl.style.width = `${size}px`;
      leafEl.style.height = `${size}px`;
      leafEl.style.left = Math.random() * 100 + '%';
      container?.appendChild(leafEl);

      // 一定時間が経てば葉っぱを消す
      setTimeout(() => {
        leafEl.remove();
      }, 8000);
    }

    setInterval(createFeather.bind(this, 'feather-1', 20, 40), 1000);
    setInterval(createFeather.bind(this, 'feather-1', 30, 50), 2000);

    setInterval(createStar.bind(this, 'star-1', 20, 40), 1000);
    setInterval(createStar.bind(this, 'star-1', 20, 30), 2000);
  });

  new Swiper(".swiper-container", {
    modules: [Navigation, Pagination],
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
    grabCursor: true,
    effect: "cards",
  });

  new Swiper(".swiper-container-02", {
    modules: [Navigation, Pagination],
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    loop: true,
    grabCursor: true,
  });

  // const loadingRoot = doc.querySelector('.js-loading');

  // if (loadingRoot) {
  //   document.addEventListener('DOMContentLoaded', () => {
  //     const loading = document.getElementById('loading')!;
  //     const animationContainer = document.getElementById('animationContainer')!;
  //     const content = document.getElementById('content')!;

  //     // Decide which animation to show
  //     const isBlackBackground = Math.random() < 0.5;
  //     if (isBlackBackground) {
  //         loading.classList.add('loading-screen--black');
  //         animateFeathers(animationContainer);
  //     } else {
  //         loading.classList.add('loading-screen--white');
  //         animateStars(animationContainer);
  //     }

  //     // Simulate page loading
  //     setTimeout(() => {
  //         loading.style.display = 'none';
  //         content.style.display = 'block';
  //     }, 3000);
  //   });

  //   const animateFeathers = (container: HTMLElement)  => {
  //     for (let i = 0; i < 50; i++) {
  //         const feather = document.createElement('div');
  //         feather.className = 'feather';
  //         feather.style.left = `${Math.random() * 100}%`;
  //         feather.style.animationDelay = `${Math.random() * 2}s`;
  //         container.appendChild(feather);
  //     }
  //   }

  //   const animateStars = (container: HTMLElement) => {
  //     for (let i = 0; i < 50; i++) {
  //         const star = document.createElement('div');
  //         star.className = 'star';
  //         star.style.left = `${Math.random() * 100}%`;
  //         star.style.top = `${Math.random() * 20}%`;
  //         star.style.animationDelay = `${Math.random() * 2}s`;
  //         container.appendChild(star);
  //     }
  // }
  // }

  const fadeRoots: NodeListOf<HTMLElement> = doc.querySelectorAll('.js-fade-roots');

  if (fadeRoots) {
    for (const item of fadeRoots) {
      new fade(item);
    }
  }

  const toggleRoots: NodeListOf<HTMLElement> = doc.querySelectorAll('.js-toggle-roots');

  if (toggleRoots.length) {
    for (const item of toggleRoots) {
      const togglejudge = item.dataset.toggleJudge;
      new Toggle(item, toggleRoots, togglejudge);
    }
  }

  const cardItems = doc.querySelectorAll('.js-card-animation');

  if (cardItems) {
    win.addEventListener('load', () => {
      let i = 0;

      const setAnimation = setInterval(() => {
        if (cardItems.length > i) {
          cardItems[i].classList.add('is-animation');
          i++;
        } else {
          clearInterval(setAnimation);
        }
      }, 200)
    })
  }

  const jsonRoots = doc.getElementById('json-area');

  if (jsonRoots) {
    new jsonGetData(jsonRoots);
  }

  const xmlRoots: NodeListOf<HTMLElement> = doc.querySelectorAll('.js-data-content');

  if (xmlRoots.length) {
    let num = 0;

    for (const item of xmlRoots) {
      const category = item.dataset.displayCategory;
      if (category === 'all' && xmlRoots.length === 1) {
        num = 99;
      } else {
        num += 1;
      }
      new xmlGetData(item, num);
    }
  }

    // アンカーリンク
    const animationRoot: HTMLElement | null = doc.querySelector('.mv__animation-wrap');

    if (animationRoot) {
      new mvAnimation(animationRoot);
    }

    const youtubeAPIRoot: HTMLElement | null = doc.getElementById('js-youtube-root');
    const youtubeAPIRootLive: HTMLElement | null = doc.getElementById('live');

    if (youtubeAPIRoot) {
      new youtubeApi(youtubeAPIRoot, youtubeAPIRootLive);
    }

})(window, document);
