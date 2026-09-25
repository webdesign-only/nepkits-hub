import type { Metadata } from 'next';
import Link from 'next/link';
import CartBadge from '../components/cart-badge';
import LoginModal from '../components/login-modal';
import LoginTrigger from '../components/login-trigger';
import CartDrawer from '../components/cart-drawer';
import CartTrigger from '../components/cart-trigger';
import './globals.css';

export const metadata:Metadata={
  title:{default:'NEPKITS HUB | Football Jerseys & Sportswear',template:'%s | NEPKITS HUB'},
  description:'Football jerseys, World Cup fanwear, club kits and sportswear in Nepal.'
};

function Header(){
  return <>
    <header className='market-header'>
      <div className='market-main'>
        <div className='market-shell market-main-inner'>
          <Link href='/' className='market-logo'><span className='market-logo-frame'><img src='/nepkits-logo.webp' alt='NEPKITS HUB'/></span></Link>
          <form action='/shop' className='market-search'><input name='q' placeholder='Search NEPKITS jerseys, clubs & World Cup…'/><button>SEARCH</button></form>
          <div className='market-actions'>
            <LoginTrigger/>
            <Link href='/orders'><span>↗</span><b>Orders</b></Link>
            <CartTrigger/>
          </div>
        </div>
      </div>
      <nav className='market-nav'><div className='market-shell market-nav-inner'>
        <Link className='all-cat' href='/shop'>☰ ALL CATEGORIES</Link>
        <Link href='/shop?category=a201ec0c-b146-46c7-91fb-ca7c803e5330'>CLUB JERSEYS</Link>
        <Link href='/shop?category=3fe4a585-eca3-4c88-b73d-cadb5cbf608c'>WORLD CUP 2026</Link>
        <Link href='/shop?collection=new'>NEW ARRIVALS</Link>
        <Link href='/shop?collection=best'>BEST SELLERS</Link>
        <Link href='/shop?collection=sale'>FLASH DEALS</Link>
        <Link href='/shop?category=40922dbe-69ec-40fe-a8b2-074afc825b13'>KITS</Link>
        <Link href='/shop?category=23e4996d-7e17-4cd9-9338-f4cebd4040ec'>FAN GEAR</Link>
      </div></nav>
    </header>
      <div className='mobile-market-bar'>
        <div className='mobile-market-top'>
          <Link href='/' className='mobile-brand'><span className='market-logo-frame'><img src='/nepkits-logo.webp' alt='NEPKITS HUB'/></span></Link>
          <div className='mobile-actions'><LoginTrigger/><CartTrigger className='mobile-cart' mobile/></div>
        </div>
        <form action='/shop' className='mobile-search'><input name='q' placeholder='Search jerseys, clubs & World Cup…'/><button aria-label='Search'>⌕</button></form>
        <div className='mobile-cats'>
          <Link href='/shop'>ALL</Link><Link href='/shop?category=a201ec0c-b146-46c7-91fb-ca7c803e5330'>CLUBS</Link><Link href='/shop?category=3fe4a585-eca3-4c88-b73d-cadb5cbf608c'>WORLD CUP</Link><Link href='/shop?collection=sale'>DEALS</Link><Link href='/shop?collection=new'>NEW</Link>
        </div>
      </div>
    <CartDrawer/>
    <LoginModal/>
  </>
}

function Footer(){
  return <footer className='market-footer'>
    <div className='market-shell footer-grid'>
      <div><img src='/nepkits-logo.webp' alt='NEPKITS HUB'/><p>NEPKITS matchday gear, club jerseys, World Cup fanwear and football essentials for Nepal.</p></div>
      <div><h4>SHOP</h4><Link href='/shop'>All products</Link><Link href='/shop?collection=new'>New arrivals</Link><Link href='/shop?collection=sale'>Deals</Link></div>
      <div><h4>HELP</h4><Link href='/account'>Account</Link><Link href='/orders'>Orders</Link><CartTrigger className='footer-cart-trigger'/><Link href='/checkout'>Checkout</Link></div>
      <div><h4>PAYMENT</h4><span>Cash on Delivery</span><span>eSewa where configured</span><span>Secure checkout</span></div>
    </div>
    <div className='market-footer-bottom'><div className='market-shell'><span>© 2026 NEPKITS HUB</span><span>Made for matchday in Nepal.</span></div></div>
  </footer>
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang='en'><body><Header/>{children}<Footer/></body></html>
}