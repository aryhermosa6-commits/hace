import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import HeaderNav from "../../components/HeaderNav";
import GalleryModal from "../../components/GalleryModal";
import SizeGuideModal from "../../components/SizeGuideModal";
import Reveal from "../../components/Reveal";
import FitFinder from "../../components/FitFinder";
import BundleBuilder from "../../components/BundleBuilder";
import WAMessageBuilder from "../../components/WAMessageBuilder";
import SpecSheet from "../../components/SpecSheet";
import QRCodeModal from "../../components/QRCodeModal";
import { getAB } from "../../lib/ab";
import { signImageURL } from "../../lib/signedImg";
import CouponVisual from "../../components/CouponVisual";
import AutoCaption from "../../components/AutoCaption";
import BeforeAfterSlider from "../../components/BeforeAfterSlider";
export default function ProductPage({ __ctx }){
  const ctx=__ctx||{}; const data=ctx.data; const s=data?.settings||{};
  const router=useRouter(); const slug=String(router.query.slug||"");
  const p=useMemo(()=>data?.products?.find(x=>x.slug===slug),[data,slug]);
  const [gal,setGal]=useState(false); const [size,setSize]=useState(false);
  const [variant,setVariant]=useState("A");
  const [previewUrl,setPreviewUrl]=useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  // detect mobile viewport (MUST be inside component; hooks can't run at module scope)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < 520);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(()=>{ setVariant(getAB()); },[]);

  // record recently viewed product slugs in localStorage
  useEffect(() => {
    if (!p) return;
    try {
      let arr = JSON.parse(localStorage.getItem('phc_recent') || '[]');
      arr = arr.filter((s) => s !== p.slug);
      arr.unshift(p.slug);
      arr = arr.slice(0, 5);
      localStorage.setItem('phc_recent', JSON.stringify(arr));
    } catch (e) {}
  }, [p?.slug]);

  // Sign the first product image to prevent direct download
  useEffect(()=>{
    let alive=true;
    (async()=>{
      if(p?.images?.[0]){
        try{
          const u=await signImageURL(p.images[0]);
          if(alive) setPreviewUrl(u);
        }catch(e){}
      }
    })();
    return ()=>{alive=false};
  },[p?.images]);

  // Capture the current URL for QR code once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrUrl(window.location.href);
    }
  }, []);

  if(!data) return <div className="container"><div className="card cardPad">Loading…</div></div>;
  if(!p) return <div className="container"><div className="card cardPad">Not found.</div></div>;

  const title=ctx.lang==="en"?p.title_en:p.title_id;
  const desc=ctx.lang==="en"?p.desc_en:p.desc_id;

  return (
    <>
      <Head>
        <title>{title} — Ponorogo Hardcore</title>
        <meta name="description" content={desc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={`/api/og?slug=${encodeURIComponent(slug)}`} />
      </Head>

      <HeaderNav ctx={ctx} />

      <div className="container">
        <Reveal>
          <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))"}}>
            <div className="card cardPad">
              <div className="h2" style={{marginTop:0}}>{title}</div>
              <p className="p">{desc}</p>
              <div className="row" style={{marginTop:10}}>
                <div className="badge">{String(p.status||"PO").toUpperCase()}</div>
                <div className="badge">{p.batch}</div>
                <div className="badge">Rp {Number(p.price||0).toLocaleString("id-ID")}</div>
              </div>

              {p.priceHistory && p.priceHistory.length > 0 && (
                <div className="small" style={{ marginTop: 6 }}>
                  Riwayat harga: {p.priceHistory.map((ph) => `${new Date(ph.date).toLocaleDateString('id-ID')}: Rp ${Number(ph.price).toLocaleString('id-ID')}`).join(' | ')}
                </div>
              )}
              <SpecSheet type={p.type} specs={p.specs} />

              <div className="row" style={{marginTop:12}}>
                <button className="btn primary" onClick={()=>setGal(true)}>OPEN GALLERY</button>
                <button className="btn" onClick={()=>setSize(true)}>SIZE GUIDE</button>
              </div>
              <div className="small" style={{marginTop:12}}>OG preview aktif: share link produk → pakai OG image server-side (/api/og).</div>
            </div>

            <div className="card" style={{overflow:"hidden"}}>
              <div className="imgGuard" onContextMenu={(e)=>e.preventDefault()} onDragStart={(e)=>e.preventDefault()}>
                <img src={previewUrl || p.images?.[0]} alt={title} style={{width:"100%",height:420,objectFit:"cover"}} />
              </div>
              <div className="cardPad" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div className="small">Preview (gallery pakai signed url)</div>
                <button className="btn small" onClick={()=>setGal(true)}>FULLSCREEN</button>
              </div>
            </div>
          </div>
        </Reveal>

        <div style={{height:16}} />
        <Reveal><FitFinder chart={p.sizeChart} /></Reveal>

        {/* Before/After comparison: on mobile, show images stacked; on larger screens, use slider */}
        <div style={{ height: 16 }} />
        <Reveal>
          {p.images && p.images.length > 1 && (
            <div className="card cardPad">
              <div className="h2" style={{ marginBottom: 8, fontSize: 18 }}>Before vs After</div>
              {isMobile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <img src={p.images[0]} alt="Before" style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 8 }} />
                  <img src={p.images[1]} alt="After" style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 8 }} />
                </div>
              ) : (
                <>
                  <BeforeAfterSlider before={p.images[0]} after={p.images[1]} />
                  <div className="small" style={{ marginTop: 8 }}>Geser untuk melihat perbedaan.</div>
                </>
              )}
            </div>
          )}
        </Reveal>

        <div style={{height:16}} />
        <Reveal><BundleBuilder waNumber={s.waNumber} products={data.products} discount={s.bundleDiscount||10000} lang={ctx.lang} variant={variant} /></Reveal>

        <div style={{height:16}} />
        <Reveal><WAMessageBuilder waNumber={s.waNumber} products={[p]} lang={ctx.lang} variant={variant} /></Reveal>

        {/* Coupon code and auto caption */}
        <div style={{ height: 16 }} />
        <Reveal>
          <CouponVisual code={p.coupon || data?.settings?.coupon} />
          <AutoCaption product={p} />
        </Reveal>

        {/* Short link */}
        <div style={{ height: 16 }} />
        <Reveal>
          <div className="card cardPad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="label">Short Link</div>
            <div className="row" style={{ gap: 8 }}>
              <input className="input" value={`https://phc.one/${p.slug}`} readOnly />
              <button className="btn small" onClick={() => { try { navigator.clipboard.writeText(`https://phc.one/${p.slug}`); alert('Short link copied'); } catch(e) {} }}>COPY</button>
            </div>
          </div>
        </Reveal>

        <div style={{ height: 16 }} />
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="btn" onClick={() => setQrOpen(true)}>SHOW QR</button>
          </div>
        </Reveal>
      </div>

      <GalleryModal open={gal} onClose={()=>setGal(false)} title={title} images={p.images||[]} watermarkText={""} />
      <SizeGuideModal open={size} onClose={()=>setSize(false)} chart={p.sizeChart||[]} />
      <QRCodeModal open={qrOpen} onClose={()=>setQrOpen(false)} text={qrUrl} />
    </>
  );
}
