import { useEffect, useState } from "react";
import { signImageURL } from "../lib/signedImg";
export default function GalleryModal({ open, onClose, title, images=[], watermarkText="" }){
  const [idx,setIdx]=useState(0); const [signed,setSigned]=useState([]);
  useEffect(()=>{ if(open) setIdx(0); },[open,images]);
  useEffect(()=>{ let alive=true; (async()=>{ const out=[]; for(const p of images){ try{ out.push(await signImageURL(p)); }catch(e){ out.push(p); } } if(alive) setSigned(out); })(); return ()=>{alive=false}; },[images]);
  useEffect(()=>{ if(!open) return; const onKey=(e)=>{ if(e.key==="Escape") onClose?.(); if(e.key==="ArrowRight") setIdx(i=>Math.min(signed.length-1,i+1)); if(e.key==="ArrowLeft") setIdx(i=>Math.max(0,i-1)); };
    window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey);
  },[open,signed.length,onClose]);
  const cur=signed[idx]||images[idx];
  if(!open) return null;
  return (
    <div className="modalBack" onMouseDown={(e)=>{ if(e.target.classList.contains("modalBack")) onClose?.(); }}>
      <div className="modal">
        <div className="modalHeader">
          <div className="row">
            <div className="badge">GALLERY</div><div className="small">{title}</div>
            <div className="small"><span className="kbd">←</span> <span className="kbd">→</span> <span className="kbd">ESC</span></div>
          </div>
          <button className="btn small" onClick={onClose}>CLOSE</button>
        </div>
        <div className="modalBody">
          <div className="card" style={{borderRadius:18,overflow:"hidden",position:"relative"}}>
            <div className="imgGuard" onContextMenu={(e)=>e.preventDefault()} onDragStart={(e)=>e.preventDefault()}>
              <img src={cur} alt="" style={{width:"100%",maxHeight:"62vh",objectFit:"contain",background:"#050506"}} />
            </div>
            {!!watermarkText && (
              <div style={{position:"absolute",left:14,bottom:14,padding:"6px 10px",borderRadius:12,border:"1px solid rgba(255,255,255,.14)",background:"rgba(0,0,0,.35)",fontFamily:"var(--mono)",fontSize:12,letterSpacing:".06em",opacity:.9}}>
                {watermarkText}
              </div>
            )}
          </div>
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}}>
            {signed.map((p,i)=>(
              <button key={p+i} className={`btn small ${i===idx?"primary":""}`} onClick={()=>setIdx(i)} style={{padding:0,overflow:"hidden"}}>
                <div className="imgGuard" style={{width:"100%"}}><img src={p} alt="" style={{width:"100%",height:90,objectFit:"cover"}}/></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
