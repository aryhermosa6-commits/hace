import Link from 'next/link';

/**
 * Bottom navigation bar for mobile view.
 * Appears fixed at the bottom on small screens. Provides quick access to key pages.
 * The WhatsApp link is constructed from the provided waNumber (digits only).
 */
export default function BottomNav({ waNumber }) {
  return (
    <nav className="bottomNav">
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/wishlist">Wishlist</Link>
      {waNumber && (
        <a
          href={`https://wa.me/${String(waNumber).replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WA
        </a>
      )}
    </nav>
  );
}