import { useMemo, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import HeaderNav from "../../components/HeaderNav";
import BottomNav from "../../components/BottomNav";
import MiniCart from "../../components/MiniCart";
import QRCodeModal from "../../components/QRCodeModal";
import SizeGuideModal from "../../components/SizeGuideModal";
import GalleryModal from "../../components/GalleryModal";
import FitFinder from "../../components/FitFinder";
import SpecSheet from "../../components/SpecSheet";
import WAMessageBuilder from "../../components/WAMessageBuilder";
import EmailCapture from "../../components/EmailCapture";
import StatusRibbon from "../../components/StatusRibbon";
import ScrollProgress from "../../components/ScrollProgress";
import GrainSlider from "../../components/GrainSlider";
import HeatTracker from "../../components/HeatTracker";
import { useRouter } from "next/router";
import products from "../../data/products.json";
import { getAB } from "../../lib/ab";
import { addToWishlist, isInWishlist } from "../../lib/storage";
import { toast } from "../../lib/toast";
import { strings } from "../../lib/i18n";
import { signImageURL } from "../../lib/signedImg";
import CouponVisual from "../../components/CouponVisual";
import AutoCaption from "../../components/AutoCaption";
import BeforeAfterSlider from "../../components/BeforeAfterSlider";

<<<<<<< HEAD
export default function ProductPage({ ctx }){
  const router = useRouter();
  const slug = router.query.slug;
  const p = products.find(x=>x.slug===slug) || products[0];
  const t = strings[ctx.lang] || strings.id;

  const [variant,setVariant]=useState("A");
  const [qty,setQty]=useState(1);
  const [size,setSize]=useState("M");
  const [color,setColor]=useState("BLACK");
  const [openQR,setOpenQR]=useState(false);
  const [openSize,setOpenSize]=useState(false);
  const [openGallery,setOpenGallery]=useState(false);
  const [wish,setWish]=useState(false);
  const [signedImg,setSignedImg]=useState(null);

  // detect mobile viewport to simplify heavy components like before/after slider
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const check = () => setIsMobile(window.innerWidth < 520);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }
  }, []);

