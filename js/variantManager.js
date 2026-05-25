export function getAvailableVariants(product) {
  if (!product || !product.variants) return [];

  return product.variants.filter(v => v.stock);
}

export function findVariant(product, size, color) {
  if (!product || !product.variants) return null;

  return product.variants.find(v =>
    v.size === size &&
    v.color === color
  ) || null;
}

export function getVariantBySku(product, sku) {
  if (!product || !product.variants) return null;
  return product.variants.find(v => v.sku === sku) || null;
}

export function getUniqueSizes(product) {
  const seen = new Set();
  return (product.variants || []).filter(v => {
    if (seen.has(v.size)) return false;
    seen.add(v.size);
    return true;
  }).map(v => ({ size: v.size }));
}

export function getUniqueColors(product, selectedSize) {
  const seen = new Set();
  return (product.variants || []).filter(v => {
    if (selectedSize && v.size !== selectedSize) return false;
    if (seen.has(v.color)) return false;
    seen.add(v.color);
    return true;
  }).map(v => ({ color: v.color, colorHex: v.colorHex, stock: v.stock }));
}

export function getAvailableSizesForColor(product, selectedColor) {
  const seen = new Set();
  return (product.variants || []).filter(v => {
    if (selectedColor && v.color !== selectedColor) return false;
    if (seen.has(v.size)) return false;
    seen.add(v.size);
    return true;
  }).map(v => ({ size: v.size, stock: v.stock }));
}
