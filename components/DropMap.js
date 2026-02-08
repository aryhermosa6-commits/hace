import { useState } from "react";
export default function DropMap({ data, lang="id" }){
  const [pick,setPick]=useState(null);
  const title=lang==="en"?data?.title_en:data?.title_id;
  const pts=data?.points||[];
  return (
    <div className="card cardPad">
      <div className="row" style={{justifyContent:"space-between"}}>
        <div><div className="h2" style={{margin:0,fontSize:16}}>{title}</div><div className="small">Stylized map, bukan alamat real.</div></div>
        <div className="badge">INTERACTIVE</div>
      </div>
      <div style={{marginTop:12,position:"relative",borderRadius:18,border:"1px solid rgba(255,255,255,.12)",height:320,overflow:"hidden",
        background:"radial-gradient(circle at 20% 30%, rgba(184,255,0,.10), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,23,68,.08), transparent 55%), rgba(255,255,255,.03)"}}>
        <div className="noise" style={{position:"absolute",inset:0,opacity:.06}} />
        <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg, rgba(255,255,255,.04) 0px, rgba(255,255,255,.04) 1px, transparent 2px, transparent 10px)",opacity:.18}} />
        {pts.map((p,i)=>(
          <button key={i} className="btn small" onClick={()=>setPick(p)} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)",borderColor:"rgba(184,255,0,.35)",background:"rgba(184,255,0,.09)"}}>●</button>
        ))}
        {pick && (
          <div className="card" style={{position:"absolute",left:`${Math.min(80,pick.x+6)}%`,top:`${Math.min(80,pick.y+6)}%`,width:260}}>
            <div className="cardPad" style={{padding:12}}>
              <div style={{fontWeight:900}}>{lang==="en"?pick.name_en:pick.name_id}</div>
              <div className="small" style={{marginTop:6}}>{lang==="en"?pick.note_en:pick.note_id}</div>
              <div className="row" style={{marginTop:10}}><button className="btn small" onClick={()=>setPick(null)}>CLOSE</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
