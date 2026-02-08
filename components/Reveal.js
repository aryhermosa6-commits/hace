import { useEffect, useRef } from "react";
export default function Reveal({ children }){
  const ref = useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const io=new IntersectionObserver((entries)=>{ for(const e of entries){ if(e.isIntersecting) el.classList.add("in"); } },{ threshold:0.12 });
    io.observe(el); return ()=> io.disconnect();
  },[]);
  return <div ref={ref} className="reveal">{children}</div>;
}
