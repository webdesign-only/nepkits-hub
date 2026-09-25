'use client';
export default function LoginTrigger(){
 return <button type='button' className='market-account-button' onClick={()=>window.dispatchEvent(new Event('nepkits:login'))}><span>◯</span><b>Account</b></button>
}