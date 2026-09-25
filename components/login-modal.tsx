'use client';
import {useEffect,useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const supabase=createClient('https://iyfyghzqlcwzyjuqxjlu.supabase.co','sb_publishable_1JP2P6NgeRAf5ADPjJH78g_KkVa5MzE');

export default function LoginModal(){
 const [open,setOpen]=useState(false);
 const [signup,setSignup]=useState(false);
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [show,setShow]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');

 useEffect(()=>{
  const onOpen=()=>{setOpen(true);setMessage('')};
  window.addEventListener('nepkits:login',onOpen);
  return()=>window.removeEventListener('nepkits:login',onOpen);
 },[]);

 useEffect(()=>{
  if(!open)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
  window.addEventListener('keydown',onKey);
  document.body.style.overflow='hidden';
  return()=>{window.removeEventListener('keydown',onKey);document.body.style.overflow=''};
 },[open]);

 async function submit(){
  setMessage('');
  if(!email.trim()||!password){setMessage('Enter your email and password.');return}
  if(signup&&!name.trim()){setMessage('Enter your name.');return}
  setBusy(true);
  const result=signup
   ? await supabase.auth.signUp({email,password,options:{data:{full_name:name}}})
   : await supabase.auth.signInWithPassword({email,password});
  setBusy(false);
  if(result.error){setMessage(result.error.message);return}
  setOpen(false);
  window.location.href=new URLSearchParams(window.location.search).get('next')||'/account';
 }

 if(!open)return null;

 return <div className='login-popover-backdrop' onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
  <div className='login-popover' role='dialog' aria-modal='true' aria-label='NEPKITS HUB login'>
   <button className='login-popover-close' onClick={()=>setOpen(false)} aria-label='Close'>×</button>
   <span className='login-popover-brand'><img src='https://raw.githubusercontent.com/webdesign-only/nepkits-hub/main/public/nepkits-logo.webp' alt='NEPKITS HUB'/></span>
   <div className='login-popover-tabs'><button className={!signup?'active':''} onClick={()=>{setSignup(false);setMessage('')}}>SIGN IN</button><button className={signup?'active':''} onClick={()=>{setSignup(true);setMessage('')}}>CREATE ACCOUNT</button></div>
   <div className='login-popover-title'>{signup?'Create your account':'Welcome back'}</div>
   <div className='login-popover-sub'>{signup?'Checkout faster and track your orders.':'Sign in to access your account and orders.'}</div>
   {signup&&<input className='login-popover-input' value={name} onChange={e=>setName(e.target.value)} placeholder='Full name' autoComplete='name'/>}
   <input className='login-popover-input' type='email' value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email address' autoComplete='email'/>
   <div className='login-popover-password'><input className='login-popover-input' type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' autoComplete={signup?'new-password':'current-password'}/><button onClick={()=>setShow(!show)}>{show?'HIDE':'SHOW'}</button></div>
   {message&&<div className='login-popover-error'>{message}</div>}
   <button className='login-popover-submit' disabled={busy} onClick={submit}>{busy?'PLEASE WAIT…':signup?'CREATE ACCOUNT':'SIGN IN'}</button>
   <div className='login-popover-foot'>{signup?'Already have an account?':'New to NEPKITS HUB?'} <button onClick={()=>{setSignup(!signup);setMessage('')}}>{signup?'Sign in':'Create account'}</button></div>
  </div>
 </div>
}