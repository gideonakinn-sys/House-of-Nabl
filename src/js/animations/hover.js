import gsap from 'gsap';

const CONFIG = {
  opacityDim: 0.1,
  scaleHover: 1.04,
  durationEnter: 0.6,
  durationLeave: 0.5,
  easeEnter: 'expo.out',
  easeLeave: 'power2.out',
  zIndexBase: 1,
  zIndexHover: 10,
};

const state = {
  activeImg: null,
};

function onEnter(img, allImages) {
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

  allImages.forEach(other => {
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

function onLeaveAll(allImages) {
  state.activeImg = null;

  gsap.to(allImages, {
    opacity: 1,
    scale: 1,
    duration: CONFIG.durationLeave,
    ease: CONFIG.easeLeave,
    overwrite: 'auto',
    onComplete: () => {
      allImages.forEach(img => {
        img.style.zIndex = '';
      });
    },
  });
}

function onLeaveImage(e, img, allImages) {
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

  onLeaveAll(allImages);
}

export function initHover() {
  const allImages = document.querySelectorAll('.hero__img');
  if (allImages.length < 2) return;

  const mediaQuery = window.matchMedia('(pointer: fine)');
  if (!mediaQuery.matches) return;

  allImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
      onEnter(img, allImages);
    });

    img.addEventListener('mouseleave', (e) => {
      onLeaveImage(e, img, allImages);
    });
  });
}
