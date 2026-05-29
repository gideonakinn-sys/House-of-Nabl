import gsap from 'gsap';
import { isMobile, lockScroll, unlockScroll } from '../utils/dom.js';
import { fetchProducts, getProductById } from '../utils/data.js';
import {
  getIsFocusActive, setIsFocusActive,
  getIsClosing, setIsClosing,
  getFocusData, setFocusData,
} from './state.js';
import { createOverlay, animateOverlayIn, animateOverlayOut } from './overlay.js';
import { createClone, flipOut } from './clone.js';
import { createGallery, initGalleryScroll } from './gallery.js';
import { createPanelGroup } from './panel.js';
import { createIndicator, initIndicatorClicks } from './indicator.js';
import { createDesignerNote, positionNote, animateNoteIn, animateNoteOut } from './note.js';

const CONFIG = {
  durationEnter: 0.8,
  durationExit: 0.6,
  easeEnter: 'expo.out',
  easeExit: 'power2.inOut',
  pad: 32,
  mobileBreak: 769,
};

function calculateTargetRect(rect, product) {
  const hasPanel = !!product;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let p = Math.min(vw, vh) * 0.06;
  let mw = vw - p * 2;
  let mh = vh - p * 2;

  if (isMobile() && hasPanel) {
    mw = vw - CONFIG.pad * 2;
    mh = vh * 0.4;
  }

  const a = rect.width / rect.height;
  let w, h;
  if (a > mw / mh) { w = mw; h = mw / a; } else { h = mh; w = mh * a; }
  return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h };
}

function replaceLogoWithClose(closeHandler) {
  const logoLink = document.querySelector('.header__logo-link');
  if (!logoLink) return null;
  const origEl = logoLink;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'header__logo-link hero__focus-close-btn';
  closeBtn.textContent = 'Close';
  closeBtn.addEventListener('click', closeHandler);

  origEl.replaceWith(closeBtn);
  return origEl;
}

function restoreLogo(origEl) {
  if (!origEl) return;
  const current = document.querySelector('.header__logo-link');
  if (current) current.replaceWith(origEl);
}

function cleanup() {
  const d = getFocusData();
  if (!d) return;

  d.clone.remove();
  if (d.indicator) d.indicator.remove();
  d.overlay.remove();
  if (d.contentWrapper) d.contentWrapper.remove();

  d.allImages.forEach((other) => {
    gsap.killTweensOf(other);
    gsap.set(other, { opacity: 1, clearProps: 'pointerEvents' });
  });

  restoreLogo(d.origLogoEl);
  unlockScroll();
  setIsFocusActive(false);
  setIsClosing(false);
  setFocusData(null);
}

