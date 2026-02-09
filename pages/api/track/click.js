import { appendJSONList } from "../../../lib/storageServer";
import { ipKey, rateLimit } from "../../../lib/ratelimit";
export default function handler(req, res){
  if(req.method !== "POST") return res.status(405).json({ ok:false });
  const rl = rateLimit(ipKey(req, "click"), 120, 60_000);
  if(!rl.ok) return res.status(429).json({ ok:false, error:"rate_limited" });
  const body = req.body || {};
  const evt = { t:Number(body.t||Date.now()), type:String(body.type||"click"), variant:String(body.variant||"A"), path:String(body.path||""), slug:String(body.slug||""), items: body.items || null };
  appendJSONList("clicks.json","events",evt);
  res.status(200).json({ ok:true });
}
