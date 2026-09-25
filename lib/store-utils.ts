import type { CartProduct } from './cart';

export const money = (value: number | string) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(Number(value));

export function imageFor(product?: CartProduct | null) {
  return product?.images?.find((image) => image.is_primary)?.url ?? product?.images?.[0]?.url ?? '';
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
