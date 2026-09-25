export default function NepkitsBrand({className='',variant='default'}:{className?:string;variant?:'default'|'compact'|'footer'|'loader'}) {
  return <span className={`nepkits-brand nepkits-brand-${variant} ${className}`}>
    <span className='nepkits-brand-mark' aria-hidden='true'><span>N</span></span>
    <span className='nepkits-brand-copy'>
      <strong>NEPKITS</strong>
      <em>HUB</em>
      <small>FOOTBALL / NEPAL</small>
    </span>
  </span>
}