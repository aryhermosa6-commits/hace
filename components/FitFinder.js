import { useMemo, useState } from "react";
function recommend(chart, height, weight, fit){
  if(!chart?.length) return null;
  const h=Number(height||0), w=Number(weight||0); if(!h||!w) return null;
  const bmi = w / Math.pow(h/100,2);
  const score = bmi + (fit==="oversize" ? -1.2 : fit==="tight" ? 1.4 : 0);
  const idx = score < 20 ? 1 : score < 23 ? 2 : score < 26 ? 3 : score < 29 ? 4 : 5;
  const sizes=chart.map(x=>x.size);
  return sizes[Math.min(sizes.length-1, Math.max(0, idx-1))];
}
export default function FitFinder({ chart=[] }){
  const [height,setHeight]=useState(""); const [weight,setWeight]=useState(""); const [fit,setFit]=useState("regular");
  const out=useMemo(()=>recommend(chart,height,weight,fit),[chart,height,weight,fit]);
  return (
    <div className="card cardPad">
      <div className="h2" style={{margin:0,fontSize:16}}>FIT FINDER</div>
      <div className="small">Input tinggi/berat + fit → rekomendasi size (heuristic).</div>
      <div className="row" style={{marginTop:10}}>
        <input className="input" style={{width:160}} placeholder="Tinggi (cm)" value={height} onChange={(e)=>setHeight(e.target.value)} />
        <input className="input" style={{width:160}} placeholder="Berat (kg)" value={weight} onChange={(e)=>setWeight(e.target.value)} />
        <select className="input" style={{width:180}} value={fit} onChange={(e)=>setFit(e.target.value)}>
          <option value="tight">Tight</option><option value="regular">Regular</option><option value="oversize">Oversize</option>
        </select>
      </div>
      {out && <div className="row" style={{marginTop:12}}><div className="badge" style={{borderColor:"rgba(184,255,0,.35)"}}>RECOMMENDED: <b style={{marginLeft:6}}>{out}</b></div><div className="small">Perkiraan, cek size chart juga.</div></div>}
    </div>
  );
}
