export type Product={id:string;slug:string;name:string;team:string;season:string;price:number;compareAt?:number;rating:number;sold:number;category:'clubs'|'world-cup'|'retro'|'fan-gear';image:string;sizes:string[];stock:number;description:string};
export type CartItem={product:Product;size:string;quantity:number};
