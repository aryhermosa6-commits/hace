import crypto from "crypto";
export function hmacHex(secret, input){
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}
export function b64url(buf){
  return Buffer.from(buf).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
export function signToken(secret, payloadObj, ttlSec){
  const exp = Math.floor(Date.now()/1000) + ttlSec;
  const payload = { ...payloadObj, exp };
  const body = b64url(JSON.stringify(payload));
  const sig = hmacHex(secret, body);
  return `${body}.${sig}`;
}
export function verifyToken(secret, token){
  if(!token || typeof token !== "string") return { ok:false };
  const [body, sig] = token.split(".");
  if(!body || !sig) return { ok:false };
  const expect = hmacHex(secret, body);
  if(sig !== expect) return { ok:false };
  try{
    const payload = JSON.parse(Buffer.from(body.replace(/-/g,"+").replace(/_/g,"/"), "base64").toString("utf-8"));
    if(!payload?.exp || payload.exp < Math.floor(Date.now()/1000)) return { ok:false };
    return { ok:true, payload };
  }catch(e){ return { ok:false }; }
}
