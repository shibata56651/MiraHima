import { TAB_INDEX_ELEMENTS } from './config'

const FOCUS_ALL_ELEM = document.querySelectorAll(TAB_INDEX_ELEMENTS.FOCUS_ELEMENT);
const headerFocusElem = document.querySelector('.header-contents');
let HEADER_FOCUS_ALL_ELEM: NodeListOf<Element> | null = null;

if (headerFocusElem) {
  HEADER_FOCUS_ALL_ELEM = headerFocusElem.querySelectorAll(TAB_INDEX_ELEMENTS.FOCUS_ELEMENT);
}

/**
 * Tabindexを付与する処理
 */
export const setTabIndex = () => {
  if (FOCUS_ALL_ELEM) {
    for (const elem of FOCUS_ALL_ELEM) {
      const saveTabindex = elem.getAttribute('tabindex');

      if (saveTabindex) {
        elem.setAttribute('data-tabindex', saveTabindex);
      }
      elem.setAttribute('data-tabindex', '-1');
    }
  }
};

export const setSpMenuTabIndex = (spMenuFlg: boolean, targetElements:  NodeListOf<Element>) => {
  if (FOCUS_ALL_ELEM) {
    for (const elem of FOCUS_ALL_ELEM) {
      const saveTabindex = elem.getAttribute('tabindex');

      if (saveTabindex) {
        elem.setAttribute('data-tabindex', saveTabindex);
      }
      elem.setAttribute('data-tabindex', '-1');

      if (spMenuFlg) {
        for (const item of targetElements) {
          item.setAttribute('tabIndex', '0');
        }

        if (HEADER_FOCUS_ALL_ELEM) {
          for (const item of HEADER_FOCUS_ALL_ELEM) {
            item.setAttribute('tabIndex', '0');
          }
        }
      }
    }
  }
};

/**
 * Tabindexを削除する処理
 */
export const removeTabIndex = () => {
  if (FOCUS_ALL_ELEM) {
    for (const elem of FOCUS_ALL_ELEM) {
      const saveDataTabindex = elem.getAttribute('data-tabindex');

      if (saveDataTabindex) {
        elem.setAttribute('tabIndex', saveDataTabindex);
        elem.removeAttribute('data-tabindex');

        continue;
      }

      elem.removeAttribute('tabindex');
    }
  }
};
