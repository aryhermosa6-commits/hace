import { useEffect, useState } from 'react';

/**
 * StatusRibbon shows the current PO status and a countdown until closeAt.
 * The closeAtISO prop should be an ISO date string; if it's passed, a time left
 * string will update every minute. When the countdown reaches zero, it displays
 * 'CLOSED'.
 */
export default function StatusRibbon({ status = 'PO', closeAtISO }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!closeAtISO) return;
    const update = () => {
      const diff = new Date(closeAtISO).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('CLOSED');
        return;
      }
      const hrs = Math.floor(diff / (3600 * 1000));
      const mins = Math.floor((diff % (3600 * 1000)) / 60000);
      setTimeLeft(`${hrs}h ${mins}m`);
    };
    const id = setInterval(update, 60000);
    update();
    return () => clearInterval(id);
  }, [closeAtISO]);

  return (
    <div className="statusRibbon">
      <div>{String(status).toUpperCase()}</div>
      {closeAtISO && <div>{timeLeft}</div>}
    </div>
  );
}