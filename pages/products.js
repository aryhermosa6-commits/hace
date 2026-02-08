import Head from "next/head";
import { useMemo, useState } from "react";
import HeaderNav from "../components/HeaderNav";
import ProductCard from "../components/ProductCard";
import GalleryModal from "../components/GalleryModal";
import Reveal from "../components/Reveal";

export default function Products({ __ctx }){
  const ctx=__ctx||{}; const data=ctx.data;
  const [batch,setBatch]=useState("ALL"); const [status,setStatus]=useState("ALL"); const [type,setType]=useState("ALL"); const [q,setQ]=useState("");
  const [gallery,setGallery]=useState({open:false,p:null});

  const batches=useMemo(()=>{ const set=new Set((data?.products||[]).map(p=>p.batch).filter(Boolean)); return ["ALL", ...Array.from(set)]; },[data]);
  const filtered=useMemo(()=>{
    const list=data?.products||[]; const qq=q.trim().toLowerCase();
    return list.filter(p=>{
      if(batch!=="ALL" && p.batch!==batch) return false;
      if(status!=="ALL" && String(p.status).toUpperCase()!==status) return false;
      if(type!=="ALL" && String(p.type).toUpperCase()!==type) return false;
      if(qq){
        const s=(p.title_id+" "+p.title_en+" "+p.desc_id+" "+p.desc_en).toLowerCase();
        if(!s.includes(qq)) return false;
      }
      return true;
    });
  },[data,batch,status,type,q]);

  if(!data) return <div className="container"><div className="card cardPad">Loading…</div></div>;

  return (
    <>
      <Head><title>Products — Ponorogo Hardcore</title></Head>
      <HeaderNav ctx={ctx} />
      <div className="container">
        <Reveal>
          <div className="card cardPad">
            <div className="row" style={{justifyContent:"space-between"}}>
              <div><div className="h2">FILTER</div><p className="p">Batch selector + filter + search.</p></div>
              <div className="badge">/products</div>
            </div>
            <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",marginTop:12}}>
              <div><div className="label">Batch</div><select className="input" value={batch} onChange={(e)=>setBatch(e.target.value)}>{batches.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
              <div><div className="label">Status</div><select className="input" value={status} onChange={(e)=>setStatus(e.target.value)}>{["ALL","READY","PO","SOLD OUT"].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              <div><div className="label">Type</div><select className="input" value={type} onChange={(e)=>setType(e.target.value)}>{["ALL","TEE","LONGSLEEVE"].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              <div><div className="label">Search</div><input className="input" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="search…" /></div>
            </div>
          </div>
        </Reveal>

        <div style={{height:16}} />

        <Reveal>
          <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
            {filtered.map(p=> <ProductCard key={p.slug} p={p} lang={ctx.lang} onOpenGallery={(pp)=>setGallery({open:true,p:pp})} />)}
          </div>
        </Reveal>
      </div>

      <GalleryModal open={gallery.open} onClose={()=>setGallery({open:false,p:null})} title={gallery.p?(ctx.lang==="en"?gallery.p.title_en:gallery.p.title_id):""} images={gallery.p?.images||[]} watermarkText={""} />
    </>
  );
}
