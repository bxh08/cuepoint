import {NextResponse} from 'next/server';import {cookies} from 'next/headers';import {createHmac} from 'crypto';import {db} from '@/lib/db';
export const dynamic='force-dynamic';
const tok=()=>createHmac('sha256',process.env.SUPABASE_SERVICE_KEY||'x').update(process.env.ADMIN_PASSWORD||'').digest('hex');
const authed=()=>!!process.env.ADMIN_PASSWORD&&cookies().get('cp_admin')?.value===tok();
export async function GET(){
 if(!authed())return NextResponse.json({error:'auth'},{status:401});
 const s=db();const [p,o]=await Promise.all([s.from('products').select('*').order('sku'),s.from('orders').select('*, order_items(*)').order('created_at',{ascending:false})]);
 return NextResponse.json({products:p.data||[],orders:o.data||[]});
}
export async function POST(req){
 const b=await req.json();
 if(b.action==='login'){
  if(process.env.ADMIN_PASSWORD&&b.password===process.env.ADMIN_PASSWORD){const r=NextResponse.json({ok:1});r.cookies.set('cp_admin',tok(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:28800});return r}
  return NextResponse.json({error:'Wrong password'},{status:401});
 }
 if(!authed())return NextResponse.json({error:'auth'},{status:401});
 const s=db();let r;
 if(b.action==='stock')r=await s.from('products').update({stock:Math.max(0,parseInt(b.stock)||0)}).eq('sku',b.sku);
 else if(b.action==='paid')r=await s.from('orders').update({payment_status:b.paid?'Paid':'Pending'}).eq('id',b.id);
 else if(b.action==='fulfill'){if(!String(b.tracking||'').trim())return NextResponse.json({error:'Enter a tracking number.'},{status:400});r=await s.from('orders').update({fulfillment_status:'Fulfilled',tracking:b.tracking.trim(),carrier:(b.carrier||'').trim()}).eq('id',b.id)}
 else if(b.action==='reset')r=await s.rpc('reset_demo');
 else return NextResponse.json({error:'Bad action'},{status:400});
 return NextResponse.json(r.error?{error:r.error.message}:{ok:1},{status:r.error?500:200});
}
