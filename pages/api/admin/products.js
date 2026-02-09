import { readJSON, writeJSON } from "../../../lib/storage";
import { requireAdmin } from "../../../lib/auth";
import { ipKey, rateLimit } from "../../../lib/ratelimit";
export default function handler(req, res){
  const sess=requireAdmin(req,res); if(!sess) return;
  const rl = rateLimit(ipKey(req, "admin_products"), 120, 60_000);
  if(!rl.ok) return res.status(429).json({ ok:false, error:"rate_limited" });
  if(req.method==="GET"){ const doc=readJSON("products.json",{settings:{},products:[]}); return res.status(200).json({ ok:true, doc }); }
  if(req.method==="POST"){
    const doc=req.body?.doc; if(!doc||typeof doc!=="object") return res.status(400).json({ ok:false, error:"bad_doc" });
    if(!doc.settings || !Array.isArray(doc.products)) return res.status(400).json({ ok:false, error:"missing_fields" });
    writeJSON("products.json",doc); return res.status(200).json({ ok:true });
  }
  return res.status(405).json({ ok:false });
}
