import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signImageURL } from "../lib/signedImg";
function statusClass(s){ const x=String(s||"").toUpperCase(); if(x==="READY") return "ready"; if(x==="SOLD OUT") return "sold"; return "po"; }
export default function ProductCard({ p, lang="id", onOpenGallery }){
  const [sigUrl,setSigUrl]=useState(null);
  const [sigBack,setSigBack]=useState(null);
  const [flip,setFlip]=useState(0);
  // favourite state
  const [fav, setFav] = useState(false);

  // detect mobile screen to disable heavy tilt and flip interactions
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  const cardRef=useRef(null);
  const drag=useRef({ on:false,x0:0,v0:0 });
  const title=lang==="en"?p.title_en:p.title_id;

  // Choose a sticker label for the product. A deterministic but varied
  // label is chosen based on the product slug. These labels convey
  // scarcity or hype without relying on dynamic inventory.
  const labelMap = {
    'baju-tee': 'NEW DROP',
    'longsleeve': 'HOT ITEM'
  };
  const sticker = labelMap[p.slug] || (p.status === 'SOLD OUT' ? 'SOLD OUT' : 'LIMITED');

  // Micro badges: display extra labels like Preorder, Low Stock, Last Call, Ready.
  const microBadges = [];
  if (p.status === 'PO') microBadges.push('PREORDER');
  if (p.status === 'READY') microBadges.push('READY');
  if (p.status === 'SOLD OUT') microBadges.push('RESTOCK SOON');
  // deterministic pseudo-random extra badges using slug length
  const sum = [...p.slug].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  if (sum % 3 === 0) microBadges.push('LOW STOCK');
  if (sum % 5 === 0) microBadges.push('LAST CALL');


  useEffect(()=>{ let alive=true; (async()=>{ try{ const u=await signImageURL(p.images?.[0]||""); if(alive) setSigUrl(u); }catch(e){} })(); return ()=>{alive=false}; },[p.images]);
  // sign back image separately so that preview uses signed URL
  useEffect(()=>{ let alive=true; (async()=>{ try{ const u=await signImageURL(p.images?.[1]||""); if(alive) setSigBack(u); }catch(e){} })(); return ()=>{alive=false}; },[p.images]);
  const imgFront = sigUrl || p.images?.[0];
  // If no back image is available, fall back to the front image so the flip effect still shows something.
  const imgBack = sigBack || p.images?.[1] || p.images?.[0];

  // init favourite state based on localStorage
  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem('phc_favs') || '[]');
      setFav(arr.includes(p.slug));
    } catch(e) {
      setFav(false);
    }
  }, [p.slug]);

  const toggleFav = () => {
    try {
      let arr = JSON.parse(localStorage.getItem('phc_favs') || '[]');
      if (arr.includes(p.slug)) {
        arr = arr.filter((s) => s !== p.slug);
      } else {
        arr = [...arr, p.slug];
      }
      localStorage.setItem('phc_favs', JSON.stringify(arr));
      setFav(arr.includes(p.slug));
    } catch(e) {
      setFav((v) => !v);
    }
  };

  const onMouseMove=(e)=>{
    if (isMobile) return;
    const el=cardRef.current; if(!el) return;
    const r=el.getBoundingClientRect();
    const mx=((e.clientX-r.left)/r.width)*100, my=((e.clientY-r.top)/r.height)*100;
    const ry=((e.clientX-(r.left+r.width/2))/(r.width/2))*7;
    const rx=-((e.clientY-(r.top+r.height/2))/(r.height/2))*7;
    el.style.setProperty("--mx", `${mx}%`); el.style.setProperty("--my", `${my}%`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`); el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
  };
  const onLeave=()=>{ const el=cardRef.current; if(!el) return; el.style.setProperty("--ry","0deg"); el.style.setProperty("--rx","0deg"); el.style.setProperty("--mx","50%"); el.style.setProperty("--my","50%"); };

  const onPointerDown = (e) => {
    if (isMobile) return;
    drag.current = { on: true, x0: e.clientX, v0: flip };
    (e.target?.setPointerCapture?.(e.pointerId))?.();
  };
  const onPointerMove = (e) => {
    if (isMobile) return;
    if (!drag.current.on) return;
    const dx = e.clientX - drag.current.x0;
    const v = Math.min(180, Math.max(0, drag.current.v0 + dx * 0.45));
    setFlip(v);
  };
  const onPointerUp = () => {
    if (isMobile) return;
    drag.current.on = false;
    setFlip(prev => (prev > 90 ? 180 : 0));
  };

  return (
    <div ref={cardRef} className="card cardDamage" style={{position:"relative",overflow:"hidden"}} onMouseMove={onMouseMove} onMouseLeave={onLeave}>
      <div className="cardPad tilt" style={{padding:14,position:"relative"}}>
        {/* favourite star */}
        <div style={{ position: 'absolute', top: 6, right: 8, zIndex: 5 }}>
          <button
            onClick={toggleFav}
            style={{ background: 'none', border: 'none', color: fav ? 'var(--accent)' : 'rgba(255,255,255,.5)', fontSize: 20, lineHeight: 1, cursor: 'pointer' }}
            aria-label="Favourite"
          >
            ★
          </button>
        </div>
        <div className="row" style={{justifyContent:"space-between"}}>
          <div className={`badge ${statusClass(p.status)}`}>{String(p.status||"PO").toUpperCase()}</div>
          <div className="badge">{p.batch||"DROP"}</div>
        </div>

        <div
          style={{ marginTop: 12, position: "relative", borderRadius: 16, border: "1px solid rgba(255,255,255,.12)", overflow: "hidden" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="imgGuard" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}>
            {/* For mobile devices, disable the 3D flip and show only the front image. On larger screens, keep the flip effect. */}
            {isMobile ? (
              <img src={imgFront} alt={title} style={{ width: "100%", height: 260, objectFit: "cover" }} />
            ) : (
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transform: `perspective(1100px) rotateY(${flip}deg)`,
                  transition: drag.current.on ? "none" : "transform .22s ease",
                }}
              >
                <div style={{ backfaceVisibility: "hidden" }}>
                  <img src={imgFront} alt={title} style={{ width: "100%", height: 260, objectFit: "cover" }} />
                </div>
                <div
                  style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                >
                  <img src={imgBack} alt="" style={{ width: "100%", height: 260, objectFit: "cover" }} />
                </div>
              </div>
            )}
          </div>
          <div className="sweep" />
          {/* Sticker label overlay */}
          <div className="stickerLabel">{sticker}</div>
          {/* Merch tag overlay */}
          <div className="merchTag">Heavy Cotton</div>
        </div>

        <div style={{marginTop:12}}>
          <div className="h2" style={{margin:0,fontSize:18}}>{title}</div>
          <div className="small" style={{marginTop:6}}>Rp {Number(p.price||0).toLocaleString("id-ID")}</div>
        </div>

        <div className="row" style={{marginTop:12}}>
          <Link className="btn small primary" href={`/product/${p.slug}`}>DETAIL</Link>
          <button className="btn small" onClick={()=>onOpenGallery?.(p)}>GALLERY</button>
        </div>

        {/* micro badges row */}
        {microBadges.length > 0 && (
          <div className="row" style={{ marginTop: 8, gap: 6 }}>
            {microBadges.map((m) => (
              <div key={m} className="miniBadge">{m}</div>
            ))}
          </div>
        )}

        <div className="small" style={{marginTop:12,opacity:.9}}>Drag gambar buat flip depan/belakang.</div>
      </div>
    </div>
  );
}
