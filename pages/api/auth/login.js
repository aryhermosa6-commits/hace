import { getSecrets, setSession } from "../../../lib/auth";
import { ipKey, rateLimit } from "../../../lib/ratelimit";
export default function handler(req, res){
  if(req.method !== "POST") return res.status(405).json({ ok:false });
  const rl = rateLimit(ipKey(req, "login"), 10, 60_000);
  if(!rl.ok) return res.status(429).json({ ok:false, error:"rate_limited" });
  const pin=String(req.body?.pin||""); const { pin: real }=getSecrets();
  if(pin!==real) return res.status(401).json({ ok:false, error:"bad_pin" });
  setSession(res,{role:"admin"});
  res.status(200).json({ ok:true });
}
