'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  cartSubtotal,
  clearCart,
  readCart,
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from '../lib/cart';
import { imageFor, money } from '../lib/store-utils';

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = () => {
    setItems(readCart());
    setReady(true);
  };

  useEffect(() => {
    refresh();

    const onOpen = () => {
      refresh();
      setOpen(true);
    };
    const onCart = () => refresh();

    window.addEventListener('nepkits:open-cart', onOpen);
    window.addEventListener('nepkits:cart', onCart);
    window.addEventListener('storage', onCart);

    return () => {
      window.removeEventListener('nepkits:open-cart', onOpen);
      window.removeEventListener('nepkits:cart', onCart);
      window.removeEventListener('storage', onCart);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const totalUnits = useMemo(
    () => items.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [items],
  );

  function update(index: number, quantity: number) {
    updateCartQuantity(index, quantity);
    refresh();
  }

  function remove(index: number) {
    removeFromCart(index);
    refresh();
  }

  function clear() {
    clearCart();
    refresh();
  }

  if (!ready || !open) return null;

  return (
    <div className="cart-drawer-layer">
      <button
        className="cart-drawer-backdrop"
        aria-label="Close cart"
        onClick={() => setOpen(false)}
      />

      <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="cart-drawer-head">
          <div>
            <span>NEPKITS HUB</span>
            <h2>
              YOUR BAG <em>({totalUnits})</em>
            </h2>
          </div>
          <button
            className="cart-drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <div className="cart-drawer-empty-icon">🛒</div>
            <strong>YOUR BAG IS EMPTY</strong>
            <p>Add a jersey and it will appear here instantly.</p>
            <Link
              href="/shop"
              className="cart-drawer-shop"
              onClick={() => setOpen(false)}
            >
              SHOP JERSEYS →
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item, index) => (
                <article
                  className="cart-drawer-item"
                  key={`${item.product.id}-${item.size}`}
                >
                  <Link
                    href={`/products/${item.product.slug}`}
                    onClick={() => setOpen(false)}
                    className="cart-drawer-thumb"
                  >
                    <img src={imageFor(item.product)} alt={item.product.name || 'Product'} />
                  </Link>

                  <div className="cart-drawer-info">
                    <div className="cart-drawer-team">
                      {item.product.team || 'NEPKITS'} <span>• {item.size}</span>
                    </div>

                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={() => setOpen(false)}
                      className="cart-drawer-name"
                    >
                      {item.product.name}
                    </Link>

                    <div className="cart-drawer-row">
                      <strong>{money(item.product.price || 0)}</strong>
                      <button onClick={() => remove(index)}>REMOVE</button>
                    </div>

                    <div className="cart-drawer-qty">
                      <button onClick={() => update(index, item.quantity - 1)}>-</button>
                      <b>{item.quantity}</b>
                      <button onClick={() => update(index, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-drawer-foot">
              <div className="cart-drawer-delivery">
                <span>✓ CASH ON DELIVERY</span>
                <span>✓ NEPAL DELIVERY</span>
              </div>

              <div className="cart-drawer-summary">
                <span>SUBTOTAL</span>
                <strong>{money(subtotal)}</strong>
              </div>

              <Link
                href="/checkout"
                className="cart-drawer-checkout"
                onClick={() => setOpen(false)}
              >
                GO TO CHECKOUT <span>→</span>
              </Link>

              <div className="cart-drawer-actions">
                <button onClick={clear}>CLEAR BAG</button>
                <Link href="/shop" onClick={() => setOpen(false)}>
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
