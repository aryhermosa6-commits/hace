import { readJSON } from "../../../lib/storageServer";
import { requireAdmin } from "../../../lib/auth";
export default function handler(req, res){
  const ok=requireAdmin(req,res); if(!ok) return;
  const doc=readJSON("emails.json",{subscribers:[]});
  const rows=[["email","timestamp"]].concat(doc.subscribers.map(s=>[s.email,new Date(s.t).toISOString()]));
  const csv=rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(",")).join("\n");
  res.setHeader("Content-Type","text/csv; charset=utf-8");
  res.setHeader("Content-Disposition","attachment; filename=drop_list.csv");
  res.status(200).send(csv);
}
