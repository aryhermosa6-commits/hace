import { useEffect, useState } from "react";
export default function DropAlertPopup({ openByDefault=true, onCTA }){
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    if(!openByDefault) return;
    const key="phc_drop_alert_ts";
    const last=Number(localStorage.getItem(key)||0);
    const now=Date.now();
    if(now-last>24*60*60*1000){ setOpen(true); localStorage.setItem(key,String(now)); }
  },[openByDefault]);
  if(!open) return null;
  return (
    <div className="modalBack" onMouseDown={(e)=>{ if(e.target.classList.contains("modalBack")) setOpen(false); }}>
      <div className="modal" style={{maxWidth:650}}>
        <div className="modalHeader">
          <div className="row"><div className="badge">DROP ALERT</div><div className="small">Once per 24 jam</div></div>
          <button className="btn small" onClick={()=>setOpen(false)}>CLOSE</button>
        </div>
        <div className="modalBody">
          <div className="card cardPad">
            <div className="h2" style={{marginTop:0}}>GET NOTIFIED</div>
            <p className="p">Masuk “drop list” biar update drop berikutnya.</p>
            <div className="row" style={{marginTop:12}}>
              <button className="btn primary" onClick={()=>{ setOpen(false); onCTA?.(); }}>JOIN LIST</button>
              <button className="btn" onClick={()=>setOpen(false)}>LATER</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
