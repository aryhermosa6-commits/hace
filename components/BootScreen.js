import GlitchText from "./GlitchText";
export default function BootScreen({ brand="PONOROGO HARDCORE" }){
  return (
    <div style={{position:"fixed",inset:0,zIndex:9000,background:"radial-gradient(circle at 30% 25%, rgba(184,255,0,.12), transparent 55%), radial-gradient(circle at 70% 55%, rgba(255,23,68,.10), transparent 60%), #050506",display:"grid",placeItems:"center",padding:16}}>
      <div className="card" style={{ width:"min(560px, 100%)", borderRadius:24 }}>
        <div className="cardPad" style={{ padding:22 }}>
          <div className="row" style={{ justifyContent:"space-between" }}>
            <div className="badge">BOOT</div>
            <div className="badge" style={{ borderColor:"rgba(184,255,0,.35)" }}>V3.1</div>
          </div>
          <div style={{ marginTop:14 }}>
            <div className="h2" style={{ fontSize:26, marginBottom:8 }}><GlitchText force>{brand}</GlitchText></div>
            <div className="small">LOADING DROP… <span className="kbd">H</span> <span className="kbd">C</span></div>
          </div>
          <div style={{ marginTop:16, height:10, borderRadius:999, border:"1px solid rgba(255,255,255,.12)", background:"rgba(255,255,255,.04)", overflow:"hidden" }}>
            <div style={{height:"100%",width:"100%",background:"linear-gradient(90deg, rgba(184,255,0,.0), rgba(184,255,0,.55), rgba(255,23,68,.35), rgba(184,255,0,.0))",transform:"translateX(-50%)",animation:"bootBar 1.15s linear infinite"}} />
          </div>
        </div>
      </div>
      <style jsx>{`@keyframes bootBar{0%{transform:translateX(-80%);}100%{transform:translateX(80%);}}`}</style>
    </div>
  );
}
