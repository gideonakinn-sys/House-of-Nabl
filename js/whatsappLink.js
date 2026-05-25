import { formatPrice } from './productRenderer.js';

export function generateWhatsAppUrl(phone, product, variant) {
  if (!phone || !product) return '#';

  const message = buildMessage(product, variant);
  const encoded = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encoded}`;
}

function buildMessage(product, variant) {
  const lines = [
    `Hi! I'm interested in the ${product.name}.`,
  ];

  if (variant) {
    lines.push(`Size: ${variant.size}, Color: ${variant.color}`);
  }

  const price = variant && variant.price ? variant.price : product.price;
  lines.push(`Price: ${formatPrice(price)}`);

  lines.push('');
  lines.push('Can you confirm availability?');

  return lines.join('\n');
}
