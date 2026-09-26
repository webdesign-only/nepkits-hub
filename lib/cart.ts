import type{CartItem,Product}from'./types';
const KEY='nepkits-v2-cart';
export const readCart=():CartItem[]=>{if(typeof window==='undefined')return[];try{const v=JSON.parse(localStorage.getItem(KEY)??'[]');return Array.isArray(v)?v:[]}catch{return[]}};
const writeCart=(items:CartItem[])=>{localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event('nepkits:cart'))};
export const addToCart=(product:Product,size:string,quantity=1)=>{const items=readCart();const i=items.findIndex(x=>x.product.id===product.id&&x.size===size);if(i<0)items.push({product,size,quantity});else items[i]={...items[i],quantity:items[i].quantity+quantity};writeCart(items)};
export const updateQuantity=(i:number,q:number)=>{const items=readCart();if(!items[i])return;items[i]={...items[i],quantity:Math.max(1,q)};writeCart(items)};
export const removeItem=(i:number)=>writeCart(readCart().filter((_,n)=>n!==i));export const clearCart=()=>writeCart([]);export const subtotal=(items:CartItem[])=>items.reduce((s,x)=>s+x.product.price*x.quantity,0);export const formatNpr=(v:number)=>'NPR '+v.toLocaleString('en-NP');
