import type {Metadata} from 'next';
import './globals.css';
import MarketHeader from '../components/market-header';

export const metadata:Metadata={
  title:'NEPKITS HUB — Football Store Nepal',
  description:'Football jerseys, World Cup fanwear and matchday football gear in Nepal.',
};

export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><MarketHeader/>{children}<footer className="site-footer">
    <div><b>NEPKITS HUB</b><p>Matchday football gear, club jerseys and fanwear for Nepal.</p></div>
    <div><strong>SHOP</strong><a href="/shop">All kits</a><a href="/shop?category=world-cup">World Cup</a></div>
    <div><strong>HELP</strong><a href="/account">Account</a><a href="/checkout">Checkout</a></div>
  </footer></body></html>;
}
