import { hmacHex } from "../../lib/crypto";
export default function handler(req, res){
  const path = String(req.query.path || "");
  if(!path.startsWith("/")) return res.status(400).json({ ok:false, error:"bad path" });
  const secret = process.env.IMG_SECRET || "img-secret-change-me";
  const exp = Math.floor(Date.now()/1000) + 60*10;
  const base = `${path}|${exp}`;
  const sig = hmacHex(secret, base);
  res.status(200).json({ ok:true, url:`/api/img?path=${encodeURIComponent(path)}&exp=${exp}&sig=${sig}`, exp });
}
