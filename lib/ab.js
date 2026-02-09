export function readCookie(name){
  if(typeof document==="undefined") return "";
  const raw = document.cookie || "";
  const m = raw.split("; ").find(x=>x.startsWith(name+"="));
  return m ? decodeURIComponent(m.split("=").slice(1).join("=")) : "";
}
export function getAB(){
  const v = readCookie("phc_ab");
  return (v==="B") ? "B" : "A";
}
