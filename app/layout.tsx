import type { Metadata } from 'next';
import { CartProvider } from '@/components/cart-provider';
import { StoreHeader } from '@/components/store-header';
import { StoreFooter } from '@/components/store-footer';
import './globals.css';
export const metadata:Metadata={title:{default:'NEPKITS HUB | Football Jerseys & Sportswear',template:'%s | NEPKITS HUB'},description:'Premium football jerseys, kits and sportswear from NEPKITS HUB.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang='en'><body><CartProvider><StoreHeader/>{children}<StoreFooter/></CartProvider></body></html>}