import { strings } from "../lib/i18n";
export default function ThemeLangBar({ lang, setLang, theme, setTheme, themes=["VHS","GRUNGE","CLEAN"] }){
  const t=strings[lang]||strings.id;
  return (
    <div className="row">
      <div className="badge">{t.lang}:&nbsp;<button className="btn small" onClick={()=>setLang(lang==="id"?"en":"id")}>{lang.toUpperCase()}</button></div>
      <div className="badge">{t.theme}:&nbsp;
        <select className="input" style={{width:160,padding:"8px 10px"}} value={theme} onChange={(e)=>setTheme(e.target.value)}>
          {themes.map(x=><option key={x} value={x}>{x}</option>)}
        </select>
      </div>
    </div>
  );
}
