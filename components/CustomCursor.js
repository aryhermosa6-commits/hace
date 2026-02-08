import { useEffect, useRef, useState } from "react";
export default function CustomCursor({ enabled=true }){
  const [fine, setFine] = useState(false);
  const dot = useRef(null); const ring = useRef(null);
  const trail = useRef([]); const pos = useRef({ x:0, y:0 });
  const lerp = (a,b,t)=> a+(b-a)*t;

  useEffect(()=>{
    if(!enabled) return;
    const m = window.matchMedia("(pointer:fine)");
    const apply = ()=> setFine(m.matches);
    apply(); m.addEventListener?.("change", apply);
    return ()=> m.removeEventListener?.("change", apply);
  },[enabled]);

  useEffect(()=>{
    if(!enabled || !fine) return;
    document.body.classList.add("hideCursor");
    let raf=0;
    const onMove = (e)=>{ pos.current.x=e.clientX; pos.current.y=e.clientY; };
    window.addEventListener("mousemove", onMove, { passive:true });
    const dots=[];
    for(let i=0;i<10;i++){
      const el=document.createElement("div");
      el.className="trailDot";
      el.style.opacity=String(0.10+(i/10)*0.06);
      document.body.appendChild(el);
      dots.push({ el, x:pos.current.x, y:pos.current.y });
    }
    trail.current=dots;
    let ringX=pos.current.x, ringY=pos.current.y;
    const tick=()=>{
      const x=pos.current.x, y=pos.current.y;
      if(dot.current) dot.current.style.transform=`translate(${x}px, ${y}px)`;
      ringX=lerp(ringX,x,0.18); ringY=lerp(ringY,y,0.18);
      if(ring.current) ring.current.style.transform=`translate(${ringX}px, ${ringY}px)`;
      let tx=x, ty=y;
      for(const d of trail.current){
        d.x=lerp(d.x,tx,0.25); d.y=lerp(d.y,ty,0.25);
        d.el.style.transform=`translate(${d.x}px, ${d.y}px)`; tx=d.x; ty=d.y;
      }
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("hideCursor");
      for(const d of trail.current) d.el.remove();
      trail.current=[];
    };
  },[enabled, fine]);

  if(!enabled || !fine) return null;
  return (<><div ref={dot} className="cursorDot" /><div ref={ring} className="cursorRing" /></>);
}
