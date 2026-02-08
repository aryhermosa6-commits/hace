import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * MiniCart shows a compact summary of selected products. It listens to
 * updates via localStorage (phc_cart) and renders whenever items are
 * present. It calculates a total price using the provided list of all
 * products (to lookup price). The component only renders if there are
 * any items in the cart. Users can click the Checkout button to be
 * redirected to the WA builder or product page.
 */
export default function MiniCart({ products = [] }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const load = () => {
      try {
        const arr = JSON.parse(localStorage.getItem('phc_cart') || '[]');
        setItems(Array.isArray(arr) ? arr : []);
      } catch (e) {
        setItems([]);
      }
    };
    load();
    window.addEventListener('storage', load);
    window.addEventListener('phc_cart', load);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('phc_cart', load);
    };
  }, []);
  if (!items.length) return null;
  const total = items.reduce((sum, item) => {
    const p = products.find((prod) => prod.slug === item.slug);
    return sum + ((p?.price || 0) * item.qty);
  }, 0);
  return (
    <div className="miniCart">
      <div className="miniCart-content">
        <div className="miniCart-items">
          {items.map((item) => (
            <span key={item.slug} className="miniCart-item">
              {item.qty}× {item.slug}
            </span>
          ))}
        </div>
        <span className="miniCart-total">
          Rp {Number(total).toLocaleString('id-ID')}
        </span>
        <Link href="/#wa-builder" className="btn small primary" style={{ marginLeft: 8 }}>
          Checkout
        </Link>
      </div>
    </div>
  );
}