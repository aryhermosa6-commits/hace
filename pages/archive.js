import Head from 'next/head';
import { useEffect, useState } from 'react';
import HeaderNav from '../components/HeaderNav';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';

export default function ArchivePage({ __ctx }) {
  const ctx = __ctx || {};
  const data = ctx.data;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data) {
      setProducts(data.products || []);
    }
  }, [data]);

  // Group products by batch
  const groups = {};
  products.forEach((p) => {
    const key = p.batch || 'OTHER';
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  return (
    <>
      <Head>
        <title>Drop Archive — Ponorogo Hardcore</title>
      </Head>
      <HeaderNav ctx={ctx} />
      <div className="container">
        <Reveal>
          <div className="h1" style={{ marginBottom: 20 }}>Drop Archive</div>
        </Reveal>
        {Object.keys(groups).map((batch) => (
          <Reveal key={batch}>
            <div style={{ marginTop: 24 }}>
              <div className="h2 kinetic">{batch}</div>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', marginTop: 12 }}>
                {groups[batch].map((p) => (
                  <ProductCard key={p.slug} p={p} lang={ctx.lang || 'id'} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </>
  );
}