function closeFocus() {
  if (!getFocusData() || getIsClosing()) return;
  setIsClosing(true);

  const d = getFocusData();

  gsap.killTweensOf(d.clone);
  gsap.killTweensOf(d.gallery);
  gsap.killTweensOf(d.overlay);
  if (d.panelGroup) {
    if (isMobile()) {
      gsap.killTweensOf(d.panelGroup.panel);
      gsap.killTweensOf(d.panelGroup.btn);
    } else {
      gsap.killTweensOf(d.panelGroup.wrapper);
    }
  }

  if (d.note) animateNoteOut(d.note);

  gsap.to(d.gallery, {
    opacity: 0, duration: 0.2, overwrite: 'auto',
  });

  animateOverlayOut(d.overlay);

  if (d.panelGroup) {
    if (isMobile()) {
      gsap.to(d.panelGroup.panel, {
        y: 16, opacity: 0,
        duration: 0.25, ease: 'power2.out', overwrite: 'auto',
      });
      gsap.to(d.panelGroup.btn, {
        y: 10, opacity: 0,
        duration: 0.25, ease: 'power2.out', overwrite: 'auto',
      });
    } else {
      gsap.to(d.panelGroup.wrapper, {
        transform: 'translateY(100%)',
        opacity: 0,
        duration: 0.25, ease: 'power2.out', overwrite: 'auto',
      });
    }
  }

  d.allImages.forEach((other) => {
    if (other !== d.img) {
      gsap.killTweensOf(other);
      gsap.to(other, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  });

  flipOut(d.clone, CONFIG, cleanup);
}

async function openFocus(img) {
  if (getIsFocusActive()) return;
  setIsFocusActive(true);

  gsap.killTweensOf(img);
  gsap.set(img, { clearProps: 'zIndex' });

  const productData = await fetchProducts();
  const product = img.dataset.productId ? getProductById(productData, img.dataset.productId) : null;
  const firstRect = img.getBoundingClientRect();
  const lastRect = calculateTargetRect(firstRect, product);

  const sx = lastRect.width / firstRect.width;
  const sy = lastRect.height / firstRect.height;
  const dx = lastRect.left - firstRect.left;
  const dy = lastRect.top - firstRect.top;

  const overlay = createOverlay();
  document.body.appendChild(overlay);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero__focus-content';
  document.body.appendChild(contentWrapper);

  const gallery = createGallery(img, product ? product.name : '', lastRect);
  contentWrapper.appendChild(gallery);

  initGalleryScroll(gallery, getFocusData);

  if (!isMobile()) {
    gallery.addEventListener('click', (e) => {
      if (!e.target.closest('img')) closeFocus();
    });
  }

  const indicator = isMobile() ? null : createIndicator(img.getAttribute('src'));
  if (indicator) {
    contentWrapper.appendChild(indicator);
    initIndicatorClicks(indicator, gallery);
  }

  const clone = createClone(img, firstRect, product ? product.name : '');
  document.body.appendChild(clone);

  const panelGroup = product ? createPanelGroup(product, isMobile() ? {
    top: CONFIG.pad + lastRect.height,
    left: 0, width: 0, height: 0,
  } : lastRect) : null;

  if (panelGroup) {
    if (isMobile()) {
      contentWrapper.appendChild(panelGroup.panel);
      contentWrapper.appendChild(panelGroup.btn);
      const pr = panelGroup.panel.getBoundingClientRect();
      panelGroup.btn.style.top = (pr.bottom + 16) + 'px';
    } else {
      contentWrapper.appendChild(panelGroup.wrapper);
    }
  }

  const note = !isMobile() && product ? createDesignerNote(product) : null;
  if (note) {
    contentWrapper.appendChild(note);
  }

  const allImages = Array.from(document.querySelectorAll('.hero__img'));
  allImages.forEach((other) => {
    if (other !== img) {
      gsap.killTweensOf(other);
      gsap.to(other, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  });

  gsap.set(img, { scale: 1, opacity: 0 });

  const origLogoEl = replaceLogoWithClose(closeFocus);

  lockScroll();

  setFocusData({
    img,
    clone,
    gallery,
    indicator,
    overlay,
    contentWrapper,
    panelGroup,
    note,
    allImages,
    origLogoEl,
  });

  animateOverlayIn(overlay);

  gsap.set(clone, { transformOrigin: '0 0' });
  gsap.to(clone, {
    x: dx, y: dy, scaleX: sx, scaleY: sy,
    duration: CONFIG.durationEnter,
    ease: CONFIG.easeEnter,
    overwrite: 'auto',
    onComplete: () => {
      gsap.to(clone, { opacity: 0, duration: 0.2, overwrite: 'auto' });
      gsap.to(gallery, { opacity: 1, duration: 0.3, overwrite: 'auto' });
    },
  });

  if (panelGroup) {
    if (isMobile()) {
      gsap.to(panelGroup.panel, {
        y: 0, opacity: 1,
        duration: 0.5, ease: 'power2.out', delay: 0.15, overwrite: 'auto',
      });
      gsap.to(panelGroup.btn, {
        y: 0, opacity: 1,
        duration: 0.5, ease: 'power2.out', delay: 0.2, overwrite: 'auto',
      });
    } else {
      gsap.to(panelGroup.wrapper, {
        transform: 'translateY(0)',
        opacity: 1,
        duration: 0.5, ease: 'power2.out', delay: 0.15, overwrite: 'auto',
        onComplete: () => {
          if (note) {
            positionNote(note, contentWrapper, panelGroup);
            animateNoteIn(note);
          }
        },
      });
    }
  }

  overlay.addEventListener('click', closeFocus);
}

export function initFocus() {
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.hero__img');
    if (img && !getIsFocusActive()) {
      openFocus(img);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && getIsFocusActive()) {
      closeFocus();
    }
  });
}
