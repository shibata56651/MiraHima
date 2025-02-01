/**
 * 要素のスクロール量取得
 *
 * @param  {HTMLElement} element スクロール量を取得したい要素
 * @returns number
 */
export const offsetTop = (element: Element) => {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return rect.top + scrollTop;
};
