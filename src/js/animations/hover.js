import gsap from 'gsap';

const CONFIG = {
  opacityDim: 0.1,
  scaleHover: 1.04,
  durationEnter: 0.6,
  durationLeave: 0.5,
  easeEnter: 'expo.out',
  easeLeave: 'power2.out',
  zIndexHover: 10,
};

const rowState = new WeakMap();

function getRowState(row) {
  if (!rowState.has(row)) {
    rowState.set(row, { activeImg: null });
  }
  return rowState.get(row);
}

function onEnter(img, images, state) {
  if (state.activeImg && state.activeImg !== img) {
    gsap.to(state.activeImg, {
      scale: 1,
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

function onLeaveImage(e, img, images, state) {
  const related = e.relatedTarget;
  if (related && related.closest && related.closest('.hero__img')) {
    const nextImg = related.closest('.hero__img');
    if (nextImg && nextImg !== img) {
      gsap.to(img, {
        scale: 1,
        opacity: CONFIG.opacityDim,
        duration: CONFIG.durationLeave * 0.6,
        ease: CONFIG.easeLeave,
        overwrite: 'auto',
        onComplete: () => {
          img.style.zIndex = '';
        },
      });
    }
    return;
  }

  onLeaveRow(images, state);
}

export function initHover() {
  const rows = document.querySelectorAll('.hero__row');
  if (!rows.length) return;

  const mediaQuery = window.matchMedia('(pointer: fine)');
  if (!mediaQuery.matches) return;

  rows.forEach(row => {
    const images = row.querySelectorAll('.hero__img');
    if (images.length < 2) return;

    const state = getRowState(row);

    images.forEach(img => {
      img.addEventListener('mouseenter', () => {
        if (document.body.classList.contains('focus-active')) return;
        onEnter(img, images, state);
      });

      img.addEventListener('mouseleave', (e) => {
        if (document.body.classList.contains('focus-active')) return;
        onLeaveImage(e, img, images, state);
      });
    });

    row.addEventListener('mouseleave', () => {
      if (state.activeImg && !document.body.classList.contains('focus-active')) {
        onLeaveRow(images, state);
      }
    });
  });
}
