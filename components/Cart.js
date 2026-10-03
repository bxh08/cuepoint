'use client';
import {createContext,useContext,useEffect,useState} from 'react';
const C=createContext(null);
export const useCart=()=>useContext(C);
export function CartProvider({children}){
 const [items,setItems]=useState([]);const [ready,setReady]=useState(false);
 useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem('cp_cart')||'[]'))}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem('cp_cart',JSON.stringify(items))},[items,ready]);
 const add=(p,q)=>setItems(a=>{const e=a.find(i=>i.sku===p.sku);const n=Math.min((e?e.qty:0)+q,p.stock);if(n<1)return a;const row={sku:p.sku,title:p.title,price:p.price,image_url:p.image_url,stock:p.stock,qty:n};return e?a.map(i=>i.sku===p.sku?row:i):[...a,row]});
 const setQty=(sku,q)=>setItems(a=>a.map(i=>i.sku===sku?{...i,qty:Math.max(1,Math.min(q,i.stock))}:i));
 const remove=sku=>setItems(a=>a.filter(i=>i.sku!==sku));
 const clear=()=>setItems([]);
 const count=items.reduce((s,i)=>s+i.qty,0);
 const subtotal=items.reduce((s,i)=>s+i.qty*i.price,0);
 return <C.Provider value={{items,add,setQty,remove,clear,count,subtotal}}>{children}</C.Provider>;
}
