import { renderProductModal, formatPrice } from './productRenderer.js';
import { findVariant, getUniqueColors, getAvailableSizesForColor } from './variantManager.js';
import { generateWhatsAppUrl } from './whatsappLink.js';

let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let appPhone = '';
let orderCallbacks = [];

export function openModal(product, phone) {
  if (!product) return;

  currentProduct = product;
  appPhone = phone || '';
  selectedSize = null;
  selectedColor = null;

  const modal = document.getElementById('product-modal');
  renderProductModal(product, null);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  setupVariantListeners(product);
  setupOrderButton(product);
}

export function closeModal() {
  const modal = document.getElementById('product-modal');
  modal.hidden = true;
  document.body.style.overflow = '';

  currentProduct = null;
  selectedSize = null;
  selectedColor = null;
}

export function onOrder(callback) {
  orderCallbacks.push(callback);
}

function setupVariantListeners(product) {
  const container = document.querySelector('.modal__variants');

  const handler = (e) => {
    const chip = e.target.closest('.variant-chip');
    if (!chip || chip.disabled) return;

    const type = chip.dataset.variantType;
    const value = chip.dataset.variantValue;

    if (type === 'size') {
      selectedSize = value;
      updateVariantUI(container, 'size', value);
      updateColorOptions(product);
    } else if (type === 'color') {
      selectedColor = value;
      updateVariantUI(container, 'color', value);
      updateSizeOptions(product);
    }

    updateSelectedVariant(product);
  };

  container.removeEventListener('click', handler);
  container.addEventListener('click', handler);
}

function updateVariantUI(container, type, value) {
  const chips = container.querySelectorAll(`[data-variant-type="${type}"]`);
  chips.forEach(chip => {
    const isSelected = chip.dataset.variantValue === value;
    chip.classList.toggle('variant-chip--selected', isSelected);
    chip.setAttribute('aria-pressed', isSelected);
  });
}

function updateColorOptions(product) {
  const container = document.querySelector('[data-variant-color-options]');
  const chips = container.querySelectorAll('.variant-chip');
  const availableColors = getUniqueColors(product, selectedSize);
  const availableColorNames = availableColors.map(c => c.color);

  chips.forEach(chip => {
    const color = chip.dataset.variantValue;
    const isAvailable = availableColorNames.includes(color);
    chip.disabled = !isAvailable;
    chip.classList.toggle('variant-chip--sold-out', !isAvailable);

    if (!isAvailable && chip.classList.contains('variant-chip--selected')) {
      chip.classList.remove('variant-chip--selected');
      chip.setAttribute('aria-pressed', 'false');
      selectedColor = null;
    }
  });
}

function updateSizeOptions(product) {
  const container = document.querySelector('[data-variant-size-options]');
  const chips = container.querySelectorAll('.variant-chip');
  const availableSizes = getAvailableSizesForColor(product, selectedColor);
  const availableSizeNames = availableSizes.map(s => s.size);

  chips.forEach(chip => {
    const size = chip.dataset.variantValue;
    const isAvailable = availableSizeNames.includes(size);
    chip.disabled = !isAvailable;
    chip.classList.toggle('variant-chip--sold-out', !isAvailable);

    if (!isAvailable && chip.classList.contains('variant-chip--selected')) {
      chip.classList.remove('variant-chip--selected');
      chip.setAttribute('aria-pressed', 'false');
      selectedSize = null;
    }
  });
}

function updateSelectedVariant(product) {
  const variant = findVariant(product, selectedSize, selectedColor);
  const orderBtn = document.querySelector('[data-order-btn]');
  const priceEl = document.querySelector('.modal__price');

  if (variant) {
    orderBtn.disabled = false;
    priceEl.textContent = formatPrice(variant.price || product.price);
  } else {
    orderBtn.disabled = true;
    priceEl.textContent = formatPrice(product.price);
  }
}

function setupOrderButton(product) {
  const orderBtn = document.querySelector('[data-order-btn]');

  const handler = () => {
    if (!selectedSize && !selectedColor) return;

    const variant = findVariant(product, selectedSize, selectedColor);
    const url = generateWhatsAppUrl(appPhone, product, variant);

    if (url && url !== '#') {
      orderCallbacks.forEach(cb => cb({ product, variant, url }));
      window.open(url, '_blank');
    }
  };

  orderBtn.removeEventListener('click', handler);
  orderBtn.addEventListener('click', handler);
}


