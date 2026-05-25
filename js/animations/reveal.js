import gsap from 'https://esm.sh/gsap@3.15.0';
import { ScrollTrigger } from 'https://esm.sh/gsap@3.15.0/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initReveal() {
  const rows = document.querySelectorAll('.hero__row');

  if (!rows.length) return;

  gsap.fromTo(rows,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: rows[0].parentElement,
        start: 'top 85%',
        once: true
      }
    }
  );
}
