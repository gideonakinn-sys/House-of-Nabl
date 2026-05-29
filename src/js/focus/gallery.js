import gsap from 'gsap';
import { isMobile } from '../utils/dom.js';

const CONFIG = {
  pad: 32,
};

export function createGallery(img, alt, targetRect) {
  const el = document.createElement('div');
  el.className = 'hero__focus-gallery';
  el.setAttribute('data-lenis-prevent', '');
  const count = 4;
  const mob = isMobile();

  if (mob) {
    el.classList.add('hero__focus-gallery--mobile');
    el.style.top = CONFIG.pad + 'px';
    el.style.height = targetRect.height + 'px';
    for (let i = 0; i < count; i++) {
      const im = document.createElement('img');
      im.setAttribute('src', img.getAttribute('src'));
      if (alt) im.setAttribute('alt', alt);
      im.classList.add('hero__focus-gallery-img', 'hero__focus-gallery-img--mobile');
      el.appendChild(im);
    }
  } else {
    el.classList.add('hero__focus-gallery--desktop');
    el.style.top = targetRect.top + 'px';
    el.style.maxHeight = (window.innerHeight - CONFIG.pad * 2) + 'px';
    for (let i = 0; i < count; i++) {
      const im = document.createElement('img');
      im.setAttribute('src', img.getAttribute('src'));
      if (alt) im.setAttribute('alt', alt);
      im.classList.add('hero__focus-gallery-img', 'hero__focus-gallery-img--desktop');
      im.style.width = targetRect.width + 'px';
      im.style.height = targetRect.height + 'px';
      el.appendChild(im);
    }
  }

  return el;
}

export function scrollGalleryTo(gallery, imageEl) {
  const targetTop = imageEl.offsetTop - (gallery.clientHeight - imageEl.offsetHeight) / 2;
  gallery.scrollTo({ top: targetTop, behavior: 'smooth' });
}

export function initGalleryScroll(gallery, getFocusData) {
  let rafId = null;
  const images = gallery.querySelectorAll('img');

  images.forEach((im) => {
    im.style.cursor = 'pointer';
    im.addEventListener('click', () => {
      scrollGalleryTo(gallery, im);
    });
  });

  function update() {
    const gRect = gallery.getBoundingClientRect();
    let activeIdx = 0;

    images.forEach((im, i) => {
      const iRect = im.getBoundingClientRect();
      const overlap = Math.min(iRect.bottom, gRect.bottom) - Math.max(iRect.top, gRect.top);
      const visible = overlap > gRect.height * 0.4;
      if (visible) {
        gsap.to(im, { opacity: 1, duration: 0.25, overwrite: 'auto' });
        im.style.filter = 'blur(0px)';
        activeIdx = i;
      } else {
        gsap.to(im, { opacity: 0.4, duration: 0.25, overwrite: 'auto' });
        im.style.filter = 'blur(8px)';
      }
    });

    const fd = getFocusData();
    if (fd && fd.indicator) {
      const thumbs = fd.indicator.querySelectorAll('.hero__focus-indicator-thumb');
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === activeIdx);
      });
      const ctr = fd.indicator.querySelector('.hero__focus-indicator-counter');
      if (ctr) ctr.textContent = String(activeIdx + 1).padStart(2, '0') + '/04';
    }

    rafId = null;
  }

  gallery.addEventListener('scroll', () => {
    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
  });

  requestAnimationFrame(update);
}
