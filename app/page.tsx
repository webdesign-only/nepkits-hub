'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/product-card';
import { CATEGORY_IDS } from '../lib/config';
import { imageFor } from '../lib/store-utils';
import type { Product } from '../lib/types';

type Category = {
  id: string;
  name: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      try {
        const response = await fetch('/api/catalog', { cache: 'no-store' });
        const data = await response.json();

        if (cancelled) return;

        setProducts((data.products ?? []) as Product[]);
        setCategories((data.categories ?? []) as Category[]);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setCategories([]);
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const newest = useMemo(
    () => products.filter((product) => product.new_arrival),
    [products],
  );

  const bestSellers = useMemo(
    () =>
      [...products].sort(
        (a, b) => Number(b.sold_count || 0) - Number(a.sold_count || 0),
      ),
    [products],
  );

  const clubs = useMemo(
    () =>
      products.filter((product) =>
        ['FC Barcelona', 'Tottenham Hotspur', 'Inter Milan'].includes(
          product.team || '',
        ),
      ),
    [products],
  );

  const worldCup = useMemo(
    () =>
      products.filter((product) =>
        ['Brazil', 'France', 'USA'].includes(product.team || ''),
      ),
    [products],
  );

  const hero = clubs[0] ?? worldCup[0] ?? products[0] ?? null;

  const featuredCategories = categories
    .map((category) => ({
      ...category,
      product: products.find((product) => product.category_id === category.id),
    }))
    .filter((item) => item.product);

  return (
    <main className="market-home">
      <div className="market-shell home-main-grid">
        <aside className="home-category-panel">
          <div className="panel-title">TOP CATEGORIES</div>

          {featuredCategories.slice(0, 8).map((category) => (
            <Link key={category.id} href={'/shop?category=' + category.id}>
              <span>{category.name}</span>
              <b>›</b>
            </Link>
          ))}

          <Link className="see-all" href="/shop">
            VIEW ALL CATEGORIES →
          </Link>
        </aside>

        <section className="market-hero">
          {hero && <img src={imageFor(hero)} alt={hero.name} />}
          <div className="market-hero-overlay" />

          <div className="market-hero-copy">
            <span>FAN REPLICA COLLECTION • 2026</span>
            <h1>
              WORLD&apos;S BIGGEST
              <br />
              <em>FOOTBALL SHIRTS.</em>
            </h1>
            <p>
              Famous club jerseys + 2026 World Cup fanwear, built into the
              NEPKITS marketplace.
            </p>
            <Link href="/shop" className="market-hero-btn">
              SHOP NOW
            </Link>
          </div>
        </section>

        <aside className="hero-deal-stack">
          <div>
            <span>FLASH SALE</span>
            <strong>UP TO 30% OFF</strong>
            <Link href="/shop?collection=sale">SHOP DEALS →</Link>
          </div>
          <div>
            <span>COD</span>
            <strong>DELIVERY ACROSS NEPAL</strong>
            <small>Pay on delivery where available.</small>
          </div>
          <div>
            <span>NEW</span>
            <strong>WORLD CUP 2026</strong>
            <Link href={'/shop?category=' + CATEGORY_IDS.worldCup}>
              EXPLORE →
            </Link>
          </div>
        </aside>
      </div>

      <div className="market-shell service-strip">
        <div>
          <b>🚚</b>
          <span>
            <strong>Fast delivery</strong>
            <small>Across Nepal</small>
          </span>
        </div>
        <div>
          <b>↺</b>
          <span>
            <strong>Easy returns</strong>
            <small>Store policy applies</small>
          </span>
        </div>
        <div>
          <b>✓</b>
          <span>
            <strong>Secure payments</strong>
            <small>COD + eSewa flow</small>
          </span>
        </div>
        <div>
          <b>★</b>
          <span>
            <strong>Fan favourites</strong>
            <small>Best-selling jerseys</small>
          </span>
        </div>
      </div>

      <section className="market-section">
        <div className="market-shell">
          <div className="market-section-head">
            <div>
              <span>SHOP BY COLLECTION</span>
              <h2>FAMOUS CLUBS</h2>
            </div>
            <Link href={'/shop?category=' + CATEGORY_IDS.clubs}>SEE ALL →</Link>
          </div>

          <div className="club-strip">
            {clubs.map((product) => (
              <Link
                href={'/products/' + product.slug}
                key={product.id}
              >
                <img src={imageFor(product)} alt={product.team || product.name} />
                <div>
                  <b>{product.team}</b>
                  <span>SHOP JERSEY →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="market-section gray">
        <div className="market-shell">
          <div className="market-section-head">
            <div>
              <span>LIMITED-TIME OFFERS</span>
              <h2>FLASH SALE</h2>
            </div>
            <div className="sale-timer">
              <b>00</b>
              <i>:</i>
              <b>32</b>
              <i>:</i>
              <b>47</b>
            </div>
            <Link href="/shop?collection=sale">VIEW ALL →</Link>
          </div>

          <div className="market-grid five">
            {(newest.length ? newest : products)
              .slice(0, 5)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      <section className="market-section">
        <div className="market-shell">
          <div className="market-section-head">
            <div>
              <span>FIFA WORLD CUP 2026</span>
              <h2>WORLD CUP JERSEYS</h2>
            </div>
            <Link href={'/shop?category=' + CATEGORY_IDS.worldCup}>
              SHOP ALL →
            </Link>
          </div>

          <div className="market-grid three-feature">
            {worldCup.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="market-section gray">
        <div className="market-shell">
          <div className="market-section-head">
            <div>
              <span>HOT RIGHT NOW</span>
              <h2>BEST SELLERS</h2>
            </div>
            <Link href="/shop?collection=best">VIEW ALL →</Link>
          </div>

          <div className="market-grid five">
            {bestSellers.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="market-cta">
        <div className="market-shell">
          <div>
            <span>NEPKITS HUB</span>
            <h2>
              ONE MARKETPLACE.
              <br />
              <em>EVERY SHIRT.</em>
            </h2>
            <p>
              Club football, national teams, retro drops, training wear and
              matchday accessories.
            </p>
          </div>
          <Link href="/shop" className="market-cta-btn">
            START SHOPPING →
          </Link>
        </div>
      </section>
    </main>
  );
}
