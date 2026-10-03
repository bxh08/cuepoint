'use client';
import {useState} from 'react';import Link from 'next/link';import {useRouter} from 'next/navigation';import {useCart} from './Cart';
export default function AddToCart({p}){
 const [q,setQ]=useState(1);const [done,setDone]=useState(false);const {add}=useCart();const r=useRouter();const out=p.stock<1;
 return <>
  <div className="qty"><button disabled={out} onClick={()=>setQ(Math.max(1,q-1))}>−</button><span>{out?0:q}</span><button disabled={out||q>=p.stock} onClick={()=>setQ(Math.min(p.stock,q+1))}>+</button></div>
  <div className="acts"><button className="btn" disabled={out} onClick={()=>{add(p,q);setDone(true)}}>Add to Cart</button><button className="btn gold" disabled={out} onClick={()=>{add(p,q);r.push('/checkout')}}>Buy Now</button></div>
  {done&&<p className="ok">Added to cart. <Link href="/cart" className="u">View cart</Link></p>}
 </>;
}
