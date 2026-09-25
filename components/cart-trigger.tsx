'use client';

import CartBadge from './cart-badge';

type CartTriggerProps = {
  className?: string;
  mobile?: boolean;
  footer?: boolean;
};

export default function CartTrigger({
  className = 'market-cart',
  mobile = false,
  footer = false,
}: CartTriggerProps) {
  return (
    <button
      type="button"
      className={className + ' cart-open-trigger'}
      onClick={() => window.dispatchEvent(new Event('nepkits:open-cart'))}
      aria-label="Open cart"
    >
      {!footer && <span>🛒</span>}
      <b className={mobile ? 'sr-only' : ''}>Cart</b>
      <CartBadge />
    </button>
  );
}
