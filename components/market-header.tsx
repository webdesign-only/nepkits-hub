'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {readCart} from '../lib/cart';
import CartDrawer from './cart-drawer';
import LoginModal from './login-modal';

export default function MarketHeader(){
  const [count,setCount]=useState(0);
  const [login,setLogin]=useState(false);
  useEffect(()=>{
    const sync=()=>setCount(readCart().reduce((n,item)=>n+item.quantity,0));
    sync();
    window.addEventListener('nepkits:cart',sync);
    window.addEventListener('nepkits:login',()=>setLogin(true));
    return()=>window.removeEventListener('nepkits:cart',sync);
  },[]);
  return <>
    <header className="market-header">
      <div className="market-main">
        <div className="market-shell market-main-inner">
          <Link href="/" className="market-logo" aria-label="NEPKITS HUB home">
            <span className="market-logo-mark">N</span>
            <span className="market-logo-copy"><b>NEPKITS</b><small>HUB / FOOTBALL NEPAL</small></span>
          </Link>
          <form action="/shop" className="market-search">
            <input name="q" placeholder="Search NEPKITS jerseys, clubs & World Cup…" />
            <button>SEARCH</button>
          </form>
          <div className="market-actions">
            <button type="button" onClick={()=>setLogin(true)}><span>◯</span><b>Account</b></button>
            <Link href="/account"><span>↗</span><b>Orders</b></Link>
            <button type="button" onClick={()=>window.dispatchEvent(new Event('nepkits:open-cart'))}><span>🛒</span><b>Cart</b><em>{count}</em></button>
          </div>
        </div>
      </div>
      <nav className="market-nav">
        <div className="market-shell">
          <Link href="/shop">ALL KITS</Link>
          <Link href="/shop?category=clubs">CLUBS</Link>
          <Link href="/shop?category=world-cup">WORLD CUP 2026</Link>
          <Link href="/shop?category=retro">RETRO</Link>
          <Link href="/shop?category=fan-gear">FAN GEAR</Link>
          <Link href="/shop?collection=sale">DEALS</Link>
        </div>
      </nav>
    </header>
    <div className="mobile-market-header">
      <Link href="/" className="market-logo">
        <span className="market-logo-mark">N</span>
        <span className="market-logo-copy"><b>NEPKITS</b><small>HUB</small></span>
      </Link>
      <div><button onClick={()=>setLogin(true)}>ACCOUNT</button><button onClick={()=>window.dispatchEvent(new Event('nepkits:open-cart'))}>CART {count}</button></div>
      <form action="/shop" className="mobile-market-search"><input name="q" placeholder="Search NEPKITS…" /><button>→</button></form>
    </div>
    <CartDrawer />
    <LoginModal open={login} onClose={()=>setLogin(false)} />
  </>;
}