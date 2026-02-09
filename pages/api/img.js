import fs from "fs";
import path from "path";
import { hmacHex } from "../../lib/crypto";
function mimeFrom(p){
  const x=p.toLowerCase();
  if(x.endsWith(".png")) return "image/png";
  if(x.endsWith(".jpg")||x.endsWith(".jpeg")) return "image/jpeg";
  if(x.endsWith(".webp")) return "image/webp";
  if(x.endsWith(".gif")) return "image/gif";
  if(x.endsWith(".svg")) return "image/svg+xml";
  if(x.endsWith(".mp4")) return "video/mp4";
  return "application/octet-stream";
}
export default function handler(req, res){
  const pth = String(req.query.path || "");
  const exp = Number(req.query.exp || 0);
  const sig = String(req.query.sig || "");
  if(!pth.startsWith("/")) return res.status(400).send("bad path");
  if(!exp || exp < Math.floor(Date.now()/1000)) return res.status(403).send("expired");
  const secret = process.env.IMG_SECRET || "img-secret-change-me";
  const base = `${pth}|${exp}`;
  const expect = hmacHex(secret, base);
  if(expect !== sig) return res.status(403).send("bad sig");
  if(!(pth.startsWith("/images/") || pth.startsWith("/lookbook/") || pth.startsWith("/media/") || pth.startsWith("/icons/"))){
    return res.status(403).send("forbidden");
  }
  const safeRel = pth.replace(/^\/+/, ""); // <— FIX: prevent path.join absolute override
  const filePath = path.join(process.cwd(), "public", safeRel);
  if(!fs.existsSync(filePath)) return res.status(404).send("not found");
  res.setHeader("Content-Type", mimeFrom(filePath));
  res.setHeader("Cache-Control", "private, max-age=600");
  fs.createReadStream(filePath).pipe(res);
}
