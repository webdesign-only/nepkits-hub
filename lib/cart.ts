import { STORE } from './config';

export type CartProduct = {
  id: string;
  slug?: string;
  name?: string;
  price?: number | string;
  team?: string;
  images?: Array<{ url?: string; is_primary?: boolean }>;
};

export type CartItem = {
  product: CartProduct;
  size: string;
  quantity: number;
};

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE.cartKey) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(STORE.cartKey, JSON.stringify(items));
  window.dispatchEvent(new Event('nepkits:cart'));
}

export function addToCart(product: CartProduct, size: string, quantity = 1) {
  const items = readCart();
  const index = items.findIndex((item) => item.product.id === product.id && item.size === size);

  if (index === -1) {
    items.push({ product, size, quantity });
  } else {
    items[index] = { ...items[index], quantity: items[index].quantity + quantity };
  }

  writeCart(items);
}

export function removeFromCart(index: number) {
  const items = readCart();
  writeCart(items.filter((_, itemIndex) => itemIndex !== index));
}

export function updateCartQuantity(index: number, quantity: number) {
  const items = readCart();
  if (!items[index]) return;
  items[index] = { ...items[index], quantity: Math.max(1, quantity) };
  writeCart(items);
}

export function clearCart() {
  writeCart([]);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + Number(item.product.price || 0) * item.quantity, 0);
}
