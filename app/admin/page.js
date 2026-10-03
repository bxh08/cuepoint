'use client';
import {useEffect,useState} from 'react';import {aed} from '@/lib/fmt';
const post=b=>fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(r=>r.json());
export default function Admin(){
 const [d,setD]=useState(null),[auth,setAuth]=useState(null),[pw,setPw]=useState(''),[err,setErr]=useState(''),[arch,setArch]=useState(false),[open,setOpen]=useState(null),[f,setF]=useState({tracking:'',carrier:'CuePoint Test Shipping'}),[st,setSt]=useState({});
 const load=async()=>{const r=await fetch('/api/admin');if(r.status===401){setAuth(false);return}setAuth(true);setD(await r.json())};
 useEffect(()=>{load()},[]);
 const act=async b=>{const r=await post(b);if(r.error)alert(r.error);await load();return r};
 const login=async()=>{const r=await post({action:'login',password:pw});r.error?setErr(r.error):load()};
 if(auth===null)return <div className="wrap sec">Loading…</div>;
 if(!auth)return <div className="wrap sec narrow"><div className="box"><h1>Admin</h1><label>Password<input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/></label><button className="btn full" onClick={login}>Sign in</button>{err&&<p className="err">{err}</p>}</div></div>;
 const orders=d.orders.filter(o=>arch||!o.archived);
 return <div className="wrap sec"><div className="bar"><h1>Admin Dashboard</h1><button className="btn out dkb" onClick={()=>confirm('Reset demo? This sets Carbon Fiber Pro Cue stock back to 1 and archives orders containing it.')&&act({action:'reset'})}>Reset Demo</button></div>
 <h2>Product Inventory</h2><div className="scroll"><table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead><tbody>{d.products.map(p=><tr key={p.sku}><td>{p.title}</td><td>{p.sku}</td><td>{p.category}</td><td>{aed(p.price)}</td>
  <td><input className="sm" type="number" min="0" value={st[p.sku]??p.stock} onChange={e=>setSt({...st,[p.sku]:e.target.value})}/></td><td><button className="btn sm" onClick={async()=>{await act({action:'stock',sku:p.sku,stock:st[p.sku]??p.stock});setSt({...st,[p.sku]:undefined})}}>Save</button></td></tr>)}</tbody></table></div>
 <div className="bar"><h2>Orders</h2><label className="radio"><input type="checkbox" checked={arch} onChange={e=>setArch(e.target.checked)}/> Show archived</label></div>
 {!orders.length&&<p>No orders yet.</p>}
 {orders.map(o=><div className={'box ord'+(o.archived?' arch':'')} key={o.id}><div className="bar"><h3>#{o.number}{o.archived&&' (archived)'}</h3><span>{new Date(o.created_at).toLocaleString()}</span></div>
  <p>{o.name} · {o.email}</p><p>{o.order_items.map(i=>`${i.title} × ${i.qty}`).join(', ')}</p><p><strong>{aed(o.total)}</strong> · {o.payment_method}</p>
  <p><span className={'pill '+o.payment_status}>{o.payment_status.toUpperCase()}</span> <span className={'pill '+o.fulfillment_status}>{o.fulfillment_status.toUpperCase()}</span></p>
  {o.tracking&&<p>Tracking: <strong>{o.tracking}</strong> ({o.carrier})</p>}
  <div className="acts">{o.payment_status!=='Paid'?<button className="btn sm" onClick={()=>act({action:'paid',id:o.id,paid:true})}>Mark Paid</button>:<button className="btn sm out dkb" onClick={()=>act({action:'paid',id:o.id,paid:false})}>Mark Pending</button>}
  {o.fulfillment_status!=='Fulfilled'&&<button className="btn gold sm" onClick={()=>setOpen(open===o.id?null:o.id)}>Fulfill Order</button>}</div>
  {open===o.id&&<div className="fform"><label>Tracking Number<input placeholder="CP100012026" value={f.tracking} onChange={e=>setF({...f,tracking:e.target.value})}/></label><label>Shipping Carrier<input value={f.carrier} onChange={e=>setF({...f,carrier:e.target.value})}/></label><button className="btn sm" onClick={async()=>{const r=await act({action:'fulfill',id:o.id,...f});if(!r.error){setOpen(null);setF({...f,tracking:''})}}}>Confirm Fulfillment</button></div>}
 </div>)}</div>;
}
