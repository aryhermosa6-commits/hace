import React, { useEffect, useState } from 'react';
import { signImageURL } from '../lib/signedImg';

/**
 * StoryStrips
 *
 * Displays lookbook images in a horizontal strip reminiscent of social
 * media stories. The user can scroll horizontally. Images are signed
 * to protect against direct download. Use this at the bottom of the
 * home page or near the lookbook carousel for a different vibe.
 */
const StoryStrips = ({ images = [] }) => {
  const [signed, setSigned] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      const out = [];
      for (const img of images) {
        try {
          out.push(await signImageURL(img));
        } catch (e) {
          out.push(img);
        }
      }
      if (alive) setSigned(out);
    })();
    return () => {
      alive = false;
    };
  }, [images]);
  if (!images.length) return null;
  return (
    <div className="storyStrips">
      {signed.map((src, idx) => (
        <div key={idx} className="storyFrame">
          <img src={src} alt="" />
        </div>
      ))}
    </div>
  );
};

export default StoryStrips;