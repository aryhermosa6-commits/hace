import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import HeaderNav from "../components/HeaderNav";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import GalleryModal from "../components/GalleryModal";
import LookbookCarousel from "../components/LookbookCarousel";
import UGCWall from "../components/UGCWall";
import FAQAccordion from "../components/FAQAccordion";
import ShippingEstimator from "../components/ShippingEstimator";
import WAMessageBuilder from "../components/WAMessageBuilder";
import DropAlertPopup from "../components/DropAlertPopup";
import EmailCapture from "../components/EmailCapture";
import DropMap from "../components/DropMap";
import BundleBuilder from "../components/BundleBuilder";
import { strings } from "../lib/i18n";
import { getAB } from "../lib/ab";
import PressKitCard from "../components/PressKitCard";
import StoryStrips from "../components/StoryStrips";
import VenueFlyerCard from "../components/VenueFlyerCard";

// search and filter components
import SearchBar from "../components/SearchBar";
import FilterSortChips from "../components/FilterSortChips";

export default function Home({ __ctx }){
  const ctx=__ctx||{}; const data=ctx.data; const s=data?.settings||{};
  const t=strings[ctx.lang]||strings.id;
  const [gallery,setGallery]=useState({open:false,p:null});
  const [wm,setWm]=useState("");
  const [variant,setVariant]=useState("A");
  const [recentSlugs, setRecentSlugs] = useState([]);
  // load recent product slugs on mount
  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem('phc_recent') || '[]');
      setRecentSlugs(arr);
    } catch (e) {
      setRecentSlugs([]);
    }
  }, []);

  useEffect(()=>{ setVariant(getAB()); },[]);
  useEffect(()=>{ const key="phc_handle"; const v=localStorage.getItem(key)||""; if(v) setWm(v); },[]);
  const watermarkText=useMemo(()=>{ if(!wm) return ""; return `${wm} • ${new Date().toLocaleString("id-ID")}`; },[wm]);

  const recentProducts = useMemo(() => {
    if (!data) return [];
    const map = new Map((data.products || []).map(p => [p.slug, p]));
    return recentSlugs.map(sl => map.get(sl)).filter(Boolean);
  }, [data, recentSlugs]);

  // search and filter state
  const [q, setQ] = useState('');
  const [sortOpt, setSortOpt] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sizeFilter, setSizeFilter] = useState(null);

  // derive filtered & sorted products
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    let arr = [...data.products];
    // filter out products not yet published based on optional publishAt (ISO) timestamp
    arr = arr.filter((p) => {
      if (!p.publishAt) return true;
      try {
        return new Date(p.publishAt).getTime() <= Date.now();
      } catch (e) {
        return true;
      }
    });
    if (q.trim()) {
      const term = q.toLowerCase();
      arr = arr.filter(p => {
        return (
          p.title_id?.toLowerCase().includes(term) ||
          p.title_en?.toLowerCase().includes(term) ||
          p.slug?.toLowerCase().includes(term)
        );
      });
    }
    if (statusFilter) {
      arr = arr.filter(p => String(p.status).toUpperCase() === statusFilter);
    }
    if (sizeFilter) {
      arr = arr.filter(p => (p.sizeChart || []).some(r => r.size === sizeFilter));
    }
    if (sortOpt === 'asc') {
      arr.sort((a,b) => (a.price||0) - (b.price||0));
    } else if (sortOpt === 'desc') {
      arr.sort((a,b) => (b.price||0) - (a.price||0));
    }
    return arr;
  }, [data, q, sortOpt, statusFilter, sizeFilter]);

  if(!data) return <div className="container"><div className="card cardPad">Loading…</div></div>;

  return (
    <>
      <Head>
        <title>{s.brand || "PONOROGO HARDCORE"} — Drop</title>
        <meta name="description" content="Ponorogo Hardcore drop. Order via WA/IG." />
        <meta property="og:title" content={`${s.brand || "PONOROGO HARDCORE"} — Drop`} />
        <meta property="og:description" content="Order via WA/IG. Hardcore." />
        <meta property="og:image" content={`/api/og?slug=baju-tee`} />
      </Head>

      <HeaderNav ctx={ctx} />
      <Hero ctx={ctx} />

      {/* Press kit / about card */}
      <div className="container">
        <Reveal>
          <PressKitCard />
        </Reveal>
      </div>

      <DropAlertPopup onCTA={()=> document.getElementById("drop-list")?.scrollIntoView({behavior:"smooth",block:"start"}) } />

      <div className="container">
        <Reveal>
          <div className="card cardPad">
            <div className="row" style={{justifyContent:"space-between"}}>
              <div>
                <div className="h2 kinetic">WATERMARK (PREVIEW)</div>
                <p className="p">Masukin handle IG kamu biar preview gallery ada watermark (anti-colong versi halus).</p>
              </div>
              <div className="badge">DYNAMIC</div>
            </div>
            <div className="row" style={{marginTop:10}}>
              <input className="input" placeholder="@username" value={wm} onChange={(e)=>{ const v=e.target.value; setWm(v); try{ localStorage.setItem("phc_handle", v); }catch(e){} }} />
              <div className="small">Dipakai buat watermark preview (overlay). Screenshot masih mungkin.</div>
            </div>
          </div>
        </Reveal>

        <div style={{height:16}} />

        <Reveal>
          <div className="row" style={{justifyContent:"space-between"}}>
            <div>
              <div className="h2 kinetic">FEATURED DROP</div>
              <p className="p">Hover/drag buat tilt + flip. Klik gallery buat fullscreen.</p>
            </div>
            <div className="badge">1–18 + EXTRA</div>
          </div>

          {/* search bar and filter chips */}
          <div style={{ marginTop: 12 }}>
            <SearchBar value={q} onChange={(v) => setQ(v)} />
            <FilterSortChips
              onSortChange={(v) => setSortOpt(v === 'asc' ? 'asc' : v === 'desc' ? 'desc' : null)}
              onStatusFilter={(v) => setStatusFilter(v)}
              onSizeFilter={(v) => setSizeFilter(v)}
            />
          </div>

          <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",marginTop:12}}>
            {filteredProducts.map(p=> <ProductCard key={p.slug} p={p} lang={ctx.lang} onOpenGallery={(pp)=>setGallery({open:true,p:pp})} />)}
          </div>
          {filteredProducts.length === 0 && (
            <div className="small" style={{ marginTop: 12 }}>No products found.</div>
          )}
        </Reveal>

        <div style={{height:16}} />
        <Reveal><LookbookCarousel images={data.lookbook} /></Reveal>
        {/* Story strips below lookbook carousel */}
        <Reveal><StoryStrips images={data.lookbook} /></Reveal>

        <div style={{height:16}} />
        <Reveal><BundleBuilder waNumber={s.waNumber} products={data.products} discount={s.bundleDiscount||10000} lang={ctx.lang} variant={variant} /></Reveal>

        <div style={{height:16}} />
        <Reveal>
          <div id="wa-builder">
            <WAMessageBuilder waNumber={s.waNumber} products={data.products} lang={ctx.lang} variant={variant} />
          </div>
        </Reveal>

        <div style={{height:16}} />
        <Reveal><ShippingEstimator /></Reveal>

        <div style={{height:16}} />
        <Reveal><DropMap data={data.dropMap} lang={ctx.lang} /></Reveal>

        {/* Venue flyer card for upcoming events */}
        <div style={{height:16}} />
        <Reveal><VenueFlyerCard /></Reveal>

        {/* Recently viewed products */}
        <div style={{height:16}} />
        <Reveal>
          <div className="h2 kinetic">RECENT</div>
          <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",marginTop:12}}>
            {recentProducts.map((p) => (
              <ProductCard key={'recent-' + p.slug} p={p} lang={ctx.lang} onOpenGallery={(pp) => setGallery({ open: true, p: pp })} />
            ))}
          </div>
          {!recentProducts.length && <div className="small" style={{marginTop:12}}>No recent views yet.</div>}
        </Reveal>

        <div style={{height:16}} />
        <Reveal><div className="h2 kinetic">UGC WALL</div><UGCWall items={data.ugc} igHandle={s.igHandle} /></Reveal>

        <div style={{height:16}} />
        <Reveal><div className="h2 kinetic">FAQ</div><FAQAccordion items={data.faq} lang={ctx.lang} /></Reveal>

        <div style={{height:16}} />
        <Reveal><div id="drop-list" /><EmailCapture label={t.subscribe} placeholder={t.email_ph} /></Reveal>

        <div style={{height:26}} />
        <div className="small">Easter egg: ketik <span className="kbd">H</span><span className="kbd">C</span> → Rage Mode.</div>
        <div style={{height:20}} />
      </div>

      <GalleryModal open={gallery.open} onClose={()=>setGallery({open:false,p:null})} title={gallery.p?(ctx.lang==="en"?gallery.p.title_en:gallery.p.title_id):""} images={gallery.p?.images||[]} watermarkText={watermarkText} />
    </>
  );
}
