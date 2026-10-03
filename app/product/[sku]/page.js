import {notFound} from 'next/navigation';import Link from 'next/link';import {db} from '@/lib/db';import {aed,stockText} from '@/lib/fmt';import AddToCart from '@/components/AddToCart';
export const dynamic='force-dynamic';
export const revalidate=0;
export default async function Product({params}){
 const {data:p}=await db().from('products').select('*').eq('sku',params.sku).maybeSingle();if(!p)notFound();
 const out=p.stock<1;
 return <div className="wrap pd"><div className="pic"><img src={p.image_url} alt={p.title}/></div><div>
  <p className="eye dk"><Link href={`/shop?cat=${p.category}`}>{p.category}</Link></p><h1>{p.title}</h1><p className="price big">{aed(p.price)}</p>
  <p className={'stock big'+(out?' out':'')}>{stockText(p.stock)}</p>
  <AddToCart p={{sku:p.sku,title:p.title,price:p.price,image_url:p.image_url,stock:p.stock}}/>
  <div className="desc" dangerouslySetInnerHTML={{__html:p.description}}/><p className="small">SKU: {p.sku} · Category: {p.category}</p></div></div>;
}
