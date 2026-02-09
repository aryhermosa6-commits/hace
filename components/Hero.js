import { useEffect, useState } from "react";
import GlitchText from "./GlitchText";
import DropCountdown from "./DropCountdown";
import { signImageURL } from "../lib/signedImg";
import { strings } from "../lib/i18n";

function getOrSetAB(){
  const key="phc_ab";
  let v=document.cookie.split("; ").find(r=>r.startsWith(key+"="))?.split("=")[1];
  if(v!=="A" && v!=="B"){ v=Math.random()<0.5?"A":"B"; document.cookie=`${key}=${v}; Path=/; Max-Age=${60*60*24*14}; SameSite=Lax`; }
  return v;
}

export default function Hero({ ctx }){
  const s=ctx?.data?.settings||{}; const t=strings[ctx.lang]||strings.id;
  const [ab,setAb]=useState("A");
  const [videoReady,setVideoReady]=useState(false);
  const [videoFail,setVideoFail]=useState(false);
  const [signedLogo,setSignedLogo]=useState(null);

  useEffect(()=>setAb(getOrSetAB()),[]);

  // sign logo image so that the logo uses a signed URL with expiry
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        const u=await signImageURL("/images/logo.png");
        if(alive) setSignedLogo(u);
      }catch(e){}
    })();
    return ()=>{alive=false};
  },[]);
  const isA=ab==="A";
  const headline=isA?"DROP / OPEN PO / PONOROGO":"OPEN PO — PIT READY — PONOROGO";
  const sub=isA?"Brutal drop. No checkout. Order via WA/IG.":"Fast order flow. Built for mobile. WA builder ready.";

  // Dynamic crowd chant subtitle. Each time the component mounts, pick a random
  // chant from the list. It appears under the subheading and rotates on
  // subsequent mounts.
  const chantLines = [
    'Support your local scene',
    'No gods. No masters.',
    'Ponorogo Hardcore Lives',
    'DIY till death',
    'Stay brutal, stay kind'
  ];
  const [chant] = useState(() => chantLines[Math.floor(Math.random() * chantLines.length)]);

  const wa=async ()=>{
    try{ await fetch("/api/track/click",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({type:"hero_wa_click",variant:ab,path:location.pathname,t:Date.now()})}); }catch(e){}
    const n=String(s.waNumber||"").replace(/[^0-9]/g,""); window.open(`https://wa.me/${n}`, "_blank");
  };
  const ig=async ()=>{
    try{ await fetch("/api/track/click",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({type:"hero_ig_click",variant:ab,path:location.pathname,t:Date.now()})}); }catch(e){}
    window.open(`https://instagram.com/${s.igHandle||"ponorogohardcore"}`, "_blank");
  };

  const showVideo = videoReady && !videoFail;

  return (
    <div className="container">
      <div className="hero" style={{minHeight:430}}>
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/media/hero.mp4"
          style={{display: showVideo ? "block" : "none"}}
          onCanPlay={()=>setVideoReady(true)}
          onError={()=>{ setVideoFail(true); }}
        />
        <div
          className="fallback"
          style={{
            background:"radial-gradient(circle at 20% 20%, rgba(184,255,0,.12), transparent 55%), radial-gradient(circle at 80% 40%, rgba(255,23,68,.10), transparent 60%), rgba(0,0,0,.35)",
            opacity: showVideo ? 0 : 1,
            transition:"opacity .35s ease"
          }}
        />
        <div className="overlay" /><div className="vhs" />
        <div className="content">
          <div className="topbar">
            <div className="row">
              <div className="logo3d"><img src={signedLogo || "/images/logo.png"} alt="logo" onDragStart={(e)=>e.preventDefault()} /></div>
              <div className="badge">{t.drop} • {ab}</div>
              <DropCountdown closeAtISO={s.poCloseAt} />
            </div>
            <div className="row">
              <button className="btn ticket primary" onClick={wa}>{t.order_wa}</button>
              <button className="btn ticket" onClick={ig}>{t.order_ig}</button>
            </div>
          </div>
          <div style={{marginTop:26}}>
            <div className="h1"><GlitchText>{headline}</GlitchText></div>
            <p className="p" style={{maxWidth:720}}>{sub}</p>
            <p className="p crowdChant" style={{maxWidth:720, marginTop:4, fontStyle:'italic'}}>{chant}</p>
            <div className="row" style={{marginTop:14}}>
              <div className="badge">A/B HERO ACTIVE</div>
              <div className="badge">TYPE: {s.brand || "PONOROGO HARDCORE"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
