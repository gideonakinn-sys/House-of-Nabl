let cache = null;

export async function fetchProducts() {
  if (cache) return cache;
  const res = await fetch('/data/products.json');
  if (!res.ok) return null;
  const data = await res.json();
  cache = data;
  return data;
}

export function getProductById(data, id) {
  if (!data || !data.products) return null;
  return data.products.find((p) => p.id === id) || null;
}
