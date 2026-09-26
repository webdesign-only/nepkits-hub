'use client';
import Link from 'next/link';
import {useState} from 'react';

export default function LoginPage(){
  const [mode,setMode]=useState<'signin'|'signup'>('signin');
  return <main className="login-page">
    <section className="login-page-card">
      <div className="login-visual"><span>N</span><div><b>NEPKITS</b><small>HUB / FOOTBALL NEPAL</small></div><p>Matchday gear, club shirts and World Cup fanwear — all in one place.</p></div>
      <div className="login-form-panel">
        <Link href="/shop" className="login-back">← Back to shop</Link>
        <span className="login-kicker">{mode==='signin'?'WELCOME BACK':'JOIN THE MATCHDAY'}</span>
        <h1>{mode==='signin'?'Sign in':'Create account'}</h1>
        <p>Save your details, track orders and checkout faster.</p>
        <form onSubmit={e=>e.preventDefault()}>
          <label>Email address<input type="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" placeholder="••••••••" required /></label>
          <button className="login-submit" type="submit">{mode==='signin'?'SIGN IN':'CREATE ACCOUNT'} →</button>
        </form>
        <div className="login-toggle">{mode==='signin'?<>New to NEPKITS? <button onClick={()=>setMode('signup')}>Create an account</button></>:<>Already have an account? <button onClick={()=>setMode('signin')}>Sign in</button></>}</div>
      </div>
    </section>
  </main>
}
