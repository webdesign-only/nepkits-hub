'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';

const money=(n:number|string)=>new Intl.NumberFormat('en-NP',{style:'currency',currency:'NPR',maximumFractionDigits:0}).format(Number(n));
const imageFor=(p:any)=>p?.images?.find((x:any)=>x.is_primary)?.url??p?.images?.[0]?.url??'';

function addCart(product:any,size:string){const c=JSON.parse(localStorage.getItem('nepkits-cart')||'[]');const i=c.findIndex((x:any)=>x.product.id===product.id&&x.size===size);if(i<0)c.push({product,size,quantity:1});else c[i].quantity++;localStorage.setItem('nepkits-cart',JSON.stringify(c));}

function ProductCard({p}:{p:any}){
  return <article className='market-card'>
    <Link href={'/products/'+p.slug} className='market-card-image'>
      <img src={imageFor(p)} alt={p.name}/>
      {Number(p.discount_percent)>0&&<span className='discount-tag'>{Math.round(Number(p.discount_percent))}% OFF</span>}
      {p.new_arrival&&<span className='new-tag'>NEW</span>}
      <span className='heart-tag'>♡</span>
    </Link>
    <div className='market-card-body'>
      <div className='market-team'>{p.team||'NEPKITS'} <span>• {p.season||'2026'}</span></div>
      <Link href={'/products/'+p.slug} className='market-name'>{p.name}</Link>
      <div className='market-rating'><b>★ {Number(p.rating||0).toFixed(1)}</b><span>|</span><span>{Number(p.review_count||0)} ratings</span><span>|</span><span>{Number(p.sold_count||0)} sold</span></div>
      <div className='market-price-row'><strong>{money(p.price)}</strong>{p.original_price&&<del>{money(p.original_price)}</del>}<span>{Number(p.discount_percent)>0?Math.round(Number(p.discount_percent))+'%':'Best price'}</span></div>
      <div className='market-delivery'>🚚 Cash on Delivery • Nepal</div>
      <button className='market-add' onClick={()=>addCart(p,p.sizes?.find((s:any)=>Number(s.stock_qty)>0)?.size||'M')}>ADD TO CART</button>
    </div>
  </article>
}

export default function Home(){
 const [products,setProducts]=useState<any[]>([]);
 const [categories,setCategories]=useState<any[]>([]);
 useEffect(()=>{fetch('/api/catalog',{cache:'no-store'}).then(r=>r.json()).then(j=>{setProducts(j.products||[]);setCategories(j.categories||[])}).catch(()=>{})},[]);
 const newest=products.filter(p=>p.new_arrival);
 const best=useMemo(()=>[...products].sort((a,b)=>Number(b.sold_count||0)-Number(a.sold_count||0)),[products]);
 const clubs=products.filter(p=>['FC Barcelona','Tottenham Hotspur','Inter Milan'].includes(p.team));
 const worldCup=products.filter(p=>['Brazil','France','USA'].includes(p.team));
 const hero=clubs[0]||products.find(p=>p.team==='Brazil')||products[0];
 const categoryProducts=categories.map(c=>({...c,product:products.find(p=>p.category_id===c.id)})).filter(x=>x.product);

 return <main className='market-home'>
   <div className='market-shell home-main-grid'>
     <aside className='home-category-panel'>
       <div className='panel-title'>TOP CATEGORIES</div>
       {categoryProducts.slice(0,8).map(c=><Link key={c.id} href={'/shop?category='+c.id}><span>{c.name}</span><b>›</b></Link>)}
       <Link className='see-all' href='/shop'>VIEW ALL CATEGORIES →</Link>
     </aside>
     <section className='market-hero'>
       <img src={imageFor(hero)} alt={hero?.name||'NEPKITS football collection'}/>
       <div className='market-hero-overlay'/>
       <div className='market-hero-copy'>
         <span>FAN REPLICA COLLECTION • 2026</span>
         <h1>WORLD'S BIGGEST<br/><em>FOOTBALL SHIRTS.</em></h1>
         <p>Famous club jerseys + 2026 World Cup fanwear, built into the NEPKITS marketplace.</p>
         <Link href='/shop' className='market-hero-btn'>SHOP NOW</Link>
       </div>
     </section>
     <aside className='hero-deal-stack'>
       <div><span>FLASH SALE</span><strong>UP TO 30% OFF</strong><Link href='/shop?collection=sale'>SHOP DEALS →</Link></div>
       <div><span>COD</span><strong>DELIVERY ACROSS NEPAL</strong><small>Pay on delivery where available.</small></div>
       <div><span>NEW</span><strong>WORLD CUP 2026</strong><Link href='/shop?category=3fe4a585-eca3-4c88-b73d-cadb5cbf608c'>EXPLORE →</Link></div>
     </aside>
   </div>

   <div className='market-shell service-strip'><div><b>🚚</b><span><strong>Fast delivery</strong><small>Across Nepal</small></span></div><div><b>↺</b><span><strong>Easy returns</strong><small>Store policy applies</small></span></div><div><b>✓</b><span><strong>Secure payments</strong><small>COD + eSewa flow</small></span></div><div><b>★</b><span><strong>Fan favourites</strong><small>Best-selling jerseys</small></span></div></div>

   <section className='market-section'>
     <div className='market-shell'>
       <div className='market-section-head'><div><span>SHOP BY COLLECTION</span><h2>FAMOUS CLUBS</h2></div><Link href='/shop?category=a201ec0c-b146-46c7-91fb-ca7c803e5330'>SEE ALL →</Link></div>
       <div className='club-strip'>{clubs.map(p=><Link href={'/products/'+p.slug} key={p.id}><img src={imageFor(p)} alt={p.team}/><div><b>{p.team}</b><span>SHOP JERSEY →</span></div></Link>)}</div>
     </div>
   </section>

   <section className='market-section gray'>
     <div className='market-shell'>
       <div className='market-section-head'><div><span>LIMITED-TIME OFFERS</span><h2>FLASH SALE</h2></div><div className='sale-timer'><b>00</b><i>:</i><b>32</b><i>:</i><b>47</b></div><Link href='/shop?collection=sale'>VIEW ALL →</Link></div>
       <div className='market-grid five'>{(newest.length?newest:products).slice(0,5).map(p=><ProductCard key={p.id} p={p}/>)}</div>
     </div>
   </section>

   <section className='market-section'>
     <div className='market-shell'>
       <div className='market-section-head'><div><span>FIFA WORLD CUP 2026</span><h2>WORLD CUP JERSEYS</h2></div><Link href='/shop?category=3fe4a585-eca3-4c88-b73d-cadb5cbf608c'>SHOP ALL →</Link></div>
       <div className='market-grid three-feature'>{worldCup.map(p=><ProductCard key={p.id} p={p}/>)}</div>
     </div>
   </section>

   <section className='market-section gray'>
     <div className='market-shell'>
       <div className='market-section-head'><div><span>HOT RIGHT NOW</span><h2>BEST SELLERS</h2></div><Link href='/shop?collection=best'>VIEW ALL →</Link></div>
       <div className='market-grid five'>{best.slice(0,10).map(p=><ProductCard key={p.id} p={p}/>)}</div>
     </div>
   </section>

   <section className='market-cta'><div className='market-shell'><div><span>NEPKITS HUB</span><h2>ONE MARKETPLACE.<br/><em>EVERY SHIRT.</em></h2><p>Club football, national teams, retro drops, training wear and matchday accessories.</p></div><Link href='/shop' className='market-cta-btn'>START SHOPPING →</Link></div></section>
 </main>
}