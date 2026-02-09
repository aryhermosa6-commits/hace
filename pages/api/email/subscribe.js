import { readJSON, writeJSON } from "../../../lib/storageServer";
import { ipKey, rateLimit } from "../../../lib/ratelimit";
export default function handler(req, res){
  if(req.method !== "POST") return res.status(405).json({ ok:false });
  const rl = rateLimit(ipKey(req, "email"), 30, 60_000);
  if(!rl.ok) return res.status(429).json({ ok:false, error:"rate_limited" });
  const email=String(req.body?.email||"").trim().toLowerCase();
  if(!email || !email.includes("@")) return res.status(400).json({ ok:false, error:"invalid_email" });
  const doc=readJSON("emails.json",{subscribers:[]});
  if(doc.subscribers.some(x=>x.email===email)) return res.status(200).json({ ok:true, dup:true });
  doc.subscribers.push({ email, t:Number(req.body?.t||Date.now()) });
  writeJSON("emails.json",doc);
  res.status(200).json({ ok:true });
}
