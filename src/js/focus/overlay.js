import gsap from 'gsap';

export function createOverlay() {
  const el = document.createElement('div');
  el.className = 'hero__focus-overlay bg-grid-dots';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Product details');
  return el;
}

export function animateOverlayIn(overlay) {
  return gsap.fromTo(overlay, { opacity: 0 }, {
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

export function animateOverlayOut(overlay) {
  return gsap.to(overlay, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}
