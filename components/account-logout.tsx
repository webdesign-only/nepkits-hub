'use client';
import {useState} from 'react';
import {createClient} from '@supabase/supabase-js';

const supabase=createClient('https://iyfyghzqlcwzyjuqxjlu.supabase.co','sb_publishable_1JP2P6NgeRAf5ADPjJH78g_KkVa5MzE');

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