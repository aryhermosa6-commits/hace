import { appendJSONList } from "../../../lib/storageServer";
import { ipKey, rateLimit } from "../../../lib/ratelimit";
export default function handler(req, res){
  if(req.method !== "POST") return res.status(405).json({ ok:false });
  const rl = rateLimit(ipKey(req, "heat"), 240, 60_000);
  if(!rl.ok) return res.status(429).json({ ok:false, error:"rate_limited" });
  const b=req.body||{};
  const evt={ t:Number(b.t||Date.now()), path:String(b.path||"/"), x:Math.max(0,Math.min(1,Number(b.x||0))), y:Math.max(0,Math.min(1,Number(b.y||0))) };
  appendJSONList("heat.json","events",evt);
  res.status(200).json({ ok:true });
}
