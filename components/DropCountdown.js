import { useEffect, useMemo, useState } from "react";
const pad=(n)=>String(n).padStart(2,"0");
export default function DropCountdown({ closeAtISO }){
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const { text, done } = useMemo(() => {
    // if no close date provided or invalid date, return infinity symbol
    if (!closeAtISO) return { done: false, text: '∞' };
    const endMs = Date.parse(closeAtISO);
    if (Number.isNaN(endMs)) return { done: false, text: '∞' };
    const diffMs = Math.max(0, endMs - now);
    const done = diffMs <= 0;
    const s = Math.floor(diffMs / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return { done, text: `${d}D ${pad(h)}:${pad(m)}:${pad(ss)}` };
  }, [now, closeAtISO]);
  const badgeCls = done ? 'sold' : 'po';
  const label = done ? 'PO CLOSED' : text;
  return (
    <div className={`badge ${badgeCls}`}>
      <span>⏱</span>
      <span style={{ fontWeight: 800 }}>{label}</span>
    </div>
  );
}
