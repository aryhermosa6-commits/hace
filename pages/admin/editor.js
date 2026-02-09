import Head from "next/head";
import { useEffect, useState } from "react";
import HeaderNav from "../../components/HeaderNav";

async function api(path, opts){
  const res = await fetch(path, opts);
  const j = await res.json().catch(()=>null);
  return { res, j };
}

export default function Editor({ __ctx }){
  const ctx=__ctx||{};
  const [doc,setDoc]=useState(null);
  const [msg,setMsg]=useState("");

  useEffect(()=>{
    (async()=>{
      const { j } = await api("/api/admin/products");
      if(j?.ok) setDoc(j.doc);
      else location.href="/admin";
    })();
  },[]);

  const save=async ()=>{
    setMsg("");
    const { j } = await api("/api/admin/products",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({doc})});
    setMsg(j?.ok ? "SAVED" : (j?.error || "FAIL"));
  };

  if(!doc) return (<><HeaderNav ctx={ctx} /><div className="container"><div className="card cardPad">Loading…</div></div></>);

  return (
    <>
      <Head><title>Admin Editor — Ponorogo Hardcore</title></Head>
      <HeaderNav ctx={ctx} />
      <div className="container">
        <div className="card cardPad">
          <div className="row" style={{justifyContent:"space-between"}}>
            <div><div className="h2" style={{marginTop:0}}>EDITOR</div><p className="p">Edit settings + produk tanpa edit file.</p></div>
            <button className="btn primary" onClick={save}>SAVE</button>
          </div>
          {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
        </div>

        <div style={{height:12}} />

        <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
          <div className="card cardPad">
            <div className="h2" style={{marginTop:0,fontSize:16}}>SETTINGS</div>

            <div className="label">Brand</div>
            <input className="input" value={doc.settings.brand} onChange={(e)=>setDoc(d=>({...d,settings:{...d.settings,brand:e.target.value}}))} />

            <div className="label" style={{marginTop:10}}>WA Number</div>
            <input className="input" value={doc.settings.waNumber} onChange={(e)=>setDoc(d=>({...d,settings:{...d.settings,waNumber:e.target.value}}))} />

            <div className="label" style={{marginTop:10}}>IG Handle</div>
            <input className="input" value={doc.settings.igHandle} onChange={(e)=>setDoc(d=>({...d,settings:{...d.settings,igHandle:e.target.value}}))} />

            <div className="label" style={{marginTop:10}}>PO Close At (ISO)</div>
            <input className="input" value={doc.settings.poCloseAt} onChange={(e)=>setDoc(d=>({...d,settings:{...d.settings,poCloseAt:e.target.value}}))} />

            <div className="label" style={{marginTop:10}}>Bundle Discount (Rp)</div>
            <input className="input" type="number" value={doc.settings.bundleDiscount} onChange={(e)=>setDoc(d=>({...d,settings:{...d.settings,bundleDiscount:Number(e.target.value||0)}}))} />

            <div className="small" style={{marginTop:10}}>Note: #16 testimoni & #19 preorder queue sengaja ga dibuat (sesuai request).</div>
          </div>

          <div className="card cardPad">
            <div className="h2" style={{marginTop:0,fontSize:16}}>PRODUCTS JSON</div>
            <p className="small">Edit cepat via JSON. Hati-hati koma & kutip.</p>
            <textarea className="input" style={{height:520,fontFamily:"var(--mono)",fontSize:12}} value={JSON.stringify(doc.products, null, 2)} onChange={(e)=>{
              try{ setDoc(d=>({...d,products:JSON.parse(e.target.value)})); setMsg(""); }catch(err){ setMsg("JSON INVALID"); }
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
