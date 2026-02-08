import { useEffect } from "react";
export default function HeatTracker(){
  useEffect(()=>{
    let last=0;
    const onClick=(e)=>{
      const now=Date.now(); if(now-last<120) return; last=now;
      const w=window.innerWidth||1, h=window.innerHeight||1;
      const x=Math.max(0,Math.min(1,e.clientX/w)), y=Math.max(0,Math.min(1,e.clientY/h));
      fetch("/api/track/heat",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({x,y,path:location.pathname,t:now})}).catch(()=>{});
    };
    window.addEventListener("click",onClick,{passive:true});
    return ()=>window.removeEventListener("click",onClick);
  },[]);
  return null;
}
