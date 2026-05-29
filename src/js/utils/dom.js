const MOBILE_BREAK = 769;

export function isMobile() {
  return window.innerWidth < MOBILE_BREAK;
}

export function lockScroll() {
  const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = scrollbarW + 'px';
  document.body.classList.add('focus-active');
}

export function unlockScroll() {
  document.body.classList.remove('focus-active');
  document.body.style.paddingRight = '';
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function formatPrice(num) {
  return '\u20A6' + num.toLocaleString('en-NG');
}
