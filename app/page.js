import Link from 'next/link';import {db} from '@/lib/db';import ProductCard from '@/components/ProductCard';
export const dynamic='force-dynamic';
export default async function Home(){
 const {data}=await db().from('products').select('*');const P=data||[];
 const by=s=>P.find(p=>p.sku===s);const feat=['CP-CUE-002','CP-CUE-001','CP-ACC-004'].map(by).filter(Boolean);
 const cols=[['Premium Cues','Cues','CP-CUE-002'],['Accessories','Accessories','CP-ACC-004'],['Pro Equipment','Equipment','CP-EQP-001']];
 return <>
 <section className="hero"><div className="wrap"><p className="eye">CUEPOINT · Better Gear · Better Game</p><h1>Master the Table</h1><p className="lead">Elevate your game with quality pool cues, accessories, and equipment built for every player.</p><Link href="/shop?cat=Cues" className="btn gold">Explore Cues</Link></div></section>
 <section className="wrap split"><div><p className="eye dk">THE CUEPOINT STANDARD</p><h2>Built for Better Play</h2><Link href="/shop" className="btn">Shop All Products</Link></div>{by('CP-CUE-002')&&<div className="pic"><img src={by('CP-CUE-002').image_url} alt="Carbon Fiber Pro Cue"/></div>}</section>
 <section className="wrap sec"><h2 className="ctr">Collections</h2><div className="grid">{cols.map(([t,c,s])=><Link key={c} href={`/shop?cat=${c}`} className="col"><img src={by(s)?.image_url} alt={t}/><span>{t}</span></Link>)}</div></section>
 <section className="wrap sec"><h2 className="ctr">Featured Products</h2><div className="grid">{feat.map(p=><ProductCard key={p.sku} p={p}/>)}</div></section>
 <section className="wrap split rev"><div><p className="eye dk">QUALITY IN EVERY DETAIL</p><h2>Made for the Game</h2><p>From carefully selected cues to practical accessories and equipment, CuePoint offers everything you need to complete your setup.</p></div>{by('CP-ACC-004')&&<div className="pic"><img src={by('CP-ACC-004').image_url} alt="Tournament Billiard Ball Set"/></div>}</section>
 </>;
}
