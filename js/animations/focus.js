import gsap from 'https://esm.sh/gsap@3.15.0';

let isFocusActive = false;
let isClosing = false;
let focusData = null;

const CONFIG = {
  overlayColor: 'rgba(28, 25, 23, 0.55)',
  durationEnter: 0.8,
  durationExit: 0.6,
  easeEnter: 'expo.out',
  easeExit: 'power2.inOut',
  paddingFraction: 0.06,
};

function calculateTargetRect(rect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = Math.min(vw, vh) * CONFIG.paddingFraction;
  const maxW = vw - pad * 2;
  const maxH = vh - pad * 2;
  const aspect = rect.width / rect.height;
  let w, h;
  if (aspect > maxW / maxH) {
    w = maxW;
    h = maxW / aspect;
  } else {
    h = maxH;
    w = maxH * aspect;
  }
  return {
    left: (vw - w) / 2,
    top: (vh - h) / 2,
    width: w,
    height: h,
  };
}

function createOverlay() {
  const el = document.createElement('div');
  el.className = 'hero__focus-overlay';
  return el;
}

function createClone(img, rect) {
  const el = img.cloneNode(true);
  el.className = 'hero__focus-image';
  el.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    z-index: 101;
    object-fit: cover;
    pointer-events: none;
    will-change: transform, opacity;
  `;
  return el;
}

function lockScroll() {
  document.body.classList.add('focus-active');
}

function unlockScroll() {
  document.body.classList.remove('focus-active');
}

function cleanup() {
  if (!focusData) return;

  const { img, clone, overlay, allImages } = focusData;

  clone.remove();
  overlay.remove();

  gsap.set(img, {
    opacity: 0,
    clearProps: 'zIndex',
  });

  allImages.forEach(other => {
    gsap.killTweensOf(other);
    gsap.to(other, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
      clearProps: 'pointerEvents',
    });
  });

  gsap.to(img, {
    opacity: 1,
    duration: 0.35,
    ease: 'power2.out',
    overwrite: 'auto',
  });

  unlockScroll();
  isFocusActive = false;
  isClosing = false;
  focusData = null;
}

function closeFocus() {
  if (!focusData || isClosing) return;
  isClosing = true;

  const { img, clone, overlay, allImages } = focusData;

  gsap.killTweensOf(clone);
  gsap.killTweensOf(overlay);

  gsap.to(clone, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    duration: CONFIG.durationExit,
    ease: CONFIG.easeExit,
    transformOrigin: '0 0',
    overwrite: 'auto',
    onComplete: cleanup,
  });

  gsap.to(overlay, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out',
    overwrite: 'auto',
  });

}

function openFocus(img) {
  if (isFocusActive) return;
  isFocusActive = true;

  const firstRect = img.getBoundingClientRect();
  const lastRect = calculateTargetRect(firstRect);

  const sx = lastRect.width / firstRect.width;
  const sy = lastRect.height / firstRect.height;
  const dx = lastRect.left - firstRect.left;
  const dy = lastRect.top - firstRect.top;

  const overlay = createOverlay();
  const clone = createClone(img, firstRect);
  document.body.appendChild(overlay);
  document.body.appendChild(clone);

  const allImages = Array.from(document.querySelectorAll('.hero__img'));
  allImages.forEach(other => {
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

  gsap.killTweensOf(img);
  gsap.set(img, {
    scale: 1,
    opacity: 0,
    clearProps: 'zIndex',
  });

  focusData = { img, clone, overlay, allImages, firstRect, lastRect };

  gsap.fromTo(overlay, {
    opacity: 0,
  }, {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
    overwrite: 'auto',
  });

  gsap.set(clone, {
    transformOrigin: '0 0',
  });

  gsap.to(clone, {
    x: dx,
    y: dy,
    scaleX: sx,
    scaleY: sy,
    duration: CONFIG.durationEnter,
    ease: CONFIG.easeEnter,
    overwrite: 'auto',
  });

  lockScroll();

  overlay.addEventListener('click', closeFocus);
}

export function initFocus() {
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.hero__img');
    if (img && !isFocusActive) {
      openFocus(img);
    }
  });
}
