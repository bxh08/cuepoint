import './globals.css';import {Playfair_Display,Inter} from 'next/font/google';
import {CartProvider} from '@/components/Cart';import Header,{Logo} from '@/components/Header';
const serif=Playfair_Display({subsets:['latin'],variable:'--serif'});const sans=Inter({subsets:['latin'],variable:'--sans'});
export const metadata={title:'CuePoint | Better Gear · Better Game',description:'Premium billiards essentials for every game.'};
export const viewport={width:'device-width',initialScale:1};
export default function RootLayout({children}){return <html lang="en"><body className={serif.variable+' '+sans.variable}><CartProvider><Header/><main>{children}</main>
 <footer><div className="wrap"><div className="logo">
  <img src="/CUEPOINT BRANDING LOGO Transparent bg.png" alt="CuePoint" className="footer-logo-image" />
</div><p>Premium billiards essentials for every game.</p><p className="gold">Cues • Accessories • Equipment</p><p className="small">© 2026 CuePoint. All rights reserved.</p></div></footer></CartProvider></body></html>}
