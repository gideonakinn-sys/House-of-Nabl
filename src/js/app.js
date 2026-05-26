import { initSmoothScroll } from './smoothScroll.js';
import { initReveal } from './animations/reveal.js';
import { initHover } from './animations/hover.js';
import { initFocus } from './animations/focus.js';

function init() {
  const lenis = initSmoothScroll();
  initReveal();
  initHover();
  initFocus();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}