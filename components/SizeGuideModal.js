export default function SizeGuideModal({ open, onClose, chart=[] }){
  if(!open) return null;
  return (
    <div className="modalBack" onMouseDown={(e)=>{ if(e.target.classList.contains("modalBack")) onClose?.(); }}>
      <div className="modal" style={{maxWidth:720}}>
        <div className="modalHeader">
          <div className="row"><div className="badge">SIZE GUIDE</div><div className="small">Lebar (cm) • Panjang (cm)</div></div>
          <button className="btn small" onClick={onClose}>CLOSE</button>
        </div>
        <div className="modalBody">
          <div className="card cardPad" style={{overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"var(--mono)"}}>
              <thead><tr>
                <th style={{textAlign:"left",padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>SIZE</th>
                <th style={{textAlign:"left",padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>WIDTH</th>
                <th style={{textAlign:"left",padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,.12)"}}>LENGTH</th>
              </tr></thead>
              <tbody>
                {chart.map(r=>(
                  <tr key={r.size}>
                    <td style={{padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>{r.size}</td>
                    <td style={{padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>{r.width}</td>
                    <td style={{padding:"10px 8px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>{r.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="small" style={{marginTop:12}}>Tips: kalau ragu, naik 1 size buat fit lebih longgar.</div>
        </div>
      </div>
    </div>
  );
}
