'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';

const money=(n:number|string)=>new Intl.NumberFormat('en-NP',{style:'currency',currency:'NPR',maximumFractionDigits:0}).format(Number(n));
const img=(p:any)=>p?.images?.find((x:any)=>x.is_primary)?.url??p?.images?.[0]?.url??'';

export default function CartDrawer(){
 const [open,setOpen]=useState(false);
 const [items,setItems]=useState<any[]>([]);
 const [ready,setReady]=useState(false);

 const read=()=>{
  try{setItems(JSON.parse(localStorage.getItem('nepkits-cart')||'[]'))}catch{setItems([])}
  setReady(true);
 };

 useEffect(()=>{
  read();
  const onOpen=()=>{read();setOpen(true)};
  const onCart=()=>read();
  window.addEventListener('nepkits:open-cart',onOpen);
  window.addEventListener('nepkits:cart',onCart);
  window.addEventListener('storage',onCart);
  return()=>{window.removeEventListener('nepkits:open-cart',onOpen);window.removeEventListener('nepkits:cart',onCart);window.removeEventListener('storage',onCart)};
 },[]);

 useEffect(()=>{
  if(!open)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
  window.addEventListener('keydown',onKey);
  document.body.style.overflow='hidden';
  return()=>{window.removeEventListener('keydown',onKey);document.body.style.overflow=''};
 },[open]);

 const subtotal=useMemo(()=>items.reduce((s,i)=>s+Number(i.product?.price||0)*Number(i.quantity||0),0),[items]);
 const totalUnits=useMemo(()=>items.reduce((s,i)=>s+Number(i.quantity||0),0),[items]);

 function save(next:any[]){
  setItems(next);
  localStorage.setItem('nepkits-cart',JSON.stringify(next));
  window.dispatchEvent(new Event('nepkits:cart'));
 }
 function update(index:number,qty:number){
  save(items.map((x,i)=>i===index?{...x,quantity:Math.max(1,qty)}:x));
 }
 function remove(index:number){save(items.filter((_,i)=>i!==index))}
 function clear(){save([])}

 if(!ready||!open)return null;

 return <div className='cart-drawer-layer'>
  <button className='cart-drawer-backdrop' aria-label='Close cart' onClick={()=>setOpen(false)}/>
  <aside className='cart-drawer' aria-label='Shopping cart'>
   <div className='cart-drawer-head'>
    <div><span>NEPKITS HUB</span><h2>YOUR BAG <em>({totalUnits})</em></h2></div>
    <button className='cart-drawer-close' onClick={()=>setOpen(false)} aria-label='Close'>×</button>
   </div>

   {items.length===0 ? <div className='cart-drawer-empty'>
     <div className='cart-drawer-empty-icon'>🛒</div>
     <strong>YOUR BAG IS EMPTY</strong>
     <p>Add a jersey and it will appear here instantly.</p>
     <Link href='/shop' className='cart-drawer-shop' onClick={()=>setOpen(false)}>SHOP JERSEYS →</Link>
   </div> : <>
     <div className='cart-drawer-items'>
      {items.map((i,index)=><article className='cart-drawer-item' key={i.product?.id+i.size}>
       <Link href={'/products/'+i.product?.slug} onClick={()=>setOpen(false)} className='cart-drawer-thumb'><img src={img(i.product)} alt={i.product?.name}/></Link>
       <div className='cart-drawer-info'>
        <div className='cart-drawer-team'>{i.product?.team||'NEPKITS'} <span>• {i.size}</span></div>
        <Link href={'/products/'+i.product?.slug} onClick={()=>setOpen(false)} className='cart-drawer-name'>{i.product?.name}</Link>
        <div className='cart-drawer-row'><strong>{money(i.product?.price||0)}</strong><button onClick={()=>remove(index)}>REMOVE</button></div>
        <div className='cart-drawer-qty'><button onClick={()=>update(index,i.quantity-1)}>-</button><b>{i.quantity}</b><button onClick={()=>update(index,i.quantity+1)}>+</button></div>
       </div>
      </article>)}
     </div>
     <div className='cart-drawer-foot'>
      <div className='cart-drawer-delivery'><span>✓ CASH ON DELIVERY</span><span>✓ NEPAL DELIVERY</span></div>
      <div className='cart-drawer-summary'><span>SUBTOTAL</span><strong>{money(subtotal)}</strong></div>
      <Link href='/checkout' className='cart-drawer-checkout' onClick={()=>setOpen(false)}>GO TO CHECKOUT <span>→</span></Link>
      <div className='cart-drawer-actions'><button onClick={clear}>CLEAR BAG</button><Link href='/shop' onClick={()=>setOpen(false)}>CONTINUE SHOPPING</Link></div>
     </div>
   </>}
  </aside>
 </div>
}