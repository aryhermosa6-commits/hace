import React from 'react';

/**
 * VenueFlyerCard displays information about upcoming gigs or meet-ups.
 * This card uses the same card styling as other components and can be
 * configured via props or fallback to default event details. By linking
 * to external pages, fans can quickly find out where to show up.
 */
export default function VenueFlyerCard({ event }) {
  // Provide default event if none supplied
  const e = event || {
    title: 'Next Gig',
    date: '14 Maret 2026',
    location: 'Skatepark Ponorogo',
    note: 'Support your local scene! Bawa amunisi & merch.',
    link: 'https://instagram.com/ponorogohardcore',
  };
  return (
    <div className="card cardPad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="h2" style={{ margin: 0, fontSize: 18 }}>{e.title}</div>
      <div className="small">{e.date}</div>
      <div className="small">{e.location}</div>
      <p className="small" style={{ marginTop: 6 }}>{e.note}</p>
      <a
        href={e.link}
        target="_blank"
        rel="noreferrer"
        className="btn small primary"
        style={{ alignSelf: 'flex-start' }}
      >
        INFO LEBIH LANJUT
      </a>
    </div>
  );
}