=======
export default function ProductPage({ __ctx }){
  const ctx=__ctx||{}; const data=ctx.data; const s=data?.settings||{};
  const router=useRouter(); const slug=String(router.query.slug||"");
  const p=useMemo(()=>data?.products?.find(x=>x.slug===slug),[data,slug]);
  // detect mobile viewport to simplify heavy components like before/after slider
  const [isMobile, setIsMobile] = useState(false);
  const [gal,setGal]=useState(false); const [size,setSize]=useState(false);
  const [variant,setVariant]=useState("A");
  const [previewUrl,setPreviewUrl]=useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
>>>>>>> a5918ce (v7.5 cloudflare build fix (toast + wishlist + no fs client))
  useEffect(()=>{ setVariant(getAB()); },[]);
  useEffect(()=>{
    setWish(isInWishlist(p?.slug));
  },[p?.slug]);

<<<<<<< HEAD
  // sign image URL (deterrent only)
=======
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
>>>>>>> a5918ce (v7.5 cloudflare build fix (toast + wishlist + no fs client))
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        const u=await signImageURL(p.image);
        if(alive) setSignedImg(u);
      }catch(e){
        if(alive) setSignedImg(p.image);
      }
    })();
    return ()=>{alive=false};
  },[p?.image]);

  const price = useMemo(()=>{
    const base = p.price;
    const mult = size==="XXL" ? 1.1 : size==="XL" ? 1.05 : 1;
    return Math.round(base*mult);
  },[p,size]);

  function addWish(){
    addToWishlist(p.slug);
    setWish(true);
    toast("Added to wishlist");
  }

  return (
    <div className="wrap">
      <Head><title>{p.title} — Ponorogo Hardcore</title></Head>

      <ScrollProgress/>
      <HeaderNav ctx={ctx}/>
      <div className="container">
        <StatusRibbon ctx={ctx}/>
        <HeatTracker product={p.slug}/>
        <GrainSlider/>

        <div className="card" style={{marginTop:16}}>
          <div className="row" style={{justifyContent:"space-between"}}>
            <h1 style={{margin:0}}>{p.title}</h1>
            <span className="pill">{p.dropTag || "DROP"}</span>
          </div>
          <div className="row" style={{marginTop:8, gap:10, flexWrap:"wrap"}}>
            <span className="pill">Rp {price.toLocaleString("id-ID")}</span>
            <span className="pill">{p.type}</span>
            <span className="pill">{p.stockNote || "Ready"}</span>
          </div>

          <div className="grid2" style={{marginTop:14}}>
            <div>
              <div className="imgbox" onClick={()=>setOpenGallery(true)} style={{cursor:"pointer"}}>
                <img src={signedImg || p.image} alt={p.title}/>
              </div>
              <div className="row" style={{marginTop:10, gap:10, flexWrap:"wrap"}}>
                <button className="btn" onClick={()=>setOpenGallery(true)}>{t.view_gallery || "Gallery"}</button>
                <button className="btn" onClick={()=>setOpenSize(true)}>{t.size_guide || "Size Guide"}</button>
                <button className="btn" onClick={()=>setOpenQR(true)}>QR</button>
                <button className="btn" onClick={()=> addWish()} disabled={wish}>{wish? "WISHLISTED":"WISHLIST"}</button>
              </div>
            </div>

            <div>
              <p className="muted" style={{marginTop:0}}>{p.desc}</p>

              <div className="row" style={{gap:10, flexWrap:"wrap"}}>
                <div style={{minWidth:140}}>
                  <div className="small">{t.size || "Size"}</div>
                  <select className="input" value={size} onChange={e=>setSize(e.target.value)}>
                    {(p.sizes||["S","M","L","XL","XXL"]).map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{minWidth:160}}>
                  <div className="small">{t.color || "Color"}</div>
                  <select className="input" value={color} onChange={e=>setColor(e.target.value)}>
                    {(p.colors||["BLACK"]).map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{minWidth:120}}>
                  <div className="small">{t.qty || "Qty"}</div>
                  <div className="row" style={{gap:8}}>
                    <button className="btn" onClick={()=>setQty(q=>Math.max(1,q-1))}>-</button>
                    <div className="pill" style={{minWidth:46,textAlign:"center"}}>{qty}</div>
                    <button className="btn" onClick={()=>setQty(q=>q+1)}>+</button>
                  </div>
                </div>
              </div>

              <div style={{marginTop:14}}>
                <WAMessageBuilder product={p} qty={qty} size={size} color={color} />
              </div>

              <div style={{marginTop:14}}>
                <FitFinder product={p}/>
              </div>

              <div style={{marginTop:14}}>
                <SpecSheet product={p}/>
              </div>

              <div style={{marginTop:14}}>
                <CouponVisual ctx={ctx}/>
              </div>

              <div style={{marginTop:14}}>
                <AutoCaption product={p}/>
              </div>

              {!isMobile && (
                <div style={{marginTop:14}}>
                  <BeforeAfterSlider/>
                </div>
              )}

              <div style={{marginTop:14}}>
                <EmailCapture ctx={ctx}/>
              </div>
            </div>
          </div>

          <div className="row" style={{justifyContent:"space-between",marginTop:14}}>
            <Link className="btn" href="/products">← {t.back || "Back"}</Link>
            <MiniCart/>
          </div>
        </div>
      </div>

      <BottomNav/>

      {openQR && <QRCodeModal onClose={()=>setOpenQR(false)} url={(typeof window!=="undefined"?window.location.href:"")}/>}
      {openSize && <SizeGuideModal onClose={()=>setOpenSize(false)}/>}
      {openGallery && <GalleryModal onClose={()=>setOpenGallery(false)} images={[p.image,...(p.gallery||[])]}/>}
    </div>
  );
}
