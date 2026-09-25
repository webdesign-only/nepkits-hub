import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title:"NEPKITS HUB — Football Jerseys & Sportswear",
  description:"Football jerseys, kits and sportswear from NEPKITS HUB."
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}