import type{Metadata}from'next';import'./globals.css';

export const metadata:Metadata={title:'NEPKITS HUB — Football Store Nepal',description:'Football jerseys and matchday fanwear for Nepal.'};

export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>
    <header className="header">
      <div className="header-inner">
        <a href="/" className="brand"><i>N</i><span><b>NEPKITS</b><small>HUB / MATCHDAY FOOTBALL</small></span></a>
        <form className="search" action="/shop"><input name="q" placeholder="Search NEPKITS jerseys, clubs, World Cup…"/><button>SEARCH</button></form>
        <nav><a href="/shop">SHOP</a><a href="/checkout">ORDERS</a><a href="/checkout">CART</a></nav>
      </div>
      <div className="nav"><a href="/shop">ALL KITS</a><a href="/shop?category=clubs">CLUBS</a><a href="/shop?category=world-cup">WORLD CUP</a><a href="/shop?category=retro">RETRO</a><a href="/shop?category=fan-gear">FAN GEAR</a></div>
    </header>
    <div className="mobile-header"><a href="/" className="brand"><i>N</i><span><b>NEPKITS</b><small>HUB / MATCHDAY</small></span></a><a href="/checkout">CART</a></div>
    {children}
    <footer className="site-footer"><div><b>NEPKITS HUB</b><p>Matchday football gear, club jerseys and fanwear for Nepal.</p></div><div><strong>SHOP</strong><a href="/shop">All kits</a><a href="/shop?category=world-cup">World Cup</a></div><div><strong>HELP</strong><a href="/checkout">Checkout</a><a href="/shop">Shop again</a></div></footer>
  </body></html>
}
