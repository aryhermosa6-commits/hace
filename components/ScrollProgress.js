import { useEffect, useState } from 'react';

/**
 * ScrollProgress shows a thin progress bar at the top of the page indicating scroll position.
 * It listens to window scroll events and updates its width accordingly.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const p = height > 0 ? scrolled / height : 0;
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll);
    // initialize immediately
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="scrollProg">
      <div style={{ width: `${(progress * 100).toFixed(1)}%` }} />
    </div>
  );
}