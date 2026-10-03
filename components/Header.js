'use client';
import Link from 'next/link';import {useState} from 'react';import {useCart} from './Cart';
export const Logo=()=><svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="13" fill="none" stroke="#C9A45C" strokeWidth="2"/><circle cx="15" cy="15" r="4" fill="#C9A45C"/></svg>;
export default function Header(){
 const [o,setO]=useState(false);const {count}=useCart();const c=()=>setO(false);
 return <header><div className="wrap nav">
  <Link href="/" className="logo" onClick={c}>
  <img src="/CUEPOINT BRANDING LOGO Transparent bg.png" alt="CuePoint" className="logo-image" />
</Link>
  <nav className={'links'+(o?' open':'')}><Link href="/" onClick={c}>Home</Link><Link href="/shop" onClick={c}>Shop</Link><Link href="/shop" className="btn gold sm" onClick={c}>Shop All</Link></nav>
  <div className="right"><Link href="/cart" aria-label="Cart" className="cartlink">🛒<span className="badge">{count}</span></Link><button className="burger" aria-label="Menu" onClick={()=>setO(!o)}>{o?'✕':'☰'}</button></div>
 </div></header>;
}
