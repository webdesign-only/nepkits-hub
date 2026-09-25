'use client';
import {useEffect,useState} from 'react';
export default function CartBadge(){
 const [count,setCount]=useState(0);
 const read=()=>{try{const items=JSON.parse(localStorage.getItem('nepkits-cart')||'[]');setCount(items.reduce((n:any,i:any)=>n+Number(i.quantity||0),0))}catch{setCount(0)}};
 useEffect(()=>{read();const onUpdate=()=>read();window.addEventListener('storage',onUpdate);window.addEventListener('nepkits:cart',onUpdate);return()=>{window.removeEventListener('storage',onUpdate);window.removeEventListener('nepkits:cart',onUpdate)}},[]);
 return <span className='market-cart-count' aria-label={count+' items in cart'}>{count}</span>;
}