'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearCart, readCart, type CartItem } from '../../lib/cart';
import { money } from '../../lib/store-utils';
import { supabase } from '../../lib/supabase-browser';

type Address = {
  id: string;
  full_name: string;
  phone: string;
  address_text: string;
  area: string;
  city: string;
};

type DeliveryZone = {
  id: string;
  name: string;
  delivery_fee: number | string;
};

const steps = [
  { number: '01', label: 'DELIVERY' },
  { number: '02', label: 'AREA' },
  { number: '03', label: 'PAYMENT' },
  { number: '04', label: 'PROMO' },
];

export default function Checkout() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [addressId, setAddressId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [payment, setPayment] = useState<'cod' | 'esewa'>('cod');
  const [coupon, setCoupon] = useState('');
  const [reference, setReference] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setItems(readCart());

    async function loadCheckoutData() {
      const { data: auth } = await supabase.auth.getUser();
      setUser(auth.user ?? null);

      if (!auth.user) return;

      const [addressResult, zoneResult] = await Promise.all([
        supabase
          .from('addresses')
          .select('*')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('delivery_zones')
          .select('*')
          .eq('active', true)
          .order('name'),
      ]);

      const nextAddresses = (addressResult.data ?? []) as Address[];
      const nextZones = (zoneResult.data ?? []) as DeliveryZone[];

      setAddresses(nextAddresses);
      setZones(nextZones);
      setAddressId(nextAddresses[0]?.id ?? '');
      setZoneId(nextZones[0]?.id ?? '');
    }

    loadCheckoutData();
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.product.price || 0) * item.quantity,
        0,
      ),
    [items],
  );

  const totalUnits = useMemo(
    () => items.reduce((total, item) => total + Number(item.quantity || 0), 0),
    [items],
  );

  const selectedZone = zones.find((zone) => zone.id === zoneId);
  const deliveryFee = Number(selectedZone?.delivery_fee || 0);
  const estimatedTotal = subtotal + deliveryFee;

  async function placeOrder() {
    setError('');

    if (!user) {
      router.push('/login?next=/checkout');
      return;
    }

    if (!addressId || !zoneId) {
      setError('Choose an address and delivery zone.');
      return;
    }

    if (payment === 'esewa' && (!reference.trim() || !proof)) {
      setError('eSewa requires a reference number and screenshot.');
      return;
    }

    setBusy(true);

    const { data: order, error: orderError } = await supabase.rpc(
      'place_order',
      {
        p_user_id: user.id,
        p_items: items.map((item) => ({
          product_id: item.product.id,
          size: item.size,
          quantity: item.quantity,
        })),
        p_address_id: addressId,
        p_delivery_zone_id: zoneId,
        p_payment_method: payment,
        p_coupon_code: coupon.trim() || null,
      },
    );

    if (orderError || !order?.id) {
      setBusy(false);
      setError(orderError?.message || 'The order could not be created. Please try again.');
      return;
    }

    if (payment === 'esewa' && proof) {
      const extension = proof.name.split('.').pop() || 'png';
      const path =
        user.id +
        '/' +
        order.id +
        '/' +
        Date.now() +
        '-payment-proof.' +
        extension;

      const upload = await supabase.storage
        .from('private-documents')
        .upload(path, proof, {
          contentType: proof.type,
          upsert: false,
        });

      if (!upload.error) {
        const { data: paymentRecord } = await supabase
          .from('payments')
          .select('id,metadata')
          .eq('order_id', order.id)
          .maybeSingle();

        if (paymentRecord?.id) {
          await supabase
            .from('payments')
            .update({
              provider_transaction_id: reference.trim(),
              metadata: {
                ...(paymentRecord.metadata || {}),
                transaction_reference: reference.trim(),
                screenshot_path: path,
              },
            })
            .eq('id', paymentRecord.id);
        }
      }
    }

    clearCart();
    router.push('/orders/' + order.id);
  }

  if (!items.length) {
    return (
      <main className="checkout-page checkout-page-empty">
        <div className="checkout-empty-shell">
          <span className="checkout-kicker">NEPKITS HUB / CHECKOUT</span>
          <div className="checkout-empty-card">
            <div className="checkout-empty-number">00</div>
            <h1>
              YOUR BAG
              <br />
              <em>IS EMPTY.</em>
            </h1>
            <p>Add your matchday picks first, then come back here to finish the order.</p>
            <Link href="/shop" className="checkout-primary-link">
              SHOP JERSEYS <span>→</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page checkout-page-new">
      <div className="checkout-shell">
        <header className="checkout-top">
          <div>
            <Link href="/shop" className="checkout-back-link">
              ← BACK TO SHOP
            </Link>
            <span className="checkout-kicker">NEPKITS HUB / SECURE CHECKOUT</span>
            <h1>
              FINISH
              <br />
              <em>THE ORDER.</em>
            </h1>
          </div>

          <div className="checkout-top-meta">
            <span>01</span>
            <strong>{String(totalUnits).padStart(2, '0')} ITEMS</strong>
            <small>READY FOR MATCHDAY</small>
          </div>
        </header>

        <nav className="checkout-progress" aria-label="Checkout progress">
          {steps.map((step, index) => (
            <div className="checkout-progress-step" key={step.number}>
              <span>{step.number}</span>
              <strong>{step.label}</strong>
              {index < steps.length - 1 && <i />}
            </div>
          ))}
        </nav>

        <div className="checkout-trust-strip">
          <span>✓ SECURE CHECKOUT</span>
          <span>✓ CASH ON DELIVERY</span>
          <span>✓ ESEWA AVAILABLE</span>
          <span>✓ NEPAL DELIVERY</span>
        </div>

        <div className="checkout-grid-new">
          <section className="checkout-main-column">
            <div className="checkout-card-new">
              <div className="checkout-card-head-new">
                <div className="checkout-step-badge">01</div>
                <div>
                  <span>DELIVERY</span>
                  <h2>WHERE SHOULD WE SEND IT?</h2>
                </div>
              </div>

              {addresses.length ? (
                <div className="checkout-address-grid">
                  {addresses.map((address) => (
                    <button
                      type="button"
                      key={address.id}
                      className={
                        addressId === address.id
                          ? 'checkout-address selected'
                          : 'checkout-address'
                      }
                      onClick={() => setAddressId(address.id)}
                    >
                      <span className="checkout-radio">
                        {addressId === address.id ? '✓' : ''}
                      </span>
                      <div>
                        <strong>{address.full_name}</strong>
                        <span>{address.phone}</span>
                        <small>
                          {address.address_text}, {address.area}, {address.city}
                        </small>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="checkout-inline-empty">
                  <strong>NO SAVED ADDRESS</strong>
                  <span>Add one to your account before placing the order.</span>
                  <Link href="/account">ADD ADDRESS →</Link>
                </div>
              )}
            </div>

            <div className="checkout-card-new">
              <div className="checkout-card-head-new">
                <div className="checkout-step-badge">02</div>
                <div>
                  <span>DELIVERY AREA</span>
                  <h2>CHOOSE YOUR ZONE</h2>
                </div>
              </div>

              <div className="checkout-zone-row">
                <select
                  value={zoneId}
                  onChange={(event) => setZoneId(event.target.value)}
                  className="checkout-zone-select"
                >
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} · {money(zone.delivery_fee)} delivery
                    </option>
                  ))}
                </select>
                <div className="checkout-zone-note">
                  <strong>{selectedZone?.name || 'SELECT A ZONE'}</strong>
                  <span>Delivery fee is controlled by the store zone.</span>
                </div>
              </div>
            </div>

            <div className="checkout-card-new">
              <div className="checkout-card-head-new">
                <div className="checkout-step-badge">03</div>
                <div>
                  <span>PAYMENT</span>
                  <h2>HOW WOULD YOU LIKE TO PAY?</h2>
                </div>
              </div>

              <div className="checkout-payment-grid">
                <button
                  type="button"
                  className={
                    payment === 'cod'
                      ? 'checkout-payment selected'
                      : 'checkout-payment'
                  }
                  onClick={() => setPayment('cod')}
                >
                  <span className="checkout-payment-icon">COD</span>
                  <strong>CASH ON DELIVERY</strong>
                  <small>Pay when your order arrives.</small>
                  <b>{payment === 'cod' ? 'SELECTED ✓' : 'SELECT'}</b>
                </button>

                <button
                  type="button"
                  className={
                    payment === 'esewa'
                      ? 'checkout-payment selected'
                      : 'checkout-payment'
                  }
                  onClick={() => setPayment('esewa')}
                >
                  <span className="checkout-payment-icon esewa">eS</span>
                  <strong>ESEWA</strong>
                  <small>Reference number + payment proof.</small>
                  <b>{payment === 'esewa' ? 'SELECTED ✓' : 'SELECT'}</b>
                </button>
              </div>

              {payment === 'esewa' && (
                <div className="checkout-esewa-panel">
                  <label>
                    <span>TRANSACTION / REFERENCE NUMBER</span>
                    <input
                      className="checkout-input-new"
                      value={reference}
                      onChange={(event) => setReference(event.target.value)}
                      placeholder="Enter your eSewa reference"
                    />
                  </label>

                  <label className="checkout-upload">
                    <span>PAYMENT SCREENSHOT</span>
                    <strong>
                      {proof?.name || 'UPLOAD IMAGE'} <b>↑</b>
                    </strong>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) =>
                        setProof(event.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="checkout-card-new checkout-promo-card">
              <div className="checkout-card-head-new">
                <div className="checkout-step-badge">04</div>
                <div>
                  <span>PROMOTION</span>
                  <h2>HAVE A CODE?</h2>
                </div>
              </div>

              <div className="checkout-promo-row">
                <input
                  className="checkout-input-new"
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value.toUpperCase())}
                  placeholder="ENTER COUPON CODE"
                />
                <span>✓ VERIFIED SERVER-SIDE</span>
              </div>
            </div>

            {error && (
              <div className="checkout-error-new">
                <strong>CHECKOUT NEEDS YOUR ATTENTION</strong>
                <span>{error}</span>
              </div>
            )}
          </section>

          <aside className="checkout-summary-new">
            <div className="checkout-summary-top">
              <span>YOUR BAG</span>
              <strong>{String(totalUnits).padStart(2, '0')} ITEMS</strong>
            </div>

            <div className="checkout-summary-list">
              {items.map((item) => (
                <article
                  className="checkout-summary-item"
                  key={item.product.id + '-' + item.size}
                >
                  <div className="checkout-summary-image">
                    <img
                      src={item.product.images?.[0]?.url || ''}
                      alt={item.product.name || 'Product'}
                    />
                    <span>{item.quantity}</span>
                  </div>
                  <div className="checkout-summary-copy">
                    <small>
                      {item.product.team || 'NEPKITS'} · SIZE {item.size}
                    </small>
                    <strong>{item.product.name}</strong>
                    <span>{money(item.product.price || 0)} each</span>
                  </div>
                  <b>{money(Number(item.product.price) * item.quantity)}</b>
                </article>
              ))}
            </div>

            <div className="checkout-summary-lines">
              <div>
                <span>SUBTOTAL</span>
                <strong>{money(subtotal)}</strong>
              </div>
              <div>
                <span>DELIVERY</span>
                <strong>
                  {selectedZone ? money(selectedZone.delivery_fee) : 'SELECT ZONE'}
                </strong>
              </div>
              <div className="checkout-summary-total">
                <span>MERCHANDISE</span>
                <strong>{money(subtotal)}</strong>
              </div>
            </div>

            <div className="checkout-summary-note">
              <span>✓</span>
              <div>
                <strong>READY FOR MATCHDAY</strong>
                <small>Your final delivery and promotion rules are confirmed server-side when the order is placed.</small>
              </div>
            </div>

            <button
              type="button"
              className="checkout-place-button"
              disabled={busy}
              onClick={placeOrder}
            >
              {busy ? 'CREATING ORDER…' : 'PLACE ORDER'}
              <span>→</span>
            </button>

            <Link href="/shop" className="checkout-continue-link">
              CONTINUE SHOPPING
            </Link>

            <div className="checkout-legal">
              By placing this order, you confirm your delivery and payment details.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
