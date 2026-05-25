import gsap from 'gsap';

const CONFIG = {
  opacityDim: 0.25,
  scaleHover: 1.04,
  magneticRange: 10,
  magneticDecay: 0.6,
  durationEnter: 0.6,
  durationLeave: 0.5,
  durationMagnetic: 0.35,
  easeEnter: 'expo.out',
  easeLeave: 'power2.out',
  easeMagnetic: 'power2.out',
  zIndexBase: 1,
  zIndexHover: 10,
};

const rowState = new WeakMap();

function getRowState(row, images) {
  if (!rowState.has(row)) {
    rowState.set(row, { activeImg: null });
  }
  return rowState.get(row);
}

function onEnter(img, images, state) {
  if (state.activeImg && state.activeImg !== img) {
    gsap.to(state.activeImg, {
      scale: 1,
      x: 0,
      y: 0,
      opacity: CONFIG.opacityDim,
      duration: CONFIG.durationEnter * 0.5,
      ease: CONFIG.easeEnter,
      overwrite: 'auto',
      onComplete: () => {
        state.activeImg.style.zIndex = '';
      },
    });
  }

  state.activeImg = img;

  gsap.to(img, {
    scale: CONFIG.scaleHover,
    opacity: 1,
    duration: CONFIG.durationEnter,
    ease: CONFIG.easeEnter,
    overwrite: 'auto',
  });

  img.style.zIndex = CONFIG.zIndexHover;

  images.forEach(other => {
    if (other !== img) {
      gsap.to(other, {
        opacity: CONFIG.opacityDim,
        scale: 1,
        duration: CONFIG.durationEnter,
        ease: CONFIG.easeEnter,
        overwrite: 'auto',
      });
    }
  });
}

function onLeaveRow(images, state) {
  state.activeImg = null;

  gsap.to(images, {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    duration: CONFIG.durationLeave,
    ease: CONFIG.easeLeave,
    overwrite: 'auto',
    onComplete: () => {
      images.forEach(img => {
        img.style.zIndex = '';
      });
    },
  });
}

function onMove(e, img) {
  const rect = img.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const tx = dx * CONFIG.magneticDecay * (CONFIG.magneticRange / (Math.abs(dx) + 1));
  const ty = dy * CONFIG.magneticDecay * (CONFIG.magneticRange / (Math.abs(dy) + 1));

  gsap.to(img, {
    x: tx,
    y: ty,
    duration: CONFIG.durationMagnetic,
    ease: CONFIG.easeMagnetic,
    overwrite: 'auto',
  });
}

export function initHover() {
  const rows = document.querySelectorAll('.hero__row');
  if (!rows.length) return;

  const mediaQuery = window.matchMedia('(pointer: fine)');
  if (!mediaQuery.matches) return;

  rows.forEach(row => {
    const images = row.querySelectorAll('.hero__img');
    if (images.length < 2) return;

    const state = getRowState(row, images);

    images.forEach(img => {
      img.addEventListener('mouseenter', () => {
        onEnter(img, images, state);
      });

      img.addEventListener('mouseleave', (e) => {
        const related = e.relatedTarget;
        if (related && related.closest && related.closest('.hero__row') === img.closest('.hero__row')) {
          return;
        }
        onLeaveRow(images, state);
      });

      img.addEventListener('mousemove', (e) => {
        onMove(e, img);
      });
    });

    row.addEventListener('mouseleave', () => {
      if (state.activeImg) {
        onLeaveRow(images, state);
      }
    });
  });
}