import gsap from 'gsap';

export function createDesignerNote(product) {
  const el = document.createElement('div');
  el.className = 'hero__focus-note';
  el.innerHTML = [
    'Designed as a softer interpretation of ceremonial Nigerian tailoring, this piece balances structure with movement for everyday wear. Inspired by Lagos nightlife and relaxed summer silhouettes.',
    '<span style="display:block;margin-top:8px">\u2014Designer\u2019s note \u2661</span>',
  ].join('');
  return el;
}

export function positionNote(note, contentWrapper, panelGroup) {
  const panelH = panelGroup.wrapper.scrollHeight;
  note.style.left = '32px';
  note.style.top = (contentWrapper.clientHeight - panelH - 32) + 'px';
}

export function animateNoteIn(note) {
  gsap.to(note, { opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
}

export function animateNoteOut(note) {
  gsap.killTweensOf(note);
  gsap.to(note, {
    opacity: 0,
    duration: 0.25,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}
