'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import AccountLogout from '../../components/account-logout';
import { money } from '../../lib/store-utils';
import { supabase } from '../../lib/supabase-browser';

type Address = {
  id?: string;
  full_name: string;
  phone: string;
  address_text: string;
  area: string;
  city: string;
};

type AccountOrder = {
  id: string;
  order_number: string;
  created_at: string;
  order_status: string;
  total: number | string;
};

const emptyAddress: Address = {
  full_name: '',
  phone: '',
  address_text: '',
  area: '',
  city: 'Pokhara',
};

export default function AccountPageClient() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>(emptyAddress);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      const { data: auth } = await supabase.auth.getUser();

      if (cancelled) return;
      setUser(auth.user ?? null);

      if (!auth.user) return;

      const [profileResult, orderResult, addressResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', auth.user.id)
          .maybeSingle(),
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('addresses')
          .select('*')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;

      const nextAddresses = (addressResult.data ?? []) as Address[];

      setProfile(profileResult.data);
      setOrders((orderResult.data ?? []) as AccountOrder[]);
      setAddresses(nextAddresses);

      if (nextAddresses[0]) {
        setForm({
          full_name: nextAddresses[0].full_name,
          phone: nextAddresses[0].phone,
          address_text: nextAddresses[0].address_text,
          area: nextAddresses[0].area,
          city: nextAddresses[0].city,
        });
      }
    }

    loadAccount();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setMessage('');

    const { error } = await supabase.from('addresses').insert({
      ...form,
      user_id: user.id,
      is_default: addresses.length === 0,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Address saved.');

    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setAddresses((data ?? []) as Address[]);
  }

  function updateField(field: keyof Address, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (!user) {
    return (
      <main className="account-page">
        <div className="wide-shell center-empty">
          <h1>
            SIGN IN TO
            <br />
            <em>YOUR HUB.</em>
          </h1>
          <Link href="/login" className="dark-button">
            SIGN IN
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="wide-shell">
        <div className="account-header">
          <span>ACCOUNT / MEMBER</span>
          <h1>
            YOUR
            <br />
            <em>DASHBOARD.</em>
          </h1>
        </div>

        <div className="account-layout">
          <aside className="account-nav">
            <div className="account-avatar">
              {(profile?.full_name || user.email || 'N').slice(0, 1).toUpperCase()}
            </div>

            <strong>{profile?.full_name || 'NEPKITS member'}</strong>
            <small>{user.email}</small>

            <Link className="active" href="/account">Overview</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/support">Support</Link>

            <AccountLogout />
          </aside>

          <section className="account-content">
            <div className="account-stat-grid">
              <div>
                <span>ORDERS</span>
                <b>{orders.length}</b>
              </div>
              <div>
                <span>MEMBER SINCE</span>
                <b>{new Date(user.created_at).getFullYear()}</b>
              </div>
              <div>
                <span>ADDRESSES</span>
                <b>{addresses.length}</b>
              </div>
            </div>

            <div className="account-card">
              <div className="account-card-head">
                <div>
                  <span>DELIVERY</span>
                  <h2>SAVED ADDRESS</h2>
                </div>
              </div>

              <form className="account-form" onSubmit={saveAddress}>
                <input
                  value={form.full_name}
                  onChange={(event) => updateField('full_name', event.target.value)}
                  placeholder="Full name"
                  required
                />
                <input
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  placeholder="Phone"
                  required
                />
                <input
                  className="wide"
                  value={form.address_text}
                  onChange={(event) =>
                    updateField('address_text', event.target.value)
                  }
                  placeholder="Address"
                  required
                />
                <input
                  value={form.area}
                  onChange={(event) => updateField('area', event.target.value)}
                  placeholder="Area"
                  required
                />
                <input
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  placeholder="City"
                  required
                />
                <button type="submit" className="dark-button">
                  SAVE ADDRESS
                </button>
              </form>

              {message && <p className="form-message">{message}</p>}
            </div>

            <div className="account-card">
              <div className="account-card-head">
                <div>
                  <span>RECENT</span>
                  <h2>ORDERS</h2>
                </div>
                <Link href="/orders">VIEW ALL ↗</Link>
              </div>

              {orders.slice(0, 5).map((order) => (
                <Link
                  className="account-order-row"
                  href={'/orders/' + order.id}
                  key={order.id}
                >
                  <div>
                    <strong>{order.order_number}</strong>
                    <small>
                      {new Date(order.created_at).toLocaleDateString()} ·{' '}
                      {order.order_status}
                    </small>
                  </div>
                  <b>{money(order.total)}</b>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
