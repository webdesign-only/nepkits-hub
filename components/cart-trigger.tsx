'use client';
import CartBadge from './cart-badge';

export default function CartTrigger({className='market-cart',mobile=false}:{className?:string;mobile?:boolean}){
 return <button type='button' className={className+' cart-open-trigger'} onClick={()=>window.dispatchEvent(new Event('nepkits:open-cart'))} aria-label='Open cart'>
  <span>🛒</span>
  <b className={mobile?'sr-only':''}>{mobile?'Cart':'Cart'}</b>
  <CartBadge/>
 </button>
}