import { readJSON } from "../../lib/storage";
function esc(s){ return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
export default function handler(req, res){
  const slug=String(req.query.slug||"");
  const doc=readJSON("products.json",{settings:{brand:"PONOROGO HARDCORE"},products:[]});
  const p=doc.products.find(x=>x.slug===slug);
  const title=p?(p.title_id||p.title_en||slug):(doc.settings?.brand||"PONOROGO HARDCORE");
  const price=p?`Rp ${Number(p.price||0).toLocaleString("id-ID")}`:"";
  const svg=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0b10"/>
      <stop offset="1" stop-color="#050506"/>
    </linearGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .12 0"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" filter="url(#noise)"/>
  <rect x="70" y="70" width="1060" height="490" rx="42" fill="#ffffff" fill-opacity="0.05" stroke="#ffffff" stroke-opacity="0.14"/>
  <text x="110" y="185" fill="#b8ff00" font-size="28" font-family="monospace" letter-spacing="6">PONOROGO HARDCORE</text>
  <text x="110" y="270" fill="#f2f2f2" font-size="64" font-family="system-ui, -apple-system, Segoe UI, Roboto" font-weight="900">${esc(title)}</text>
  <text x="110" y="340" fill="#f2f2f2" fill-opacity="0.75" font-size="28" font-family="monospace">${esc(price)}</text>
  <text x="110" y="520" fill="#f2f2f2" fill-opacity="0.6" font-size="20" font-family="monospace">OPEN PO • ORDER VIA WA/IG • ${esc(slug)}</text>
</svg>`;
  res.setHeader("Content-Type","image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control","public, max-age=300");
  res.status(200).send(svg);
}
