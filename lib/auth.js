import { signToken, verifyToken } from "./crypto";
const COOKIE = "phc_session";
export function getSecrets(){
  return {
    pin: process.env.ADMIN_PIN || "1337",
    secret: process.env.SESSION_SECRET || "change-me-super-secret",
  };
}
export function setSession(res, payload){
  const { secret } = getSecrets();
  const token = signToken(secret, payload, 60*60*6);
  res.setHeader("Set-Cookie", `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax`);
}
export function clearSession(res){
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
}
export function readSession(req){
  const { secret } = getSecrets();
  const raw = req.headers.cookie || "";
  const m = raw.match(new RegExp(`${COOKIE}=([^;]+)`));
  const token = m?.[1];
  const v = verifyToken(secret, token);
  if(!v.ok) return null;
  return v.payload;
}
export function requireAdmin(req, res){
  const sess = readSession(req);
  if(!sess?.role || sess.role !== "admin"){
    res.status(401).json({ ok:false, error:"unauthorized" });
    return null;
  }
  return sess;
}
