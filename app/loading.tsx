import './globals.css';

export default function Loading(){
  return <main className='site-loader' aria-label='Loading NEPKITS HUB'>
    <div className='loader-noise'/>
    <div className='loader-inner'>
      <div className='loader-logo-frame'>
        <img src='/nepkits-logo.webp' alt='NEPKITS HUB'/>
      </div>
      <div className='loader-kicker'>NEPKITS HUB • FOOTBALL MARKETPLACE</div>
      <h1>READY FOR<br/><em>MATCHDAY.</em></h1>
      <p>Loading jerseys, clubs and World Cup collections…</p>
      <div className='loader-track'><span/></div>
      <div className='loader-foot'><span>NEPAL</span><span>2026</span><span>⚽</span></div>
    </div>
  </main>
}