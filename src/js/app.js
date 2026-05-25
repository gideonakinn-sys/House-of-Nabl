import { initSmoothScroll } from './smoothScroll.js';
import { initReveal } from './animations/reveal.js';
import { initHover } from './animations/hover.js';

function init() {
  initSmoothScroll();
  initReveal();
  initHover();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}