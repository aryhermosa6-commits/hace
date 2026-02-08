import { useMemo, useState } from "react";
export default function BundleBuilder({ waNumber, products=[], discount=10000, lang="id", variant="A" }){
  const tee=products.find(p=>p.type==="TEE"); const ls=products.find(p=>p.type==="LONGSLEEVE");
  const [teeSize,setTeeSize]=useState("M"); const [lsSize,setLsSize]=useState("M"); const [on,setOn]=useState(true);
  const total=useMemo(()=>{ if(!on) return 0; const a=Number(tee?.price||0), b=Number(ls?.price||0); return Math.max(0,a+b-discount); },[on,tee?.price,ls?.price,discount]);
  const open=async ()=>{
    if(!tee||!ls) return;
    const lines=[];
    lines.push("PONOROGO HARDCORE — BUNDLE ORDER"); lines.push(`Variant: ${variant}`); lines.push("");
    lines.push(`- ${(lang==="en"?tee.title_en:tee.title_id)} | Size ${teeSize} | Qty 1`);
    lines.push(`- ${(lang==="en"?ls.title_en:ls.title_id)} | Size ${lsSize} | Qty 1`);
    lines.push(""); lines.push(`Bundle Discount: Rp ${discount.toLocaleString("id-ID")}`);
    lines.push(`TOTAL: Rp ${total.toLocaleString("id-ID")}`); lines.push(""); lines.push("Kirim alamat + no HP ya.");
    const msg=lines.join("\n");
    try{ await fetch("/api/track/click",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({type:"bundle_wa_open",variant,items:[{slug:tee.slug,size:teeSize,qty:1},{slug:ls.slug,size:lsSize,qty:1}],t:Date.now()})}); }catch(e){}
    const n=String(waNumber||"").replace(/[^0-9]/g,"");
    window.open(`https://wa.me/${n}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  if(!tee||!ls) return null;
  return (
    <div className="card cardPad">
      <div className="row" style={{justifyContent:"space-between"}}>
        <div><div className="h2" style={{margin:0,fontSize:16}}>BUNDLE BUILDER</div><div className="small">Baju + Longsleeve → diskon + pesan WA.</div></div>
        <div className="badge">DISCOUNT: Rp {discount.toLocaleString("id-ID")}</div>
      </div>
      <div className="row" style={{marginTop:12}}><label className="badge"><input type="checkbox" checked={on} onChange={(e)=>setOn(e.target.checked)} />&nbsp;Enable bundle</label></div>
      {on && (
        <>
          <div className="grid" style={{marginTop:12,gridTemplateColumns:"repeat(auto-fit, minmax(240px,1fr))"}}>
            <div className="card cardPad" style={{padding:12}}>
              <div style={{fontWeight:900}}>{lang==="en"?tee.title_en:tee.title_id}</div>
              <div className="row" style={{marginTop:10}}>
                <select className="input" value={teeSize} onChange={(e)=>setTeeSize(e.target.value)}>{(tee.sizeChart||[]).map(r=><option key={r.size} value={r.size}>{r.size}</option>)}</select>
                <div className="small">Qty 1</div>
              </div>
            </div>
            <div className="card cardPad" style={{padding:12}}>
              <div style={{fontWeight:900}}>{lang==="en"?ls.title_en:ls.title_id}</div>
              <div className="row" style={{marginTop:10}}>
                <select className="input" value={lsSize} onChange={(e)=>setLsSize(e.target.value)}>{(ls.sizeChart||[]).map(r=><option key={r.size} value={r.size}>{r.size}</option>)}</select>
                <div className="small">Qty 1</div>
              </div>
            </div>
          </div>
          <div className="row" style={{marginTop:12}}>
            <div className="badge">TOTAL: <b style={{marginLeft:6}}>Rp {total.toLocaleString("id-ID")}</b></div>
            <button className="btn primary" onClick={open}>ORDER BUNDLE VIA WA</button>
          </div>
        </>
      )}
    </div>
  );
}
