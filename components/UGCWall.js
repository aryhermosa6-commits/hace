export default function UGCWall({ items=[], igHandle="ponorogohardcore" }){
  return (
    <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
      {items.map((it,idx)=>(
        <a key={idx} className="card cardPad" href={it.url} target="_blank" rel="noreferrer">
          <div className="badge">UGC</div>
          <div className="h2" style={{fontSize:16,marginTop:10}}>{it.label}</div>
          <div className="small" style={{marginTop:8,wordBreak:"break-all"}}>{it.url}</div>
          <div className="btn small" style={{marginTop:12}}>OPEN IG</div>
        </a>
      ))}
      <div className="card cardPad">
        <div className="badge">TAG US</div>
        <div className="h2" style={{fontSize:16,marginTop:10}}>@{igHandle}</div>
        <p className="p" style={{marginTop:8}}>Tag/mention biar masuk UGC wall (tambah manual via /admin).</p>
      </div>
    </div>
  );
}
