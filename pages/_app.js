import "../styles/globals.css";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from 'next/router';
import BootScreen from "../components/BootScreen";
import CustomCursor from "../components/CustomCursor";
import AudioNoiseToggle from "../components/AudioNoiseToggle";
import HeatTracker from "../components/HeatTracker";
// new UI components
import ScrollProgress from '../components/ScrollProgress';
import StatusRibbon from '../components/StatusRibbon';
import BottomNav from '../components/BottomNav';
import { ToastProvider } from '../lib/toast';
import AmbientFlash from '../components/AmbientFlash';
// newly added UI features
import StageLights from '../components/StageLights';
import GrainSlider from '../components/GrainSlider';
import MarqueeTape from '../components/MarqueeTape';
import AudioVisualizer from '../components/AudioVisualizer';
import ProductComparisonDrawer from '../components/ProductComparisonDrawer';
import MiniCart from '../components/MiniCart';

async function fetchProducts(){
  const res = await fetch("/api/products");
  return await res.json();
}
function useKeySequence(target, cb){
  const buf = useRef([]);
  useEffect(()=>{
    const onKey=(e)=>{
      buf.current.push(String(e.key||"").toLowerCase());
      buf.current=buf.current.slice(-target.length);
      if(buf.current.join("")===target){ cb?.(); buf.current=[]; }
    };
    window.addEventListener("keydown", onKey);
    return ()=> window.removeEventListener("keydown", onKey);
  },[target, cb]);
}
export default function App({ Component, pageProps }){
  const router = useRouter();
  const [boot, setBoot] = useState(true);
  const [data, setData] = useState(null);
  const [lang, setLang] = useState("id");
  const [theme, setTheme] = useState("VHS");
  const [rage, setRage] = useState(false);
  const [routeChanging, setRouteChanging] = useState(false);

  // additional UI modes
  const [contrastLock, setContrastLock] = useState(false);
  const [oneHand, setOneHand] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(()=>{ (async()=>{ try{ setData(await fetchProducts()); }catch(e){} })(); },[]);
  useEffect(()=>{ const t=setTimeout(()=>setBoot(false),2200); return ()=>clearTimeout(t); },[]);
  useEffect(()=>{ document.body.classList.remove("theme-VHS","theme-GRUNGE","theme-CLEAN"); document.body.classList.add(`theme-${theme}`); },[theme]);
  useEffect(()=>{ if(rage) document.body.classList.add("rage"); else document.body.classList.remove("rage"); },[rage]);

  // toggle contrast lock and one-hand mode classes on body
  useEffect(() => {
    if (contrastLock) document.body.classList.add('contrastLock');
    else document.body.classList.remove('contrastLock');
  }, [contrastLock]);
  useEffect(() => {
    if (oneHand) document.body.classList.add('oneHand');
    else document.body.classList.remove('oneHand');
  }, [oneHand]);

  useEffect(() => {
    if (focus) document.body.classList.add('focusProduct');
    else document.body.classList.remove('focusProduct');
  }, [focus]);
  useKeySequence("hc", ()=> setRage(r=>!r));

  // route change animation
  useEffect(() => {
    const handleStart = () => setRouteChanging(true);
    const handleComplete = () => setTimeout(() => setRouteChanging(false), 300);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  useEffect(()=>{
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
    // Protect images (public pages), but DON'T break admin editing.
    const isAdmin = location.pathname.startsWith("/admin");
    if(isAdmin) return;
    const block=(e)=>{
      const t=e.target;
      if(t && (t.tagName==="IMG" || t.closest?.(".imgGuard"))) e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    return ()=> document.removeEventListener("contextmenu", block);
  },[]);

  const ctx = useMemo(()=>({ data, lang,setLang, theme,setTheme, rage,setRage }),[data,lang,theme,rage]);

  // compute status ribbon values
  const nowMs = Date.now();
  const closeAtISO = data?.settings?.poCloseAt || null;
  let ribbonStatus = 'PO';
  if (closeAtISO) {
    try {
      const end = new Date(closeAtISO).getTime();
      if (end < nowMs) ribbonStatus = 'CLOSED';
    } catch (e) {
      ribbonStatus = 'PO';
    }
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#070709" />
      </Head>

      <ToastProvider>
        {/* Scroll progress bar */}
        <ScrollProgress />
        {/* PO status ribbon */}
        <StatusRibbon status={ribbonStatus} closeAtISO={closeAtISO} />

        <div className="noise" />
        <div className="scanlines" />
        {/* Stage lights overlay */}
        <StageLights />

        <CustomCursor enabled={true} />
        <HeatTracker />
        {/* ambient crowd flash overlay */}
        <AmbientFlash />

        {boot && <BootScreen brand={data?.settings?.brand || "PONOROGO HARDCORE"} />}

        {ctx?.rage && (
          <div className="rageBanner">
            RAGE MODE <button className='btn small danger' style={{ marginLeft:10 }} onClick={()=> ctx.setRage(false)}>OFF</button>
          </div>
        )}

        <div style={{ position:"fixed", right:12, top:12, zIndex:1500, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <AudioNoiseToggle />
          {/* audio visualizer next to noise toggle */}
          <AudioVisualizer />
          {/* contrast lock toggle */}
          <button className="btn small" onClick={() => setContrastLock((v) => !v)}>
            {contrastLock ? 'Contrast OFF' : 'Contrast ON'}
          </button>
          {/* one-hand mode toggle */}
          <button className="btn small" onClick={() => setOneHand((v) => !v)}>
            {oneHand ? 'One-hand OFF' : 'One-hand ON'}
          </button>
          {/* focus product mode toggle */}
          <button className="btn small" onClick={() => setFocus((v) => !v)}>
            {focus ? 'Focus OFF' : 'Focus ON'}
          </button>
        </div>

        <Component {...pageProps} __ctx={ctx} />

        {/* mini cart summary bar (shows selected items) */}
        {data?.products?.length && <MiniCart products={data.products} />}

        {/* bottom nav for mobile */}
        <BottomNav waNumber={data?.settings?.waNumber} />

        {/* grain slider control (bottom right) */}
        <GrainSlider />

        {/* product comparison drawer toggle */}
        <ProductComparisonDrawer />

        {/* marquee tape across bottom to separate footer */}
        <MarqueeTape>Ponorogo Hardcore • No gods No masters • Support your local scene • </MarqueeTape>

        {/* route change overlay */}
        {routeChanging && <div className="routeOverlay" />}
      </ToastProvider>
    </>
  );
}
