export function createIndicator(src) {
  const el = document.createElement('div');
  el.className = 'hero__focus-indicator';

  const label = document.createElement('span');
  label.className = 'hero__focus-indicator-label';
  label.textContent = 'Scroll';

  const counter = document.createElement('span');
  counter.className = 'hero__focus-indicator-counter';
  counter.textContent = '01/04';

  const thumbs = document.createElement('div');
  thumbs.className = 'hero__focus-indicator-thumbs';
  for (let i = 0; i < 4; i++) {
    const t = document.createElement('div');
    t.className = 'hero__focus-indicator-thumb' + (i === 0 ? ' active' : '');
    t.style.cssText = 'background-image:url(' + src + ');background-size:cover;background-position:center;';
    thumbs.appendChild(t);
  }

  el.appendChild(label);
  el.appendChild(counter);
  el.appendChild(thumbs);
  return el;
}

export function initIndicatorClicks(indicator, gallery) {
  const thumbImages = gallery.querySelectorAll('img');
  indicator.querySelectorAll('.hero__focus-indicator-thumb').forEach((t, i) => {
    t.addEventListener('click', () => {
      if (thumbImages[i]) {
        const targetTop = thumbImages[i].offsetTop - (gallery.clientHeight - thumbImages[i].offsetHeight) / 2;
        gallery.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });
}
