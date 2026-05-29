import { isMobile, formatPrice } from '../utils/dom.js';
import { incrementCart, updateCartDisplay } from './state.js';

export function createPanel(product) {
  const el = document.createElement('div');
  el.className = 'hero__focus-panel';

  const sizesHTML = product.sizes.map((s, i) => {
    return '<span class="hero__focus-panel-size' + (i === 0 ? ' selected' : '') + '">' + s + '</span>';
  }).join('');

  el.innerHTML = [
    '<p class="hero__focus-panel-collection">' + product.collection + '</p>',
    '<h2 class="hero__focus-panel-title">' + product.name + '</h2>',
    '<p class="hero__focus-panel-desc">' + product.description + '</p>',
    '<div class="hero__focus-panel-sizes">',
      '<span class="hero__focus-panel-size-label">Size</span>',
      '<div class="hero__focus-panel-size-options">' + sizesHTML + '</div>',
    '</div>',
    '<div class="hero__focus-panel-meta">',
      '<div class="hero__focus-panel-row"><span class="hero__focus-panel-label">Delivery</span><span class="hero__focus-panel-value">Ships within 2\u20133 business days.</span></div>',
    '</div>',
  ].join('');

  const sizesEl = el.querySelector('.hero__focus-panel-size-options');
  if (sizesEl) {
    sizesEl.addEventListener('click', (e) => {
      const target = e.target.closest('.hero__focus-panel-size');
      if (!target) return;
      sizesEl.querySelectorAll('.hero__focus-panel-size').forEach((s) => {
        s.classList.remove('selected');
      });
      target.classList.add('selected');
    });
  }

  return el;
}

export function createPanelBtn(product) {
  const el = document.createElement('button');
  el.className = 'hero__focus-panel-btn';
  el.type = 'button';
  el.innerHTML = '<span>Add to Cart</span><span>' + formatPrice(product.price) + '</span>';
  el.addEventListener('click', () => {
    incrementCart();
    updateCartDisplay();
  });
  return el;
}

export function createPanelGroup(product, targetRect) {
  const panel = createPanel(product);
  const btn = createPanelBtn(product);

  if (isMobile()) {
    const maxH = window.innerHeight - targetRect.top - targetRect.height - 16 - 32;
    panel.classList.add('hero__focus-panel-wrapper--mobile');
    panel.style.top = (targetRect.top + targetRect.height + 16) + 'px';
    panel.style.maxHeight = maxH + 'px';
    btn.classList.add('hero__focus-panel-btn--mobile');
    return { wrapper: panel, panel, btn };
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'hero__focus-panel-wrapper';
  btn.classList.add('hero__focus-panel-btn--desktop');
  wrapper.appendChild(panel);
  wrapper.appendChild(btn);

  return { wrapper, panel, btn };
}
