'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';

const money=(n:number|string)=>new Intl.NumberFormat('en-NP',{style:'currency',currency:'NPR',maximumFractionDigits:0}).format(Number(n));
const img=(p:any)=>p?.images?.find((x:any)=>x.is_primary)?.url??p?.images?.[0]?.url??'';

export default function Cart(){
 const [items,setItems]=useState<any[]>([]);
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{try{const s=localStorage.getItem('nepkits-cart');setItems(s?JSON.parse(s):[])}catch{setItems([])}finally{setHydrated(true)}},[]);
 useEffect(()=>{if(!hydrated)return;localStorage.setItem('nepkits-cart',JSON.stringify(items));window.dispatchEvent(new Event('nepkits:cart'))},[items,hydrated]);
 const sub=useMemo(()=>items.reduce((s,i)=>s+Number(i.product?.price||0)*Number(i.quantity||0),0),[items]);
 const totalUnits=useMemo(()=>items.reduce((s,i)=>s+Number(i.quantity||0),0),[items]);
 function update(index:number,next:number){setItems(c=>c.map((x,i)=>i===index?{...x,quantity:Math.max(1,next)}:x))}
 function remove(index:number){setItems(c=>c.filter((_,i)=>i!==index))}
 function clearCart(){setItems([])}

 if(!hydrated)return <main className='market-cart-page'><div className='market-shell cart-loading'><span>YOUR CART</span><h1>LOADING…</h1></div></main>;

 return <main className='market-cart-page'>
  <div className='market-shell'>
   <div className='cart-breadcrumb'>HOME › SHOPPING CART</div>
   <div className='cart-title-row'><div><span>NEPKITS HUB MARKETPLACE</span><h1>SHOPPING CART</h1></div>{items.length>0&&<button className='cart-clear' onClick={clearCart}>CLEAR CART</button>}</div>

   {items.length===0 ? <section className='cart-empty-market'>
     <div className='cart-empty-icon'>🛒</div><span>YOUR CART IS EMPTY</span><h2>FIND YOUR<br/><em>NEXT SHIRT.</em></h2>
     <p>Browse famous club jerseys, World Cup fanwear and football essentials.</p>
     <Link href='/shop' className='cart-primary-btn'>START SHOPPING →</Link>
   </section> :
   <div className='cart-market-layout'>
    <section>
      <div className='cart-selection-bar'><strong>{totalUnits} ITEM{totalUnits!==1?'S':''}</strong><span>•</span><span>SECURE CHECKOUT</span><span>•</span><span>COD AVAILABLE</span></div>
      <div className='cart-item-list'>
       {items.map((i,index)=><article className='cart-market-item' key={i.product?.id+i.size}>
        <Link href={'/products/'+i.product?.slug} className='cart-item-image'><img src={img(i.product)} alt={i.product?.name}/></Link>
        <div className='cart-market-info'>
          <div className='cart-market-brand'>{i.product?.team||'NEPKITS'} <span>• {i.product?.season||'2026'}</span></div>
          <Link href={'/products/'+i.product?.slug} className='cart-market-name'>{i.product?.name}</Link>
          <div className='cart-market-meta'><span>SIZE {i.size}</span><span>•</span><span>IN STOCK</span></div>
          <div className='cart-market-actions'><div className='cart-qty'><button onClick={()=>update(index,i.quantity-1)}>-</button><b>{i.quantity}</b><button onClick={()=>update(index,i.quantity+1)}>+</button></div><button onClick={()=>remove(index)}>REMOVE</button><Link href={'/products/'+i.product?.slug}>VIEW PRODUCT</Link></div>
        </div>
        <div className='cart-market-price'><strong>{money(Number(i.product?.price||0)*Number(i.quantity||0))}</strong>{i.product?.original_price&&<del>{money(Number(i.product.original_price)*Number(i.quantity||0))}</del>}<span>UNIT {money(i.product?.price||0)}</span></div>
       </article>)}
      </div>
      <div className='cart-delivery-banner'><div><b>🚚</b><strong>DELIVERY ACROSS NEPAL</strong><span>Delivery fee is calculated from your selected zone at checkout.</span></div><Link href='/shop'>CONTINUE SHOPPING →</Link></div>
    </section>
    <aside className='cart-market-summary'>
      <div className='summary-label'>ORDER SUMMARY</div>
      <div className='summary-row'><span>Items ({totalUnits})</span><strong>{money(sub)}</strong></div>
      <div className='summary-row'><span>Delivery</span><span className='summary-muted'>Calculated at checkout</span></div>
      <div className='summary-divider'/>
      <div className='summary-total'><span>ESTIMATED TOTAL</span><strong>{money(sub)}</strong></div>
      <Link href='/checkout' className='cart-checkout-btn'>PROCEED TO CHECKOUT →</Link>
      <div className='cart-trust'><span>✓ Secure checkout</span><span>✓ COD available</span><span>✓ eSewa where configured</span></div>
    </aside>
   </div>}
  </div>
 </main>
}