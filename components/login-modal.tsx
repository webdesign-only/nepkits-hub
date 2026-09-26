'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';

export default function LoginModal({open,onClose}:{open:boolean;onClose:()=>void}){
  const [mode,setMode]=useState<'signin'|'signup'>('signin');
  useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[open,onClose]);
  if(!open)return null;
  return <div className="login-overlay" onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}>
    <section className="login-card">
      <button className="login-close" onClick={onClose}>×</button>
      <div className="login-brand"><span>N</span><div><b>NEPKITS</b><small>HUB / FOOTBALL NEPAL</small></div></div>
      <p className="login-kicker">{mode==='signin'?'WELCOME BACK':'JOIN THE MATCHDAY'}</p>
      <h2>{mode==='signin'?'Sign in to NEPKITS':'Create your NEPKITS account'}</h2>
      <p className="login-sub">Save your details, track orders and make checkout faster.</p>
      <form onSubmit={e=>e.preventDefault()}>
        <label>Email address<input type="email" placeholder="you@example.com" required /></label>
        <label>Password<input type="password" placeholder="••••••••" required /></label>
        <button className="login-submit" type="submit">{mode==='signin'?'SIGN IN':'CREATE ACCOUNT'} →</button>
      </form>
      <div className="login-switch">{mode==='signin'?<>New to NEPKITS? <button onClick={()=>setMode('signup')}>Create account</button></>:<>Already registered? <button onClick={()=>setMode('signin')}>Sign in</button>}</div>
      <Link href="/shop" onClick={onClose} className="login-shop">Continue shopping →</Link>
    </section>
  </div>;
}