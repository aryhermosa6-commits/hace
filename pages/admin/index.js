import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderNav from "../../components/HeaderNav";

async function api(path, opts){
  const res = await fetch(path, opts);
  const j = await res.json().catch(()=>null);
  return { res, j };
}

export default function Admin({ __ctx }){
  const ctx=__ctx||{};
  const [me,setMe]=useState(null);
  const [pin,setPin]=useState("");
  const [msg,setMsg]=useState("");

  useEffect(()=>{ api("/api/auth/me").then(({j})=>setMe(j)); },[]);

  const login=async ()=>{
    setMsg("");
    const { j } = await api("/api/auth/login",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({pin})});
    if(j?.ok){ setMsg("OK"); setPin(""); setMe({ ok:true }); location.href="/admin/editor"; }
    else setMsg(j?.error || "fail");
  };
  const logout=async ()=>{ await api("/api/auth/logout"); location.reload(); };
  const authed=!!me?.ok;

  return (
    <>
      <Head><title>Admin — Ponorogo Hardcore</title></Head>
      <HeaderNav ctx={ctx} />
      <div className="container">
        <div className="card cardPad">
          <div className="row" style={{justifyContent:"space-between"}}>
            <div><div className="h2" style={{marginTop:0}}>ADMIN</div><p className="p">Edit produk + settings + analytics.</p></div>
            <div className="badge">{authed?"AUTH: OK":"AUTH: OFF"}</div>
          </div>

          {!authed ? (
            <div style={{marginTop:14}}>
              <div className="label">ADMIN PIN</div>
              <div className="row" style={{marginTop:8}}>
                <input className="input" style={{maxWidth:260}} value={pin} onChange={(e)=>setPin(e.target.value)} placeholder="PIN" />
                <button className="btn primary" onClick={login}>LOGIN</button>
              </div>
              {msg && <div className="small" style={{marginTop:8}}>{msg}</div>}
              <div className="small" style={{marginTop:10}}>Default PIN: <span className="kbd">1337</span> (ubah di .env.local)</div>
            </div>
          ) : (
            <div className="row" style={{marginTop:14}}>
              <Link className="btn primary" href="/admin/editor">EDITOR</Link>
              <Link className="btn" href="/admin/stats">STATS</Link>
              <a className="btn" href="/api/email/export" target="_blank" rel="noreferrer">EXPORT CSV</a>
              <button className="btn danger" onClick={logout}>LOGOUT</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
