const DATA_URL = '/data/products.json';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

let controller;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchProducts() {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();

  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(DATA_URL, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid product data format');
      }

      return {
        products: data.products,
        phone: data.phone || ''
      };

    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }

      lastError = err;

      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY * (attempt + 1));
      }
    }
  }

  throw lastError || new Error('Failed to load products');
}
