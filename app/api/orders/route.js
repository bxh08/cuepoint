import {NextResponse} from 'next/server';import {db} from '@/lib/db';
export const dynamic='force-dynamic';
export async function POST(req){
 const b=await req.json();const c=b.customer||{};
 if(!c.name||!c.email||!c.address||!c.city||!c.country||!Array.isArray(b.items)||!b.items.length)return NextResponse.json({error:'Please complete all fields.'},{status:400});
 const items=b.items.map(i=>({sku:String(i.sku),qty:Math.floor(Number(i.qty))}));
 const {data,error}=await db().rpc('place_order',{p_customer:c,p_items:items,p_payment:b.payment==='Cash on Delivery'?'Cash on Delivery':'Test Payment'});
 if(error)return NextResponse.json({error:error.message},{status:409});
 return NextResponse.json({number:data});
}
