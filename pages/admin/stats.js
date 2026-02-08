import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import HeaderNav from "../../components/HeaderNav";

async function api(path){
  const res=await fetch(path);
  const j=await res.json().catch(()=>null);
  return { res, j };
}
function groupByDay(events){
  const m=new Map();
  for(const e of events){
    const d=new Date(e.t||Date.now());
    const key=d.toISOString().slice(0,10);
    m.set(key,(m.get(key)||0)+1);
  }
  return Array.from(m.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
}
function groupByVariant(events, type){
  const m={A:0,B:0};
  for(const e of events){
    if(type && e.type!==type) continue;
    const v=(e.variant==="B")?"B":"A"; m[v]+=1;
  }
  return m;
}
function groupBySlug(events){
  const m=new Map();
  for(const e of events){
    const slug=e.slug || (e.items?.[0]?.slug) || "";
    if(!slug) continue;
    m.set(slug,(m.get(slug)||0)+1);
  }
  return Array.from(m.entries()).sort((a,b)=>b[1]-a[1]);
}
function LineChart({ points, height=140 }){
  const w=640, pad=22;
  const max=Math.max(1,...points.map(p=>p[1]));
  const xs=points.map((p,i)=>pad+(i*(w-pad*2)/Math.max(1,points.length-1)));
  const ys=points.map(p=>pad+(height-pad*2)*(1-(p[1]/max)));
  const d=points.map((p,i)=>`${i===0?"M":"L"} ${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} style={{display:"block"}}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      {points.map((p,i)=>(
        <g key={i}>
          <circle cx={xs[i]} cy={ys[i]} r="3.2" fill="currentColor" />
          <text x={xs[i]} y={height-6} fontSize="10" textAnchor="middle" fill="rgba(242,242,242,.6)" fontFamily="monospace">{p[0].slice(5)}</text>
        </g>
      ))}
    </svg>
  );
}
function Heatmap({ events, path="/", width=640, height=320 }){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    ctx.clearRect(0,0,width,height);
    const pts=events.filter(e=>e.path===path);
    for(const e of pts){
      const x=e.x*width, y=e.y*height, r=34;
      const grd=ctx.createRadialGradient(x,y,0,x,y,r);
      grd.addColorStop(0,"rgba(184,255,0,0.35)");
      grd.addColorStop(1,"rgba(184,255,0,0)");
      ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
    ctx.fillStyle="rgba(255,255,255,0.05)";
    for(let yy=0;yy<height;yy+=8) ctx.fillRect(0,yy,width,1);
  },[events,path,width,height]);
  return <div className="card" style={{overflow:"hidden"}}><canvas ref={ref} width={width} height={height} style={{width:"100%",height:"auto",display:"block",background:"rgba(255,255,255,.03)"}} /></div>;
}

export default function Stats({ __ctx }){
  const ctx=__ctx||{};
  const [stats,setStats]=useState(null);
  const [route,setRoute]=useState("/");
  useEffect(()=>{ (async()=>{ const { j }=await api("/api/admin/stats"); if(!j?.ok) location.href="/admin"; else setStats(j); })(); },[]);
  const clicks=stats?.clicks?.events||[]; const heat=stats?.heat?.events||[];
  const byDay=useMemo(()=>groupByDay(clicks),[clicks]);
  const waByVar=useMemo(()=>groupByVariant(clicks,"wa_open"),[clicks]);
  const heroWAVar=useMemo(()=>groupByVariant(clicks,"hero_wa_click"),[clicks]);
  const top=useMemo(()=>groupBySlug(clicks),[clicks]);
  const routes=useMemo(()=>Array.from(new Set(heat.map(e=>e.path))).sort(),[heat]);

  if(!stats) return (<><HeaderNav ctx={ctx} /><div className="container"><div className="card cardPad">Loading…</div></div></>);

  return (
    <>
      <Head><title>Admin Stats — Ponorogo Hardcore</title></Head>
      <HeaderNav ctx={ctx} />
      <div className="container">
        <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
          <div className="card cardPad">
            <div className="h2" style={{marginTop:0,fontSize:16}}>CLICK VOLUME / DAY</div>
            <div className="small">Dari clicks.json</div>
            <div style={{marginTop:10}}><LineChart points={byDay.slice(-10)} /></div>
          </div>
          <div className="card cardPad">
            <div className="h2" style={{marginTop:0,fontSize:16}}>A/B HERO → WA</div>
            <div className="small">hero_wa_click per variant</div>
            <div className="row" style={{marginTop:12}}>
              <div className="badge">A: <b style={{marginLeft:6}}>{heroWAVar.A}</b></div>
              <div className="badge">B: <b style={{marginLeft:6}}>{heroWAVar.B}</b></div>
            </div>
          </div>
          <div className="card cardPad">
            <div className="h2" style={{marginTop:0,fontSize:16}}>WA OPEN (BUILDER)</div>
            <div className="small">wa_open per variant</div>
            <div className="row" style={{marginTop:12}}>
              <div className="badge">A: <b style={{marginLeft:6}}>{waByVar.A}</b></div>
              <div className="badge">B: <b style={{marginLeft:6}}>{waByVar.B}</b></div>
            </div>
          </div>
          <div className="card cardPad">
            <div className="h2" style={{marginTop:0,fontSize:16}}>TOP PRODUCTS</div>
            <div className="small">Berdasar slug/items</div>
            <div style={{marginTop:10}}>
              {top.slice(0,8).map(([k,v])=>(
                <div key={k} className="row" style={{justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,.08)",padding:"8px 0"}}>
                  <div className="small">{k}</div><div className="badge">{v}</div>
                </div>
              ))}
              {!top.length && <div className="small">Belum ada data.</div>}
            </div>
          </div>
        </div>

        <div style={{height:16}} />

        <div className="card cardPad">
          <div className="row" style={{justifyContent:"space-between"}}>
            <div><div className="h2" style={{marginTop:0}}>HEATMAP</div><div className="small">Klik area paling sering dipencet.</div></div>
            <div className="row">
              <select className="input" style={{width:220}} value={route} onChange={(e)=>setRoute(e.target.value)}>
                {routes.map(r=><option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginTop:12}}><Heatmap events={heat} path={route} /></div>
        </div>

        <div style={{height:16}} />
        <div className="small">Export email CSV: buka <span className="kbd">/api/email/export</span> (butuh login).</div>
      </div>
    </>
  );
}
