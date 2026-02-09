import { useRouter } from 'next/router';

/**
 * Bottom navigation bar for mobile view.
 * Appears fixed at the bottom on small screens. Provides quick access to key pages.
 * The WhatsApp link is constructed from the provided waNumber (digits only).
 */
export default function BottomNav({ waNumber }) {
  const router = useRouter();
  /**
   * Each item consists of a target href, label, and inline SVG icon. We avoid
   * including text labels so the nav remains uncluttered on small screens.
   */
  const items = [
    {
      href: '/',
      label: 'Beranda',
      icon: (
        <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true" focusable="false">
          {/* 2x2 grid icon */}
          <rect x="1" y="1" width="6" height="6" rx="1" ry="1" fill="currentColor" />
          <rect x="9" y="1" width="6" height="6" rx="1" ry="1" fill="currentColor" />
          <rect x="1" y="9" width="6" height="6" rx="1" ry="1" fill="currentColor" />
          <rect x="9" y="9" width="6" height="6" rx="1" ry="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      href: '/products',
      label: 'Produk',
      icon: (
        <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true" focusable="false">
          {/* 3x3 grid icon */}
          {Array.from({ length: 3 }).map((_, row) =>
            Array.from({ length: 3 }).map((_, col) => (
              <rect
                key={row + '-' + col}
                x={1 + col * 5}
                y={1 + row * 5}
                width="3"
                height="3"
                rx="0.6"
                ry="0.6"
                fill="currentColor"
              />
            ))
          )}
        </svg>
      ),
    },
    {
      href: '/wishlist',
      label: 'Wishlist',
      icon: (
        <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true" focusable="false">
          {/* Heart icon */}
          <path
            d="M8 13.5l-1.45-1.32C2.4 8.36 0 6.28 0 3.5 0 1.57 1.57 0 3.5 0 4.74 0 5.92.65 6.5 1.67 7.08.65 8.26 0 9.5 0 11.43 0 13 1.57 13 3.5c0 2.78-2.4 4.86-6.55 8.68L8 13.5z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      href: '/settings',
      label: 'Pengaturan',
      icon: (
        <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true" focusable="false">
          {/* Gear icon: circle with four teeth */}
          <circle cx="8" cy="8" r="3" fill="currentColor" />
          <rect x="7" y="0" width="2" height="3" fill="currentColor" />
          <rect x="7" y="13" width="2" height="3" fill="currentColor" />
          <rect x="0" y="7" width="3" height="2" fill="currentColor" />
          <rect x="13" y="7" width="3" height="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      href: '/admin',
      label: 'Admin',
      icon: (
        <svg viewBox="0 0 16 16" width="24" height="24" aria-hidden="true" focusable="false">
          {/* User silhouette icon */}
          <circle cx="8" cy="4.5" r="3" fill="currentColor" />
          <path d="M2 16c0-3.31 2.69-6 6-6s6 2.69 6 6H2z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  const handleClick = (e, href) => {
    e.preventDefault();
    if (href) {
      router.push(href);
    }
  };

  return (
    <nav className="bottomNav">
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          aria-label={item.label}
          className="navIcon"
          onClick={(e) => handleClick(e, item.href)}
        >
          {item.icon}
        </a>
      ))}
      {waNumber && (
        <a
          href={`https://wa.me/${String(waNumber).replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="navIcon"
        >
          <svg viewBox="0 0 448 512" width="24" height="24" aria-hidden="true" focusable="false">
            {/* Simplified WhatsApp icon: circle with phone */}
            <circle cx="224" cy="256" r="200" fill="currentColor" />
            <path
              d="M313.1 334.9l-51.7-17.4c-6.7-2.3-14.3-.7-19.4 4.3l-10.1 10.2c-32.3-16.8-58.7-43.3-75.4-75.8l10.1-10.1c5-5 6.5-12.6 4.3-19.3L170.3 135c-2.7-8-10.1-13.3-18.4-13.3h-32.9c-10.6 0-19.4 8.9-19.4 19.8 0 131.3 106.3 237.6 237.6 237.6 10.9 0 19.8-8.8 19.8-19.4v-33.1c0-8.2-5.3-15.6-13.4-18.3z"
              fill="#070709"
            />
          </svg>
        </a>
      )}
    </nav>
  );
}