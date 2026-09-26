'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {clearCart,formatNpr,readCart,removeItem,subtotal,updateQuantity} from '../lib/cart';
import type {CartItem} from '../lib/types';

export default function CartDrawer(){
  const [open,setOpen]=useState(false);
  const [items,setItems]=useState<CartItem[]>([]);
  useEffect(()=>{
    const sync=()=>setItems(readCart());
    const show=()=>setOpen(true);
    sync();
    window.addEventListener('nepkits:cart',sync);
    window.addEventListener('nepkits:open-cart',show);
    return()=>{window.removeEventListener('nepkits:cart',sync);window.removeEventListener('nepkits:open-cart',show)};
  },[]);
  const total=useMemo(()=>subtotal(items),[items]);
  return <>
    {open&&<button className="cart-backdrop" aria-label="Close cart" onClick={()=>setOpen(false)} />}
    <aside className={'cart-drawer '+(open?'open':'')}>
      <div className="cart-head"><div><span>NEPKITS BAG</span><h2>{items.reduce((n,x)=>n+x.quantity,0)} ITEMS</h2></div><button onClick={()=>setOpen(false)}>×</button></div>
      <div className="cart-list">
        {!items.length ? <div className="cart-empty"><b>YOUR BAG IS EMPTY.</b><p>Add a jersey and it will appear here instantly.</p><Link href="/shop" onClick={()=>setOpen(false)}>SHOP JERSEYS →</Link></div> :
        items.map((item,i)=><div className="cart-row" key={item.product.id+item.size}>
          <img src={item.product.image} alt="" />
          <div><small>{item.product.team}</small><strong>{item.product.name}</strong><span>SIZE {item.size}</span>
            <div className="cart-row-bottom"><div className="mini-qty"><button onClick={()=>updateQuantity(i,item.quantity-1)}>-</button><b>{item.quantity}</b><button onClick={()=>updateQuantity(i,item.quantity+1)}>+</button></div><strong>{formatNpr(item.product.price*item.quantity)}</strong></div>
            <button className="cart-remove" onClick={()=>removeItem(i)}>REMOVE</button>
          </div>
        </div>)}
      </div>
      {items.length>0&&<div className="cart-foot"><div><span>SUBTOTAL</span><strong>{formatNpr(total)}</strong></div><Link href="/checkout" className="cart-checkout" onClick={()=>setOpen(false)}>GO TO CHECKOUT →</Link><button className="cart-clear" onClick={clearCart}>Clear cart</button></div>}
    </aside>
  </>;
}