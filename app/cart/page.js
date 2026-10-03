'use client';
import Link from 'next/link';import {useCart} from '@/components/Cart';import {aed,DELIVERY} from '@/lib/fmt';
export default function Cart(){
 const {items,setQty,remove,subtotal}=useCart();
 if(!items.length)return <div className="wrap sec ctr"><h1>Your Cart</h1><p>Your cart is empty.</p><br/><Link href="/shop" className="btn">Continue Shopping</Link></div>;
 return <div className="wrap sec"><h1>Your Cart</h1><div className="cartgrid"><div>{items.map(i=><div className="row" key={i.sku}><img src={i.image_url} alt={i.title}/><div><h3>{i.title}</h3><p>{aed(i.price)}</p>
  <div className="qty"><button onClick={()=>setQty(i.sku,i.qty-1)}>−</button><span>{i.qty}</span><button disabled={i.qty>=i.stock} onClick={()=>setQty(i.sku,i.qty+1)}>+</button></div>
  <button className="lnk" onClick={()=>remove(i.sku)}>Remove</button></div><strong>{aed(i.price*i.qty)}</strong></div>)}</div>
  <div className="box"><p className="sum"><span>Subtotal</span><span>{aed(subtotal)}</span></p><p className="sum"><span>Delivery</span><span>{aed(DELIVERY)}</span></p><p className="sum tot"><span>Total</span><span>{aed(subtotal+DELIVERY)}</span></p><Link href="/checkout" className="btn full">Checkout</Link></div></div></div>;
}
