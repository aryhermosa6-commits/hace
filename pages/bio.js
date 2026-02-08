import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Link-in-bio page
 *
 * This simple page is designed to be used as a link in social media bios. It
 * lists current drops and useful links like WA order, IG, and archive. The
 * design is minimal and mobile friendly.
 */
export default function BioPage({ __ctx }) {
  const ctx = __ctx || {};
  const data = ctx.data;
  const settings = data?.settings || {};
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (data) setProducts(data.products || []);
  }, [data]);
  return (
    <>
      <Head>
        <title>{settings.brand || 'Ponorogo Hardcore'} — Links</title>
      </Head>
      <div className="container" style={{ maxWidth: 480, textAlign: 'center', paddingTop: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 20 }}>{settings.brand || 'Ponorogo Hardcore'}</h1>
        <p className="p" style={{ marginBottom: 30 }}>Support your local scene — shop and connect with us.</p>
        {products.map((p) => (
          <div key={p.slug} style={{ marginBottom: 12 }}>
            <Link href={`/product/${p.slug}`} className="btn small primary" style={{ width: '100%' }}>{p.title_id || p.title_en}</Link>
          </div>
        ))}
        <div style={{ marginTop: 30 }}>
          <a href={`https://wa.me/${String(settings.waNumber || '').replace(/[^0-9]/g,'')}`} className="btn small" style={{ width: '100%' }}>Order via WA</a>
          <div style={{ height: 12 }} />
          <a href={`https://instagram.com/${settings.igHandle || 'ponorogohardcore'}`} className="btn small" style={{ width: '100%' }} target="_blank" rel="noreferrer">Instagram</a>
          <div style={{ height: 12 }} />
          <Link href="/archive" className="btn small" style={{ width: '100%' }}>Drop Archive</Link>
        </div>
      </div>
    </>
  );
}