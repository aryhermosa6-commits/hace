import { useEffect, useState } from 'react';

/**
 * AmbientFlash shows a brief flash overlay at random intervals.
 * It simulates occasional crowd camera flashes or stage lights during gigs.
 * You can customise the minimum/maximum interval and flash duration.
 */
export default function AmbientFlash({
  intervalMin = 3000,
  intervalMax = 6000,
  duration = 200,
  color = 'rgba(255,255,255,0.12)'
}) {
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    let timer, endTimer;
    const schedule = () => {
      const delay = Math.random() * (intervalMax - intervalMin) + intervalMin;
      timer = setTimeout(() => {
        setFlash(true);
        endTimer = setTimeout(() => {
          setFlash(false);
          schedule();
        }, duration);
      }, delay);
    };
    schedule();
    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [intervalMin, intervalMax, duration]);
  if (!flash) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: color,
        mixBlendMode: 'screen',
        zIndex: 2000,
        transition: `opacity ${duration}ms ease`,
        opacity: 1
      }}
    />
  );
}
