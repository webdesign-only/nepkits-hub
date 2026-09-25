export const money=(n:number|string)=>new Intl.NumberFormat('en-NP',{style:'currency',currency:'NPR',maximumFractionDigits:0}).format(Number(n));
export function imageFor(product:any){return product?.images?.find((x:any)=>x.is_primary)?.url ?? product?.images?.[0]?.url ?? ''}
export function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}