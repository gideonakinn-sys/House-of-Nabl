export function renderProductGrid(products) {
  const grid = document.getElementById('product-grid');

  grid.innerHTML = products.map((product, index) => {
    const price = formatPrice(product.price);
    const hasCompare = product.compare_at && product.compare_at > product.price;
    const comparePrice = hasCompare ? formatPrice(product.compare_at) : '';

    return `
      <div class="product-card" role="listitem" data-product-id="${product.id}" style="transition-delay: ${index * 0.05}s">
        <div class="product-card__image-wrap">
          <div class="product-card__image-placeholder" aria-hidden="true">
            <span>${product.name.charAt(0)}</span>
          </div>
          <img
            class="product-card__image product-card__image--loading"
            src="${product.images[0]}"
            alt="${product.name}"
            loading="lazy"
            data-lazy
          />
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
          <p class="product-card__price">
            <span class="product-card__price-current">${price}</span>
            ${comparePrice ? `<span class="product-card__price--compare">${comparePrice}</span>` : ''}
          </p>
        </div>
      </div>
    `;
  }).join('');

  requestAnimationFrame(() => {
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 80);
    });
  });
}

export function renderProductModal(product, selectedVariant = null) {
  if (!product) return;

  document.getElementById('modal-title').textContent = product.name;

  const priceEl = document.querySelector('.modal__price');
  if (selectedVariant && selectedVariant.price) {
    priceEl.textContent = formatPrice(selectedVariant.price);
  } else {
    priceEl.textContent = formatPrice(product.price);
  }

  document.querySelector('.modal__desc').textContent = product.description;

  const gallery = document.querySelector('.modal__gallery');
  gallery.innerHTML = product.images.length
    ? `<img src="${product.images[0]}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;" />`
    : `<span>${product.name.charAt(0)}</span>`;

  renderVariantOptions(product, 'size', selectedVariant);
  renderVariantOptions(product, 'color', selectedVariant);

  const orderBtn = document.querySelector('[data-order-btn]');
  orderBtn.disabled = !selectedVariant;
  orderBtn.dataset.productId = product.id;
}

function renderVariantOptions(product, type, selectedVariant) {
  const container = type === 'size'
    ? document.querySelector('[data-variant-size-options]')
    : document.querySelector('[data-variant-color-options]');

  const group = type === 'size'
    ? document.querySelector('[data-variant-size]')
    : document.querySelector('[data-variant-color]');

  const seen = new Set();
  let hasOptions = false;

  container.innerHTML = product.variants
    .filter(v => {
      const key = type === 'size' ? v.size : v.color;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(v => {
      const label = type === 'size' ? v.size : v.color;
      const value = type === 'size' ? v.size : v.color;
      const isSelected = selectedVariant && (
        type === 'size' ? v.size === selectedVariant.size : v.color === selectedVariant.color
      );
      const soldOut = !v.stock;
      const isColor = type === 'color';
      const colorStyle = isColor ? `style="background: ${v.colorHex || '#ccc'}"` : '';

      hasOptions = true;

      return `<button
        class="variant-chip ${isSelected ? 'variant-chip--selected' : ''} ${soldOut ? 'variant-chip--sold-out' : ''} ${isColor ? 'variant-chip--color' : ''}"
        data-variant-type="${type}"
        data-variant-value="${value}"
        data-variant-stock="${v.stock}"
        ${colorStyle}
        ${soldOut ? 'disabled' : ''}
        aria-pressed="${isSelected}"
        type="button"
      >${isColor ? '' : escapeHtml(label)}</button>`;
    }).join('');

  group.hidden = !hasOptions;
}

export function formatPrice(cents) {
  const dollars = cents / 100;
  return '$' + dollars.toFixed(2);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
