import Link from 'next/link';import {db} from '@/lib/db';import ProductCard from '@/components/ProductCard';
export const dynamic='force-dynamic';
export const revalidate=0;
export const fetchCache='force-no-store';
export default async function Shop({searchParams}){
 const cat=searchParams.cat||'',sort=searchParams.sort||'';
 let q=db().from('products').select('*');if(cat)q=q.eq('category',cat);
 const r=await q.order('sku');const list=[...(r.data||[])];
 if(sort==='low')list.sort((a,b)=>a.price-b.price);if(sort==='high')list.sort((a,b)=>b.price-a.price);if(sort==='name')list.sort((a,b)=>a.title.localeCompare(b.title));
 const href=(c,s)=>{const p=new URLSearchParams();if(c)p.set('cat',c);if(s)p.set('sort',s);const t=p.toString();return '/shop'+(t?'?'+t:'')};
 return <div className="wrap sec"><h1>{cat||'All Products'}</h1>
  <div className="bar"><div className="chips">{[['All Products',''],['Cues','Cues'],['Accessories','Accessories'],['Equipment','Equipment']].map(([l,c])=><Link key={l} href={href(c,sort)} className={'chip'+(cat===c?' on':'')}>{l}</Link>)}</div>
  <div className="chips">{[['Featured',''],['Price ↑','low'],['Price ↓','high'],['A–Z','name']].map(([l,s])=><Link key={l} href={href(cat,s)} className={'chip'+(sort===s?' on':'')}>{l}</Link>)}</div></div>
  <div className="grid">{list.map(p=><ProductCard key={p.sku} p={p}/>)}</div></div>;
}
