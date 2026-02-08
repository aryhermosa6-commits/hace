export async function signImageURL(path){ if(!path) return path; const r=await fetch(`/api/sign?path=${encodeURIComponent(path)}`); const j=await r.json(); return j?.ok?j.url:path; }
