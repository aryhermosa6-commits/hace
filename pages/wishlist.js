import Head from 'next/head';
import { useEffect, useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';

/**
 * Wishlist page. Reads favorite product slugs from localStorage and displays matching products.
 * Requires data context passed in __ctx from _app.
 */
export default function Wishlist({ __ctx }) {
  const ctx = __ctx || {};
  const data = ctx.data;
  const [favSlugs, setFavSlugs] = useState([]);
  const [prods, setProds] = useState([]);

  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem('phc_favs') || '[]');
      setFavSlugs(arr);
    } catch (e) {
      setFavSlugs([]);
    }
  }, []);

  useEffect(() => {
    if (!data) return;
    setProds((data.products || []).filter((p) => favSlugs.includes(p.slug)));
  }, [data, favSlugs]);

  if (!data) return (
    <div className="container">
      <div className="card cardPad">Loading…</div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Wishlist — Ponorogo Hardcore</title>
      </Head>
      <HeaderNav ctx={ctx} />
      <div className="container">
        <Reveal>
          <div className="h2">Wishlist</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 12 }}>
            {prods.map((p) => (
              <ProductCard key={p.slug} p={p} lang={ctx.lang} onOpenGallery={() => {}} />
            ))}
          </div>
          {!prods.length && <div className="small" style={{ marginTop: 12 }}>No favorites yet.</div>}
        </Reveal>
      </div>
    </>
  );
}