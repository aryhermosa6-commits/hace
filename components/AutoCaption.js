import React from 'react';

/**
 * AutoCaption
 *
 * Generates a suggested caption for social media based on a product. It
 * includes the product title, a short call‑to‑action and hashtags.
 * It displays the caption in a preformatted block with a copy button.
 */
const AutoCaption = ({ product }) => {
  if (!product) return null;
  const title = product.title_id || product.title_en || product.slug;
  const lines = [];
  lines.push(`${title} — available now at Ponorogo Hardcore`);
  lines.push('Order via DM or WA link in bio.');
  lines.push('Limited stock — no reprint.');
  lines.push('#PonorogoHardcore #HCscene #DIY');
  const text = lines.join('\n');
  const copy = () => {
    try {
      navigator.clipboard.writeText(text);
      alert('Caption copied');
    } catch (e) {}
  };
  return (
    <div className="autoCaption card cardPad">
      <div className="h2" style={{ marginTop: 0, fontSize: 16 }}>Caption</div>
      <pre className="small" style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
      <button className="btn small" onClick={copy}>COPY</button>
    </div>
  );
};

export default AutoCaption;