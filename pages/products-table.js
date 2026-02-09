import { useEffect, useState } from 'react';
import Head from 'next/head';
import HeaderNav from '../components/HeaderNav';

/**
 * Product table view: display all products in a tabular format. This page
 * complements the grid view on the home page for power users who prefer
 * scanning information quickly. It's responsive: on small screens the table
 * becomes horizontally scrollable.
 */
export default function ProductsTablePage({ __ctx }) {
  const ctx = __ctx || {};
  const s = ctx.data?.settings || {};
  const [products, setProducts] = useState(ctx.data?.products || []);
  useEffect(() => {
    // Fetch products if not provided via context
    if (!products?.length) {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(data.products || []))
        .catch(() => {});
    }
  }, [products]);
  return (
    <>
      <Head>
        <title>{s.brand || 'Ponorogo Hardcore'} — Products Table</title>
        <meta name="description" content="Tabular view of all products for Ponorogo Hardcore." />
      </Head>
      <HeaderNav ctx={ctx} />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <h1 className="h1 kinetic" style={{ fontSize: 36 }}>Product Table View</h1>
        <div className="tableWrapper" style={{ overflowX: 'auto', marginTop: 20 }}>
          <table className="productTable" style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 10px', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em' }}>Image</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em' }}>Batch</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px 10px' }}>
                    <a href={`/product/${p.slug}`}>
                      <img
                        src={p.images?.[0]}
                        alt=""
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }}
                      />
                    </a>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <a href={`/product/${p.slug}`} style={{ color: 'var(--fg)', textDecoration: 'underline' }}>
                      {p.title_id}
                    </a>
                  </td>
                  <td style={{ padding: '8px 10px' }}>Rp {Number(p.price || 0).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '8px 10px' }}>{p.status}</td>
                  <td style={{ padding: '8px 10px' }}>{p.batch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}