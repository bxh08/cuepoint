import {notFound} from 'next/navigation';import Link from 'next/link';import {db} from '@/lib/db';import {aed,DELIVERY} from '@/lib/fmt';
export const dynamic='force-dynamic';
export default async function Order({params}){
 const {data:o}=await db().from('orders').select('*, order_items(*)').eq('number',params.number).maybeSingle();if(!o)notFound();
 return <div className="wrap sec narrow"><div className="box ctr"><p className="eye dk">ORDER CONFIRMED</p><h1>Thank you for your order.</h1><h2 className="gold">Order #{o.number}</h2><p>Your order has been successfully placed.</p></div>
 <div className="box">{o.order_items.map(i=><p className="sum" key={i.id}><span>{i.title} × {i.qty}</span><span>{aed(i.price*i.qty)}</span></p>)}<p className="sum"><span>Delivery</span><span>{aed(DELIVERY)}</span></p><p className="sum tot"><span>Total</span><span>{aed(o.total)}</span></p>
 <p className="sum"><span>Payment method</span><span>{o.payment_method}</span></p><p className="sum"><span>Payment status</span><span>{o.payment_status}</span></p><p className="sum"><span>Order status</span><span>{o.fulfillment_status}</span></p>
 {o.tracking&&<p className="sum"><span>Tracking</span><span>{o.carrier}: {o.tracking}</span></p>}</div><p className="ctr"><Link href="/shop" className="btn">Continue Shopping</Link></p></div>;
}
