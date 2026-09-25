'use client';

import { useEffect, useState } from 'react';
import { readCart } from '../lib/cart';

function getCount() {
  return readCart().reduce((total, item) => total + Number(item.quantity || 0), 0);
}

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(getCount());

    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('nepkits:cart', refresh);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('nepkits:cart', refresh);
    };
  }, []);

  return (
    <span className="market-cart-count" aria-label={`${count} items in cart`}>
      {count}
    </span>
  );
}
