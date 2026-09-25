'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {createClient} from '@supabase/supabase-js';
import NepkitsBrand from '../../components/nepkits-brand';

const supabase=createClient('https://iyfyghzqlcwzyjuqxjlu.supabase.co','sb_publishable_1JP2P6NgeRAf5ADPjJH78g_KkVa5MzE');

export default function LoginPage(){
 const router=useRouter();
 const [signup,setSignup]=useState(false);
 const [showPassword,setShowPassword]=useState(false);
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');

 async function submit(){
  setMessage('');
  if(!email.trim()||!password){setMessage('Enter your email and password.');return}
  if(signup&&!name.trim()){setMessage('Enter your full name.');return}
  setBusy(true);
  const result=signup
   ? await supabase.auth.signUp({email,password,options:{data:{full_name:name}}})
   : await supabase.auth.signInWithPassword({email,password});
  setBusy(false);
  if(result.error){setMessage(result.error.message);return}
  router.push(new URLSearchParams(window.location.search).get('next')||'/account');
 }

 return <main className='modern-auth'>
  <section className='auth-hero-panel'>
   <img className='auth-hero-image' src='https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1800&q=90' alt='' />
   <div className='auth-hero-shade'/>
   <div className='auth-hero-top'><span>NEPKITS HUB</span><span>FOOTBALL MARKETPLACE / 2026</span></div>
   <div className='auth-hero-copy'>
    <span className='auth-hero-kicker'>YOUR MATCHDAY ACCOUNT</span>
    <h1>{signup?<>JOIN THE<br/><em>HUB.</em></>:<>WELCOME<br/><em>BACK.</em></>}</h1>
    <p>{signup?'Create one account for club jerseys, World Cup fanwear, saved carts and order tracking.':'Pick up where you left off. Your orders, profile and football collection are all in one place.'}</p>
   </div>
   <div className='auth-hero-bottom'><span>CLUBS</span><span>WORLD CUP</span><span>KITS</span><span>FAN GEAR</span></div>
  </section>

  <section className='modern-auth-panel'>
   <div className='auth-panel-top'>
    <Link href='/' className='auth-brand' aria-label='NEPKITS HUB home'><NepkitsBrand variant='compact'/></Link>
    <Link href='/shop' className='auth-shop-link'>CONTINUE SHOPPING →</Link>
   </div>

   <div className='auth-form-wrap'>
    <div className='auth-mode'><button className={!signup?'active':''} onClick={()=>{setSignup(false);setMessage('')}}>SIGN IN</button><button className={signup?'active':''} onClick={()=>{setSignup(true);setMessage('')}}>CREATE ACCOUNT</button></div>
    <span className='auth-form-kicker'>{signup?'NEW CUSTOMER':'WELCOME BACK'}</span>
    <h2>{signup?'Create your account':'Sign in to NEPKITS HUB'}</h2>
    <p className='auth-form-sub'>{signup?'Save your favourites, check out faster and track every order.':'Access your orders, saved details and football favourites.'}</p>

    {signup&&<label className='modern-field'><span>FULL NAME</span><input autoComplete='name' value={name} onChange={e=>setName(e.target.value)} placeholder='Your full name'/></label>}
    <label className='modern-field'><span>EMAIL ADDRESS</span><input type='email' autoComplete='email' value={email} onChange={e=>setEmail(e.target.value)} placeholder='you@example.com'/></label>
    <label className='modern-field'><span>PASSWORD</span><div className='password-wrap'><input type={showPassword?'text':'password'} autoComplete={signup?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder='Enter your password'/><button type='button' onClick={()=>setShowPassword(!showPassword)}>{showPassword?'HIDE':'SHOW'}</button></div></label>

    {!signup&&<div className='auth-helper-row'><span>Secure member access</span><button type='button' onClick={()=>setMessage('Password reset is available through your Supabase email flow.')}>FORGOT PASSWORD?</button></div>}
    {message&&<div className='auth-message'>{message}</div>}

    <button className='modern-auth-submit' onClick={submit} disabled={busy}>{busy?<><span className='auth-spinner'/>{signup?'CREATING ACCOUNT…':'SIGNING IN…'}</>:signup?'CREATE ACCOUNT →':'SIGN IN →'}</button>

    <div className='auth-trust-row'><span>✓ SECURE LOGIN</span><span>✓ PRIVATE ACCOUNT</span><span>✓ ORDER HISTORY</span></div>
    <div className='auth-switch-copy'>{signup?'Already have an account?':'New to NEPKITS HUB?'} <button onClick={()=>{setSignup(!signup);setMessage('')}}>{signup?'SIGN IN':'CREATE ACCOUNT'}</button></div>
   </div>
  </section>
 </main>
}