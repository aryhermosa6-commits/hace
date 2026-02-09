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
  // ref to store a fallback timer for the route overlay. If the route
  // never finishes for some reason (e.g. an unhandled error), this
  // timer will automatically clear the overlay after a short delay.
  const overlayTimerRef = useRef();

  // additional UI modes
  const [contrastLock, setContrastLock] = useState(false);
  const [oneHand, setOneHand] = useState(false);
  const [focus, setFocus] = useState(false);

  // detect if we are on a small/mobile screen. We set this only on client.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

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

  // route change animation with fallback: show overlay on start, hide it on
  // complete/error, and auto-hide after a timeout in case no event fires.
  useEffect(() => {
    const handleStart = () => {
      setRouteChanging(true);
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
      overlayTimerRef.current = setTimeout(() => setRouteChanging(false), 1200);
    };
    const handleComplete = () => {
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
      setRouteChanging(false);
    };
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
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
        {!isMobile && <ScrollProgress />}
        {/* PO status ribbon */}
        <StatusRibbon status={ribbonStatus} closeAtISO={closeAtISO} />

        {/* base noise & scanline effects remain as backgrounds, but disable on small/mobile screens to improve performance */}
        {!isMobile && <div className="noise" />}
        {!isMobile && <div className="scanlines" />}
        {/* Stage lights overlay (disabled on small screens to improve performance) */}
        {!isMobile && <StageLights />}

        <CustomCursor enabled={!isMobile} />
        <HeatTracker />
        {/* ambient crowd flash overlay (disabled on mobile) */}
        {!isMobile && <AmbientFlash />}

        {/* Boot screen: reduce duration and disable completely on small screens */}
        {boot && !isMobile && <BootScreen brand={data?.settings?.brand || "PONOROGO HARDCORE"} />}

        {ctx?.rage && (
          <div className="rageBanner">
            RAGE MODE <button className='btn small danger' style={{ marginLeft:10 }} onClick={()=> ctx.setRage(false)}>OFF</button>
          </div>
        )}

        {/*
          The quick toggles for noise, visualizer and display modes have been
          relocated to a dedicated settings page (`/settings`). Removing
          this fixed container keeps the UI uncluttered, particularly on
          mobile devices. The classes themselves (contrastLock, oneHand,
          focusProduct) will still take effect if toggled on the
          settings page because they are applied on `document.body`.
        */}

        <Component {...pageProps} __ctx={ctx} />

        {/* mini cart summary bar (shows selected items) */}
        {data?.products?.length && <MiniCart products={data.products} />}

        {/* bottom nav for mobile */}
        <BottomNav waNumber={data?.settings?.waNumber} />

        {/* grain slider control (bottom right) disabled on mobile */}
        {!isMobile && <GrainSlider />}

        {/* product comparison drawer toggle: disabled on mobile to avoid clutter */}
        {!isMobile && <ProductComparisonDrawer />}

        {/* marquee tape across bottom to separate footer (disabled on mobile) */}
        {!isMobile && <MarqueeTape>Ponorogo Hardcore • No gods No masters • Support your local scene • </MarqueeTape>}

        {/* route change overlay */}
        {routeChanging && <div className="routeOverlay" />}
      </ToastProvider>
    </>
  );
}
