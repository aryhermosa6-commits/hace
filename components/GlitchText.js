import { useEffect, useState } from "react";
export default function GlitchText({ children, className="", force=false }){
  const text = String(children ?? "");
  const [on, setOn] = useState(force);
  useEffect(()=>{
    if(force){ setOn(true); return; }
    const t = setInterval(()=> setOn(Math.random()<0.33), 650);
    return ()=> clearInterval(t);
  },[force]);
  return <span className={`glitch ${on?"glitching":""} ${className}`} data-text={text}>{text}</span>;
}
