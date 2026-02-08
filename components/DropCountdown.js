import { useEffect, useMemo, useState } from "react";
const pad=(n)=>String(n).padStart(2,"0");
export default function DropCountdown({ closeAtISO }){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{ const t=setInterval(()=>setNow(Date.now()),1000); return ()=>clearInterval(t); },[]);
  const {text,done}=useMemo(()=>{
    const end=new Date(closeAtISO).getTime(); const diff=Math.max(0,end-now);
    const done=diff<=0; const s=Math.floor(diff/1000);
    const d=Math.floor(s/86400), h=Math.floor((s%86400)/3600), m=Math.floor((s%3600)/60), ss=s%60;
    return { done, text:`${d}D ${pad(h)}:${pad(m)}:${pad(ss)}` };
  },[now,closeAtISO]);
  return <div className={`badge ${done?"sold":"po"}`}><span>⏱</span><span style={{fontWeight:800}}>{done?"PO CLOSED":text}</span></div>;
}
