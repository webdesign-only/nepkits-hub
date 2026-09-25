'use client';

import Link from 'next/link';
import { useState } from 'react';
import { addToCart } from '../lib/cart';
import { imageFor, money } from '../lib/store-utils';
import type { Product } from '../lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const defaultSize =
    product.sizes?.find((size) => Number(size.stock_qty) > 0)?.size ?? '';

  function handleAdd() {
    if (!defaultSize) return;
    addToCart(product, defaultSize);
    window.dispatchEvent(new Event('nepkits:open-cart'));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  }

  return (
    <article className="market-card">
      <Link href={'/products/' + product.slug} className="market-card-image">
        <img src={imageFor(product)} alt={product.name} loading="lazy" />
        {Number(product.discount_percent) > 0 && (
          <span className="discount-tag">
            {Math.round(Number(product.discount_percent))}% OFF
          </span>
        )}
        {product.new_arrival && <span className="new-tag">NEW</span>}
        <span className="heart-tag" aria-hidden="true">♡</span>
      </Link>

      <div className="market-card-body">
        <div className="market-team">
          {product.team || 'NEPKITS'}
          <span>• {product.season || '2026'}</span>
        </div>

        <Link href={'/products/' + product.slug} className="market-name">
          {product.name}
        </Link>

        <div className="market-rating">
          <b>★ {Number(product.rating || 0).toFixed(1)}</b>
          <span>|</span>
          <span>{Number(product.review_count || 0)} ratings</span>
          <span>|</span>
          <span>{Number(product.sold_count || 0)} sold</span>
        </div>

        <div className="market-price-row">
          <strong>{money(product.price)}</strong>
          {product.original_price && <del>{money(product.original_price)}</del>}
          <span>
            {Number(product.discount_percent) > 0
              ? Math.round(Number(product.discount_percent)) + '% OFF'
              : 'Good price'}
          </span>
        </div>

        <div className="market-delivery">🚚 COD available • Nepal</div>

        <button
          type="button"
          className="market-add"
          disabled={!defaultSize}
          onClick={handleAdd}
        >
          {added ? 'ADDED ✓' : defaultSize ? 'ADD TO CART' : 'SOLD OUT'}
        </button>
      </div>
    </article>
  );
}
