'use client';
import {useState} from 'react';import Link from 'next/link';import {useRouter} from 'next/navigation';import {useCart} from '@/components/Cart';import {aed,DELIVERY} from '@/lib/fmt';
export default function Checkout(){
 const {items,subtotal,clear}=useCart();const r=useRouter();const [busy,setBusy]=useState(false),[err,setErr]=useState('');
 const [c,setC]=useState({name:'',email:'',address:'',city:'',country:'United Arab Emirates'}),[pay,setPay]=useState('Test Payment');
 const set=k=>e=>setC({...c,[k]:e.target.value});
 const go=async e=>{e.preventDefault();setBusy(true);setErr('');
  try{const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer:c,payment:pay,items:items.map(i=>({sku:i.sku,qty:i.qty}))})});const d=await res.json();
   if(!res.ok){setErr(d.error||'Something went wrong.');setBusy(false);return}
   clear();r.push('/order/'+d.number);}catch{setErr('Network error. Please try again.');setBusy(false)}};
 if(!items.length)return <div className="wrap sec ctr"><h1>Checkout</h1><p>Your cart is empty.</p><br/><Link href="/shop" className="btn">Go to Shop</Link></div>;
 return <div className="wrap sec"><h1>Checkout</h1><form onSubmit={go} className="cartgrid"><div className="box">
  {[['name','Full name'],['email','Email'],['address','Address'],['city','City'],['country','Country']].map(([k,l])=><label key={k}>{l}<input required type={k==='email'?'email':'text'} value={c[k]} onChange={set(k)}/></label>)}
  <h3>Payment method</h3>{['Test Payment','Cash on Delivery'].map(m=><label key={m} className="radio"><input type="radio" checked={pay===m} onChange={()=>setPay(m)}/> {m}</label>)}<p className="small">Test store: no real payment is taken.</p></div>
  <div className="box"><h3>Order summary</h3>{items.map(i=><p className="sum" key={i.sku}><span>{i.title} × {i.qty}</span><span>{aed(i.price*i.qty)}</span></p>)}<p className="sum"><span>Delivery</span><span>{aed(DELIVERY)}</span></p><p className="sum tot"><span>Total</span><span>{aed(subtotal+DELIVERY)}</span></p>
  {err&&<p className="err">{err}</p>}<button className="btn full" disabled={busy}>{busy?'Placing order…':'Place Order'}</button></div></form></div>;
}
