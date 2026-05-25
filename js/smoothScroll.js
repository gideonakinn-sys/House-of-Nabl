import Lenis from 'https://esm.sh/lenis@1.3.23';
import gsap from 'https://esm.sh/gsap@3.15.0';
import { ScrollTrigger } from 'https://esm.sh/gsap@3.15.0/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}