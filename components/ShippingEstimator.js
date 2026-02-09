import { useMemo, useState } from "react";
function estimate(city){
  const c=(city||"").toLowerCase().trim(); if(!c) return null;
  if(c.includes("ponorogo")||c.includes("pacitan")||c.includes("madiun")) return {days:"1–3 hari",cost:"Rp 10k–18k"};
  if(c.includes("surabaya")||c.includes("malang")||c.includes("sidoarjo")) return {days:"2–4 hari",cost:"Rp 12k–22k"};
  if(c.includes("jakarta")||c.includes("bekasi")||c.includes("depok")||c.includes("tangerang")) return {days:"2–5 hari",cost:"Rp 15k–28k"};
  if(c.includes("bali")||c.includes("denpasar")) return {days:"3–6 hari",cost:"Rp 18k–35k"};
  return {days:"3–7 hari",cost:"Rp 18k–40k"};
}
export default function ShippingEstimator(){
  const [city,setCity]=useState("");
  const [mode, setMode] = useState('delivery');
  const [zone, setZone] = useState('');
  const out=useMemo(() => {
    if (mode === 'delivery') return estimate(city);
    return null;
  }, [city, mode]);
  const estimateZone = (z) => {
    const key = (z || '').toLowerCase();
    if (!key) return null;
    if (key === 'java') return { days: '1–3 hari', cost: 'Rp 10k–20k' };
    if (key === 'bali') return { days: '3–6 hari', cost: 'Rp 18k–35k' };
    if (key === 'sumatra') return { days: '4–7 hari', cost: 'Rp 20k–45k' };
    if (key === 'kalimantan') return { days: '5–8 hari', cost: 'Rp 22k–50k' };
    return { days: '5–10 hari', cost: 'Rp 25k–60k' };
  };
  const zoneOut = useMemo(() => estimateZone(zone), [zone]);
  return (
    <div className="card cardPad">
      <div className="row" style={{justifyContent:"space-between"}}>
        <div><div className="h2" style={{margin:0,fontSize:16}}>SHIPPING</div><div className="small">Estimasi & opsi pengambilan.</div></div>
        <div className="row" style={{ gap: 6 }}>
          <button className={`btn small ${mode === 'delivery' ? 'primary' : ''}`} onClick={() => setMode('delivery')}>Delivery</button>
          <button className={`btn small ${mode === 'pickup' ? 'primary' : ''}`} onClick={() => setMode('pickup')}>Pickup</button>
        </div>
      </div>
      {mode === 'delivery' && (
        <>
          <div style={{marginTop:10}}>
            <input className="input" placeholder="cth: Ponorogo / Surabaya / Jakarta" value={city} onChange={(e)=>setCity(e.target.value)} />
          </div>
          {out && <div className="row" style={{marginTop:12}}><div className="badge">⏱ {out.days}</div><div className="badge">💸 {out.cost}</div></div>}
          <div style={{ marginTop: 12 }}>
            <div className="small">Atau pilih zona:</div>
            <select className="input" value={zone} onChange={(e) => setZone(e.target.value)}>
              <option value="">-- Zona --</option>
              <option value="Java">Pulau Jawa</option>
              <option value="Bali">Bali</option>
              <option value="Sumatra">Sumatra</option>
              <option value="Kalimantan">Kalimantan</option>
            </select>
            {zoneOut && <div className="row" style={{marginTop:8}}><div className="badge">⏱ {zoneOut.days}</div><div className="badge">💸 {zoneOut.cost}</div></div>}
          </div>
        </>
      )}
      {mode === 'pickup' && (
        <div style={{ marginTop: 12 }}>
          <div className="badge">📍 Pickup di Ponorogo HQ</div>
          <div className="small" style={{ marginTop: 8 }}>Jl. Contoh No. 123, Ponorogo</div>
          <div className="small">Biaya kirim 0 — ambil sendiri.</div>
        </div>
      )}
    </div>
  );
}
