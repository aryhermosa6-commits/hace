import Link from "next/link";
import GlitchText from "./GlitchText";
import { useEffect, useState } from "react";
import { signImageURL } from "../lib/signedImg";
import ThemeLangBar from "./ThemeLangBar";
import { strings } from "../lib/i18n";
export default function HeaderNav({ ctx }){
  const s=ctx?.data?.settings||{}; const brand=s.brand||"PONOROGO HARDCORE";
  const t=strings[ctx.lang]||strings.id;
  const [signedLogo,setSignedLogo]=useState(null);

  // sign the logo once on mount; ensures link expires & hinders direct downloads
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
  return (
    <div className="container">
      <div className="row" style={{justifyContent:"space-between"}}>
        <Link href="/" className="row" style={{gap:12}}>
          <div className="logo3d" style={{width:46,height:46,borderRadius:14,animation:"spinLogo 6s linear infinite"}}>
            <img src={signedLogo || "/images/logo.png"} alt="logo" onDragStart={(e)=>e.preventDefault()} />
          </div>
          <div style={{lineHeight:1.1}}>
            <div className="small" style={{margin:0,opacity:.8}}>PONOROCKGO</div>
            <div style={{fontWeight:900,letterSpacing:".02em"}}><GlitchText>{brand}</GlitchText></div>
          </div>
        </Link>
        <ThemeLangBar lang={ctx.lang} setLang={ctx.setLang} theme={ctx.theme} setTheme={ctx.setTheme} themes={s.themes||["VHS","GRUNGE","CLEAN"]}/>
      </div>
      <div className="row" style={{marginTop:12}}>
        <Link className="btn small" href="/">{t.nav_home}</Link>
        <Link className="btn small" href="/products">{t.nav_products}</Link>
        <Link className="btn small" href="/wishlist">WISHLIST</Link>
        <Link className="btn small" href="/admin">{t.nav_admin}</Link>
        <Link className="btn small" href="/archive">ARCHIVE</Link>
        <Link className="btn small" href="/products-table">TABLE</Link>
        <Link className="btn small" href="/guide">GUIDE</Link>
        <a className="btn small" href={`https://instagram.com/${s.igHandle||"ponorogohardcore"}`} target="_blank" rel="noreferrer">IG</a>
      </div>
      <hr />
    </div>
  );
}
