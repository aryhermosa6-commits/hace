import { useState } from "react";
export default function FAQAccordion({ items=[], lang="id" }){
  const [open,setOpen]=useState(0);
  return (
    <div className="grid">
      {items.map((it,idx)=>{
        const q=lang==="en"?it.q_en:it.q_id; const a=lang==="en"?it.a_en:it.a_id;
        const is=open===idx;
        return (
          <div key={idx} className="card">
            <button className="btn" style={{width:"100%",justifyContent:"space-between",border:"none",borderBottom:is?"1px solid rgba(255,255,255,.12)":"none",borderRadius:is?"16px 16px 0 0":"16px"}}
              onClick={()=>setOpen(is?-1:idx)}>
              <span style={{fontWeight:900}}>{q}</span><span className="kbd">{is?"−":"+"}</span>
            </button>
            {is && <div className="cardPad"><p className="p">{a}</p></div>}
          </div>
        );
      })}
    </div>
  );
}
