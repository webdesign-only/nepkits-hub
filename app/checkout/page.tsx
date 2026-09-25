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
        (total, item) => total + Number(item.product.price || 0) * item.quantity,
        0,
      ),
    [items],
  );

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

    const { data: order, error: orderError } = await supabase.rpc('place_order', {
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
    });

    if (orderError) {
      setBusy(false);
      setError(orderError.message);
      return;
    }

    if (payment === 'esewa' && proof) {
      const extension = proof.name.split('.').pop() || 'png';
      const path = user.id + '/' + order.id + '/' + Date.now() + '-payment-proof.' + extension;

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
      <main className="checkout-page">
        <div className="wide-shell">
          <div className="empty-bag">
            <h2>
              YOUR BAG
              <br />
              <em>IS EMPTY.</em>
            </h2>
            <Link href="/shop" className="dark-button">
              BACK TO SHOP
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="wide-shell">
        <div className="checkout-heading">
          <div>
            <span>CHECKOUT / {items.length} ITEMS</span>
            <h1>
              FINISH
              <br />
              <em>THE ORDER.</em>
            </h1>
          </div>
        </div>

        <div className="checkout-layout">
          <section>
            <div className="checkout-block">
              <div className="checkout-block-title">
                <span>01</span>
                <div>
                  <h2>DELIVERY</h2>
                  <p>Select a saved address.</p>
                </div>
              </div>

              {addresses.map((address) => (
                <button
                  type="button"
                  className={
                    addressId === address.id
                      ? 'address-selected'
                      : 'address-options-btn'
                  }
                  key={address.id}
                  onClick={() => setAddressId(address.id)}
                >
                  <strong>{address.full_name}</strong>
                  <span>{address.phone}</span>
                  <small>
                    {address.address_text}, {address.area}, {address.city}
                  </small>
                </button>
              ))}

              {!addresses.length && (
                <div className="checkout-empty">
                  No saved address. <Link href="/account">Add one to your account.</Link>
                </div>
              )}
            </div>

            <div className="checkout-block">
              <div className="checkout-block-title">
                <span>02</span>
                <div>
                  <h2>DELIVERY AREA</h2>
                  <p>Live store configuration.</p>
                </div>
              </div>

              <select
                className="checkout-select"
                value={zoneId}
                onChange={(event) => setZoneId(event.target.value)}
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} · {money(zone.delivery_fee)}
                  </option>
                ))}
              </select>
            </div>

            <div className="checkout-block">
              <div className="checkout-block-title">
                <span>03</span>
                <div>
                  <h2>PAYMENT</h2>
                  <p>Choose a method.</p>
                </div>
              </div>

              <div className="payment-choice">
                <button
                  type="button"
                  className={payment === 'cod' ? 'selected' : ''}
                  onClick={() => setPayment('cod')}
                >
                  <strong>CASH ON DELIVERY</strong>
                  <span>Pay when the order arrives.</span>
                </button>
                <button
                  type="button"
                  className={payment === 'esewa' ? 'selected' : ''}
                  onClick={() => setPayment('esewa')}
                >
                  <strong>ESEWA</strong>
                  <span>Reference + proof required.</span>
                </button>
              </div>

              {payment === 'esewa' && (
                <div className="esewa-proof">
                  <input
                    className="checkout-input"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Transaction / reference number"
                  />
                  <label>
                    <span>{proof?.name || 'UPLOAD PAYMENT SCREENSHOT'}</span>
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

            <div className="checkout-block">
              <div className="checkout-block-title">
                <span>04</span>
                <div>
                  <h2>PROMOTION</h2>
                  <p>Codes are verified server-side.</p>
                </div>
              </div>

              <input
                className="checkout-input"
                value={coupon}
                onChange={(event) => setCoupon(event.target.value.toUpperCase())}
                placeholder="COUPON CODE"
              />
            </div>
          </section>

          <aside className="checkout-summary">
            <span>ORDER SUMMARY</span>

            {items.map((item) => (
              <div
                className="checkout-item"
                key={item.product.id + '-' + item.size}
              >
                <img
                  src={item.product.images?.[0]?.url || ''}
                  alt={item.product.name || 'Product'}
                />
                <div>
                  <strong>{item.product.name}</strong>
                  <span>
                    SIZE {item.size} · QTY {item.quantity}
                  </span>
                </div>
                <b>{money(Number(item.product.price) * item.quantity)}</b>
              </div>
            ))}

            <hr />

            <div className="sum-total">
              <span>TOTAL</span>
              <strong>{money(subtotal)}</strong>
            </div>

            {error && <div className="checkout-error">{error}</div>}

            <button
              type="button"
              className="place-order"
              disabled={busy}
              onClick={placeOrder}
            >
              {busy ? 'CREATING ORDER…' : 'PLACE ORDER'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
