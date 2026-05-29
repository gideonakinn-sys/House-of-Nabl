import gsap from 'gsap';
import { prefersReducedMotion } from '../utils/dom.js';

export function createClone(img, rect, alt) {
  const el = img.cloneNode(true);
  el.className = 'hero__focus-image';
  if (alt) el.setAttribute('alt', alt);
  el.style.left = rect.left + 'px';
  el.style.top = rect.top + 'px';
  el.style.width = rect.width + 'px';
  el.style.height = rect.height + 'px';
  el.style.zIndex = '102';
  return el;
}

export function flipIn(clone, dx, dy, sx, sy, config) {
  gsap.set(clone, { transformOrigin: '0 0' });
  if (prefersReducedMotion()) {
    gsap.set(clone, { x: dx, y: dy, scaleX: sx, scaleY: sy });
    return;
  }
  gsap.to(clone, {
    x: dx,
    y: dy,
    scaleX: sx,
    scaleY: sy,
    duration: config.durationEnter,
    ease: config.easeEnter,
    overwrite: 'auto',
  });
}

export function flipOut(clone, config, onComplete) {
  gsap.set(clone, { opacity: 1 });
  if (prefersReducedMotion()) {
    gsap.set(clone, { x: 0, y: 0, scaleX: 1, scaleY: 1 });
    if (onComplete) onComplete();
    return;
  }
  gsap.to(clone, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    duration: config.durationExit,
    ease: config.easeExit,
    transformOrigin: '0 0',
    overwrite: 'auto',
    onComplete: onComplete,
  });
}
