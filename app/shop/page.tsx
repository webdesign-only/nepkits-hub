'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../../components/product-card';
import type { Product } from '../../lib/types';

type Category = {
  id: string;
  name: string;
};

type SortKey = 'featured' | 'newest' | 'popular' | 'low' | 'high';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [collection, setCollection] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setQuery(params.get('q') || '');
    setCategory(params.get('category') || '');
    setCollection(params.get('collection') || '');

    let cancelled = false;

    async function loadCatalog() {
      try {
        const response = await fetch('/api/catalog', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Catalog unavailable');
        }

        if (cancelled) return;

        setProducts((data.products ?? []) as Product[]);
        setCategories((data.categories ?? []) as Category[]);
      } catch (reason) {
        if (!cancelled) {
          setError(reason instanceof Error ? reason.message : 'Catalog unavailable');
        }
      }
    }

    loadCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let result = products.filter((product) => {
      const haystack = [
        product.name,
        product.team,
        product.player,
        product.season,
        product.league,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        (!normalizedQuery || haystack.includes(normalizedQuery)) &&
        (!category || product.category_id === category)
      );
    });

    if (collection === 'new') {
      result = result.filter((product) => product.new_arrival);
    }

    if (collection === 'sale') {
      result = result.filter(
        (product) => Number(product.discount_percent || 0) > 0,
      );
    }

    if (collection === 'best') {
      result = [...result].sort(
        (a, b) => Number(b.sold_count || 0) - Number(a.sold_count || 0),
      );
    }

    if (sort === 'newest') {
      result = [...result].sort(
        (a, b) =>
          +new Date((b as Product & { created_at?: string }).created_at || 0) -
          +new Date((a as Product & { created_at?: string }).created_at || 0),
      );
    }

    if (sort === 'popular') {
      result = [...result].sort(
        (a, b) => Number(b.sold_count || 0) - Number(a.sold_count || 0),
      );
    }

    if (sort === 'low') {
      result = [...result].sort(
        (a, b) => Number(a.price) - Number(b.price),
      );
    }

    if (sort === 'high') {
      result = [...result].sort(
        (a, b) => Number(b.price) - Number(a.price),
      );
    }

    return result;
  }, [products, query, category, collection, sort]);

  const heading =
    collection === 'best'
      ? 'BEST SELLERS'
      : collection === 'sale'
        ? 'FLASH DEALS'
        : category
          ? 'JERSEY COLLECTION'
          : 'FOOTBALL JERSEYS & SPORTSWEAR';

  return (
    <main className="market-shop">
      <div className="market-shell">
        <div className="shop-breadcrumb">
          HOME › SHOP
          {category ? ' › FILTERED' : ''}
          {collection ? ' › ' + collection.toUpperCase() : ''}
        </div>

        <div className="shop-heading">
          <div>
            <span>NEPKITS HUB MARKETPLACE</span>
            <h1>{heading}</h1>
          </div>
          <p>{filteredProducts.length} products</p>
        </div>

        <div className="shop-layout">
          <aside className="market-filter">
            <div className="filter-head">FILTER BY</div>

            <div className="filter-group">
              <h4>CATEGORIES</h4>
              <button
                type="button"
                className={!category ? 'active' : ''}
                onClick={() => {
                  setCategory('');
                  setCollection('');
                }}
              >
                All Products
              </button>
              {categories.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={category === item.id ? 'active' : ''}
                  onClick={() => {
                    setCategory(item.id);
                    setCollection('');
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <h4>COLLECTIONS</h4>
              {(['new', 'best', 'sale'] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  className={collection === value ? 'active' : ''}
                  onClick={() => setCollection(value)}
                >
                  {value === 'new'
                    ? 'New Arrivals'
                    : value === 'best'
                      ? 'Best Sellers'
                      : 'Flash Deals'}
                </button>
              ))}
            </div>

            <div className="filter-group">
              <h4>POPULAR CLUBS</h4>
              {['FC Barcelona', 'Tottenham Hotspur', 'Inter Milan'].map(
                (team) => (
                  <button
                    type="button"
                    key={team}
                    onClick={() => setQuery(team)}
                  >
                    {team}
                  </button>
                ),
              )}
            </div>
          </aside>

          <section className="shop-results">
            <div className="shop-toolbar">
              <div>
                <b>{filteredProducts.length}</b> RESULTS
                <span> • LIVE CATALOG</span>
              </div>

              <div className="shop-controls">
                <label>
                  SORT BY
                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value as SortKey)
                    }
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Popular</option>
                    <option value="low">Price low</option>
                    <option value="high">Price high</option>
                  </select>
                </label>
              </div>
            </div>

            {error ? (
              <div className="shop-empty">
                <h2>Catalog connection issue</h2>
                <p>{error}</p>
              </div>
            ) : filteredProducts.length ? (
              <div className="market-grid four">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="shop-empty">
                <h2>NO PRODUCTS FOUND</h2>
                <p>Try another club, country, or collection.</p>
                <Link href="/shop">RESET FILTERS →</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
