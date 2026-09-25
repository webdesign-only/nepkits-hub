'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { addToCart } from '../../../lib/cart';
import { money } from '../../../lib/store-utils';
import type { Product } from '../../../lib/types';

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const response = await fetch(
          `/api/catalog?slug=${encodeURIComponent(String(params.slug))}`,
          { cache: 'no-store' },
        );
        const json = await response.json();

        if (cancelled) return;

        const data = (json.product ?? null) as Product | null;
        setProduct(data);
        setSize(data?.sizes?.find((item) => Number(item.stock_qty) > 0)?.size ?? '');
      } catch {
        if (!cancelled) setProduct(null);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (!product) {
    return <main className="product-page-loading">LOADING PRODUCT…</main>;
  }

  const images = product.images?.map((image) => image.url).filter(Boolean) ?? [];
  const selectedSize = product.sizes?.find((item) => item.size === size);
  const canAdd = Boolean(selectedSize && Number(selectedSize.stock_qty) > 0);

  function handleAddToCart() {
    if (!canAdd || !selectedSize) return;

    addToCart(product, size, quantity);
    window.dispatchEvent(new Event('nepkits:open-cart'));
  }

  return (
    <main className="product-detail">
      <div className="wide-shell">
        <div className="crumbs">
          <Link href="/shop">SHOP</Link>
          <span>/</span>
          <b>{product.name}</b>
        </div>

        <div className="product-layout">
          <section className="product-gallery" aria-label="Product images">
            <div className="gallery-main">
              <img src={images[activeImage] ?? ''} alt={product.name} />
              {Number(product.discount_percent) > 0 && (
                <span className="floating-sale">
                  {Math.round(Number(product.discount_percent))}% OFF
                </span>
              )}
            </div>

            <div className="gallery-thumbs">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={activeImage === index ? 'selected' : ''}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </section>

          <section className="product-buy">
            <span className="product-kicker">
              {product.team || 'NEPKITS'} · {product.season || '2026'}
            </span>

            <h1>{product.name}</h1>

            <div className="product-detail-rating">
              ★ {Number(product.rating || 0).toFixed(1)} · {product.review_count || 0} reviews
            </div>

            <div className="product-detail-price">
              {money(product.price)}
              {product.original_price && <del>{money(product.original_price)}</del>}
            </div>

            <p className="product-lede">{product.description}</p>

            <div className="size-block">
              <div className="size-heading">
                <strong>SELECT SIZE</strong>
                <span>SIZE GUIDE</span>
              </div>

              <div className="size-options">
                {(product.sizes ?? []).map((item) => {
                  const available = Number(item.stock_qty) > 0;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!available}
                      className={size === item.size ? 'selected' : ''}
                      onClick={() => setSize(item.size)}
                    >
                      {item.size}
                      <small>
                        {available ? `${item.stock_qty} LEFT` : 'SOLD OUT'}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="qty-row">
              <div className="qty-control">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <span>
                {selectedSize
                  ? `${selectedSize.stock_qty} AVAILABLE`
                  : 'SELECT A SIZE'}
              </span>
            </div>

            <div className="product-actions">
              <button
                type="button"
                className="primary-wide"
                disabled={!canAdd}
                onClick={handleAddToCart}
              >
                ADD TO BAG
              </button>
              <button type="button" className="outline-wide">
                ♡ WISHLIST
              </button>
            </div>

            <div className="product-trust">
              <div>
                <b>DELIVERY</b>
                <span>Live store zones</span>
              </div>
              <div>
                <b>RETURNS</b>
                <span>Store policy</span>
              </div>
              <div>
                <b>SECURE</b>
                <span>Verified checkout</span>
              </div>
            </div>

            <div className="accordion-stack">
              <div className="product-accordion">
                <button type="button">DESCRIPTION</button>
                <div className="accordion-body">{product.description}</div>
              </div>
              <div className="product-accordion">
                <button type="button">DETAILS</button>
                <div className="accordion-body">
                  Material: {product.material || 'Performance polyester'} · Fit:{' '}
                  {product.fit || 'Regular'} · Care:{' '}
                  {product.care_instructions || 'Cold wash, air dry.'}
                </div>
              </div>
              <div className="product-accordion">
                <button type="button">SHIPPING & RETURNS</button>
                <div className="accordion-body">
                  Delivery fees are controlled by the active store zones at checkout.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
