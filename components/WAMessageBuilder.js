import { useMemo, useState, useEffect } from "react";
function waLink(number, text, referral){
  const n = String(number || '').replace(/[^0-9]/g, '');
  let url = `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
  // add basic UTM and referral tracking
  url += '&utm_source=wa';
  if (referral) url += `&referral=${encodeURIComponent(referral)}`;
  return url;
}
export default function WAMessageBuilder({ waNumber, products=[], lang="id", variant="A" }){
  const [sel,setSel]=useState(()=>products.map(p=>({slug:p.slug,size:"M",qty:0})));
  const [note,setNote]=useState(""); const [name,setName]=useState("");
  // store optional referral code for tracking or discounts
  const [referral,setReferral] = useState("");
  const msg=useMemo(()=>{
    const lines=[]; lines.push("PONOROGO HARDCORE — ORDER");
    if(name.trim()) lines.push(`Nama: ${name.trim()}`);
    lines.push(`Variant: ${variant}`); lines.push("");
    let any=false;
    for(const s of sel){
      if(!s.qty) continue;
      const p=products.find(x=>x.slug===s.slug); if(!p) continue;
      any=true; const title=lang==="en"?p.title_en:p.title_id;
      lines.push(`- ${title} | Size ${s.size} | Qty ${s.qty}`);
    }
    if(!any) lines.push("- (pilih item dulu)");
    if(note.trim()){ lines.push(""); lines.push(`Catatan: ${note.trim()}`); }
    if(referral.trim()) { lines.push(""); lines.push(`Referral: ${referral.trim()}`); }
    lines.push(""); lines.push("Kirim alamat + no HP ya.");
    return lines.join("\n");
  },[sel,products,note,name,lang,variant,referral]);

  // Persist selected items to localStorage for mini cart summary
  useEffect(() => {
    try {
      const cart = sel.filter((x) => x.qty > 0);
      localStorage.setItem('phc_cart', JSON.stringify(cart));
      // notify listeners in the same tab
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('phc_cart'));
      }
    } catch (e) {}
  }, [sel]);

  const openWA=async ()=>{
    try{ await fetch("/api/track/click",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({type:"wa_open",variant,items:sel.filter(x=>x.qty>0),t:Date.now()})}); }catch(e){}
    window.open(waLink(waNumber,msg,referral), "_blank");
  };
  const copy=async ()=>{ try{ await navigator.clipboard.writeText(msg); }catch(e){} };

  return (
    <div className="card cardPad">
      <div className="row" style={{justifyContent:"space-between"}}>
        <div><div className="h2" style={{margin:0,fontSize:16}}>WA MESSAGE BUILDER</div><div className="small">Pilih item → auto teks WA.</div></div>
        <div className="badge">WA: {waNumber}</div>
      </div>

      <div className="grid" style={{marginTop:12}}>
        <div><div className="label">Nama (opsional)</div><input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Diaz" /></div>

        {products.map((p,idx)=>(
          <div key={p.slug} className="card cardPad" style={{padding:12}}>
            <div className="row" style={{justifyContent:"space-between"}}>
              <div style={{fontWeight:900}}>{lang==="en"?p.title_en:p.title_id}</div>
              <div className="small">Rp {Number(p.price||0).toLocaleString("id-ID")}</div>
            </div>
            <div className="row" style={{marginTop:10}}>
              <select className="input" style={{width:120}} value={sel[idx]?.size} onChange={(e)=>{
                const v=e.target.value; setSel(prev=>prev.map((x,i)=>i===idx?{...x,size:v}:x));
              }}>
                {(p.sizeChart||[]).map(r=><option key={r.size} value={r.size}>{r.size}</option>)}
              </select>
              <input className="input" style={{width:120}} type="number" min="0" value={sel[idx]?.qty} onChange={(e)=>{
                const v=Math.max(0,Number(e.target.value||0)); setSel(prev=>prev.map((x,i)=>i===idx?{...x,qty:v}:x));
              }} />
              <div className="small">Qty</div>
            </div>
          </div>
        ))}

        <div><div className="label">Catatan (opsional)</div><textarea className="input" rows={3} value={note} onChange={(e)=>setNote(e.target.value)} placeholder="warna / request / dll" /></div>
        <div><div className="label">Referral Code (opsional)</div><input className="input" value={referral} onChange={(e)=>setReferral(e.target.value)} placeholder="REF123" /></div>

        <div className="row"><button className="btn primary" onClick={openWA}>OPEN WA</button><button className="btn" onClick={copy}>COPY TEXT</button></div>

        <div className="card cardPad receipt" style={{padding:12}}>
          <div className="label">Preview</div>
          <pre className="receiptText">{msg}</pre>
        </div>
      </div>
    </div>
  );
}
