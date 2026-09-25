'use client';
import {useState} from 'react';


import { supabase } from '../lib/supabase-browser';

export default function AccountLogout(){
 const [busy,setBusy]=useState(false);
 async function logout(){
  if(busy)return;
  setBusy(true);
  await supabase.auth.signOut();
  window.location.href='/';
 }
 return <button type='button' onClick={logout} disabled={busy}>{busy?'LOGGING OUT…':'LOGOUT'}</button>;
}