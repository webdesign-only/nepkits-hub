'use client';

import Link from 'next/link';
import {useEffect, useMemo, useState} from 'react';
import {formatNpr, readCart, subtotal} from '../../lib/cart';
import type {CartItem} from '../../lib/types';

export default function Checkout() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [done, setDone] = useState(false);
  const [zone, setZone] = useState('Kathmandu Valley');
  const [payment, setPayment] = useState('cod');

  useEffect(() => setItems(readCart()), []);

  const sub = useMemo(() => subtotal(items), [items]);
  const delivery = zone === 'Kathmandu Valley' ? 100 : 180;
  const total = sub + delivery;

  if (done) {
    return (
      <main className="checkout-page checkout-complete">
        <div className="success">
          <span>NEPKITS HUB / ORDER RECEIVED</span>
          <h1>READY FOR<br /><em>MATCHDAY.</em></h1>
          <p>Your order request has been recorded. We will confirm delivery details next.</p>
          <Link href="/shop" className="primary">KEEP SHOPPING →</Link>
        </div>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="checkout-page checkout-complete">
        <div className="success">
          <span>NEPKITS HUB / CHECKOUT</span>
          <h1>YOUR BAG IS<br /><em>EMPTY.</em></h1>
          <p>Add a jersey before opening checkout.</p>
          <Link href="/shop" className="primary">SHOP JERSEYS →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page checkout-modern">
      <header className="checkout-head">
        <div>
          <span>NEPKITS HUB / SECURE CHECKOUT</span>
          <h1>FINISH THE <em>ORDER.</em></h1>
        </div>
        <div className="checkout-head-meta">
          <b>FAST CHECKOUT</b>
          <span>COD + eSewa</span>
          <Link href="/shop">← BACK TO SHOP</Link>
        </div>
      </header>

      <div className="checkout-steps" aria-label="Checkout progress">
        <div className="active"><b>01</b><span>DELIVERY</span></div>
        <i />
        <div className="active"><b>02</b><span>PAYMENT</span></div>
        <i />
        <div><b>03</b><span>REVIEW</span></div>
      </div>

      <form
        className="checkout-layout"
        onSubmit={(event) => {
          event.preventDefault();
          setDone(true);
        }}
      >
        <div className="checkout-form">
          <section className="checkout-card">
            <div className="checkout-card-title"><b>01</b><div><span>DELIVERY DETAILS</span><small>Where should we send your matchday kit?</small></div></div>
            <div className="fields">
              <label><span>FULL NAME</span><input required placeholder="Your name" /></label>
              <label><span>PHONE NUMBER</span><input required placeholder="98XXXXXXXX" /></label>
              <label className="full"><span>DELIVERY ADDRESS</span><input required placeholder="Street, area, landmark" /></label>
              <label className="full"><span>DELIVERY ZONE</span><select value={zone} onChange={(event) => setZone(event.target.value)}><option>Kathmandu Valley</option><option>Outside Kathmandu Valley</option></select></label>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-title"><b>02</b><div><span>PAYMENT METHOD</span><small>Choose the way you want to pay.</small></div></div>
            <div className="payment-grid">
              <label className={payment === 'cod' ? 'selected' : ''}><input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} /><span><strong>CASH ON DELIVERY</strong><small>Pay when your order arrives</small></span><em>COD</em></label>
              <label className={payment === 'esewa' ? 'selected' : ''}><input type="radio" name="payment" checked={payment === 'esewa'} onChange={() => setPayment('esewa')} /><span><strong>eSEWA / ONLINE</strong><small>Pay digitally after order</small></span><em>ONLINE</em></label>
            </div>
          </section>

          <section className="checkout-card checkout-note">
            <div className="checkout-card-title"><b>03</b><div><span>FINAL NOTE</span><small>Optional delivery instruction.</small></div></div>
            <input placeholder="Add a short note for the rider…" />
          </section>

          <button className="place" type="submit">PLACE ORDER <span>→</span> {formatNpr(total)}</button>
        </div>

        <aside className="summary">
          <div className="summary-head"><span>YOUR ORDER</span><b>{items.reduce((sum, item) => sum + item.quantity, 0)} ITEMS</b></div>
          <div className="summary-items">
            {items.map((item) => (
              <div className="sum-item" key={item.product.id + item.size}>
                <div className="sum-image"><img src={item.product.image} alt="" /><b>{item.quantity}</b></div>
                <div><strong>{item.product.name}</strong><small>{item.product.team} · SIZE {item.size}</small></div>
                <b>{formatNpr(item.product.price * item.quantity)}</b>
              </div>
            ))}
          </div>
          <div className="summary-lines">
            <div><span>SUBTOTAL</span><b>{formatNpr(sub)}</b></div>
            <div><span>DELIVERY</span><b>{formatNpr(delivery)}</b></div>
          </div>
          <div className="sum-total"><span>ESTIMATED TOTAL</span><strong>{formatNpr(total)}</strong></div>
          <div className="summary-trust"><b>✓ SECURE CHECKOUT</b><span>Prices shown in Nepalese Rupees</span></div>
        </aside>
      </form>
    </main>
  );
}
