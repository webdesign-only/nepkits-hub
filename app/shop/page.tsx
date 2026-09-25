'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';

const money=(n:number|string)=>new Intl.NumberFormat('en-NP',{style:'currency',currency:'NPR',maximumFractionDigits:0}).format(Number(n));
const imageFor=(p:any)=>p?.images?.find((x:any)=>x.is_primary)?.url??p?.images?.[0]?.url??'';
function addCart(product:any,size:string){try{const c=JSON.parse(localStorage.getItem('nepkits-cart')||'[]');const i=c.findIndex((x:any)=>x.product.id===product.id&&x.size===size);if(i<0)c.push({product,size,quantity:1});else c[i].quantity=Number(c[i].quantity||0)+1;localStorage.setItem('nepkits-cart',JSON.stringify(c));window.dispatchEvent(new Event('nepkits:cart'));return true}catch{return false}}

function ProductCard({p}:{p:any}){return <article className='market-card'>
 <Link href={'/products/'+p.slug} className='market-card-image'><img src={imageFor(p)} alt={p.name}/>{Number(p.discount_percent)>0&&<span className='discount-tag'>{Math.round(Number(p.discount_percent))}% OFF</span>}{p.new_arrival&&<span className='new-tag'>NEW</span>}<span className='heart-tag'>♡</span></Link>
 <div className='market-card-body'><div className='market-team'>{p.team||'NEPKITS'} <span>• {p.season||'2026'}</span></div><Link href={'/products/'+p.slug} className='market-name'>{p.name}</Link><div className='market-rating'><b>★ {Number(p.rating||0).toFixed(1)}</b><span>|</span><span>{Number(p.review_count||0)} ratings</span><span>|</span><span>{Number(p.sold_count||0)} sold</span></div><div className='market-price-row'><strong>{money(p.price)}</strong>{p.original_price&&<del>{money(p.original_price)}</del>}<span>{Number(p.discount_percent)>0?Math.round(Number(p.discount_percent))+'% OFF':'Good price'}</span></div><div className='market-delivery'>🚚 COD available • Nepal</div><button className='market-add' onClick={(e)=>{e.preventDefault();const size=p.sizes?.find((s:any)=>Number(s.stock_qty)>0)?.size;if(size){addCart(p,size);e.currentTarget.textContent='ADDED ✓';setTimeout(()=>{if(e.currentTarget)e.currentTarget.textContent='ADD TO CART'},900)}}}>ADD TO CART</button></div>
 </article>}

export default function Shop(){
 const [products,setProducts]=useState<any[]>([]);const [cats,setCats]=useState<any[]>([]);const [q,setQ]=useState('');const [cat,setCat]=useState('');const [sort,setSort]=useState('featured');const [collection,setCollection]=useState('');const [error,setError]=useState('');
 useEffect(()=>{const params=new URLSearchParams(window.location.search);setQ(params.get('q')||'');setCat(params.get('category')||'');setCollection(params.get('collection')||'');(async()=>{try{const r=await fetch('/api/catalog',{cache:'no-store'});const j=await r.json();if(!r.ok)throw new Error(j.error||'Catalog unavailable');setProducts(j.products||[]);setCats(j.categories||[])}catch(e:any){setError(e?.message||'Catalog unavailable')}})()},[]);
 const list=useMemo(()=>{let x=[...products].filter(p=>(!q||[p.name,p.team,p.player,p.season,p.league].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase()))&&(!cat||p.category_id===cat));if(collection==='new')x=x.filter(p=>p.new_arrival);if(collection==='sale')x=x.filter(p=>Number(p.discount_percent)>0);if(collection==='best')x.sort((a,b)=>Number(b.sold_count||0)-Number(a.sold_count||0));if(sort==='newest')x.sort((a,b)=>+new Date(b.created_at)-+new Date(a.created_at));if(sort==='popular')x.sort((a,b)=>Number(b.sold_count||0)-Number(a.sold_count||0));if(sort==='low')x.sort((a,b)=>Number(a.price)-Number(b.price));if(sort==='high')x.sort((a,b)=>Number(b.price)-Number(a.price));return x},[products,q,cat,collection,sort]);
 return <main className='market-shop'><div className='market-shell'>
   <div className='shop-breadcrumb'>HOME › SHOP {cat?'› FILTERED':''}{collection?' › '+collection.toUpperCase():''}</div>
   <div className='shop-heading'><div><span>NEPKITS HUB MARKETPLACE</span><h1>{collection==='best'?'BEST SELLERS':collection==='sale'?'FLASH DEALS':cat?'JERSEY COLLECTION':'FOOTBALL JERSEYS & SPORTSWEAR'}</h1></div><p>{list.length} products</p></div>
   <div className='shop-layout'>
    <aside className='market-filter'>
      <div className='filter-head'>FILTER BY</div>
      <div className='filter-group'><h4>CATEGORIES</h4><button className={!cat?'active':''} onClick={()=>setCat('')}>All Products</button>{cats.map(c=><button key={c.id} className={cat===c.id?'active':''} onClick={()=>{setCat(c.id);setCollection('')}}>{c.name}</button>)}</div>
      <div className='filter-group'><h4>COLLECTIONS</h4><button onClick={()=>setCollection('new')} className={collection==='new'?'active':''}>New Arrivals</button><button onClick={()=>setCollection('best')} className={collection==='best'?'active':''}>Best Sellers</button><button onClick={()=>setCollection('sale')} className={collection==='sale'?'active':''}>Flash Deals</button></div>
      <div className='filter-group'><h4>POPULAR CLUBS</h4>{['FC Barcelona','Tottenham Hotspur','Inter Milan'].map(t=><button key={t} onClick={()=>setQ(t)}>{t}</button>)}</div>
    </aside>
    <section className='shop-results'>
      <div className='shop-toolbar'><div><b>{list.length}</b> RESULTS <span>• LIVE CATALOG</span></div><div className='shop-controls'><label>SORT BY<select value={sort} onChange={e=>setSort(e.target.value)}><option value='featured'>Featured</option><option value='newest'>Newest</option><option value='popular'>Popular</option><option value='low'>Price low</option><option value='high'>Price high</option></select></label></div></div>
      {error?<div className='shop-empty'><h2>Catalog connection issue</h2><p>{error}</p></div>:list.length?<div className='market-grid four'>{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<div className='shop-empty'><h2>NO PRODUCTS FOUND</h2><p>Try another club, country, or collection.</p><Link href='/shop'>RESET FILTERS →</Link></div>}
    </section>
   </div>
 </div></main>
}