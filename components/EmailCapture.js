import { useState } from "react";
export default function EmailCapture({ label="DROP ALERT LIST", placeholder="email kamu" }){
  const [email,setEmail]=useState(""); const [msg,setMsg]=useState("");
  const submit=async ()=>{
    setMsg("");
    const e=email.trim(); if(!e||!e.includes("@")){ setMsg("Email invalid"); return; }
    const res=await fetch("/api/email/subscribe",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({email:e,t:Date.now()})});
    const j=await res.json().catch(()=>null);
    if(j?.ok){ setMsg("OK — masuk list"); setEmail(""); } else setMsg(j?.error||"Gagal");
  };
  return (
    <div className="card cardPad">
      <div className="row" style={{justifyContent:"space-between"}}>
        <div><div className="h2" style={{margin:0,fontSize:16}}>{label}</div><div className="small">Email capture (opsional) + export CSV di admin.</div></div>
      </div>
      <div className="row" style={{marginTop:10}}>
        <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder={placeholder} />
        <button className="btn primary" onClick={submit}>SUBMIT</button>
      </div>
      {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
    </div>
  );
}
