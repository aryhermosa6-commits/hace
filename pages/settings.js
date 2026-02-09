import { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav";
import AudioNoiseToggle from "../components/AudioNoiseToggle";
import AudioVisualizer from "../components/AudioVisualizer";

/**
 * Settings page
 *
 * This page gathers all of the visual and interaction toggles into one
 * location so that the main UI remains uncluttered. Each toggle
 * manipulates document.body classes directly to persist across page
 * navigation. Audio toggles rely on their own internal state within
 * their components and are unaffected by page transitions.
 */
export default function Settings({ __ctx }) {
  // Local state mirrors the body class list on mount to reflect any
  // previously active settings.
  const [contrastLock, setContrastLock] = useState(false);
  const [oneHand, setOneHand] = useState(false);
  const [focus, setFocus] = useState(false);

  // Initialise states based on body classes once when mounted.
  useEffect(() => {
    if (typeof document !== "undefined") {
      setContrastLock(document.body.classList.contains('contrastLock'));
      setOneHand(document.body.classList.contains('oneHand'));
      setFocus(document.body.classList.contains('focusProduct'));
    }
  }, []);

  // Define toggles which update both state and body class.
  const toggleContrast = () => {
    const next = !contrastLock;
    setContrastLock(next);
    if (next) document.body.classList.add('contrastLock');
    else document.body.classList.remove('contrastLock');
  };
  const toggleOneHand = () => {
    const next = !oneHand;
    setOneHand(next);
    if (next) document.body.classList.add('oneHand');
    else document.body.classList.remove('oneHand');
  };
  const toggleFocus = () => {
    const next = !focus;
    setFocus(next);
    if (next) document.body.classList.add('focusProduct');
    else document.body.classList.remove('focusProduct');
  };

  return (
    <>
      {/* Header with brand and nav; receives context for translation/theme */}
      <HeaderNav ctx={__ctx} />
      <div className="container" style={{ paddingBottom: '4rem' }}>
        <h1 style={{ marginTop: 20, marginBottom: 12 }}>Pengaturan</h1>
        <p className="small" style={{ marginBottom: 20 }}>Sesuaikan tampilan dan kontrol interaksi.</p>
        <div className="card cardPad" style={{ marginBottom: 20 }}>
          <h3>Audio &amp; Efek</h3>
          <div className="row" style={{ flexWrap: 'wrap', gap: 12 }}>
            {/* Toggle static noise */}
            <AudioNoiseToggle />
            {/* Audio visualizer: remains disabled on mobile within component */}
            <AudioVisualizer />
          </div>
        </div>
        <div className="card cardPad" style={{ marginBottom: 20 }}>
          <h3>Mode Tampilan</h3>
          <div className="row" style={{ flexWrap: 'wrap', gap: 12 }}>
            <button className="btn small" onClick={toggleContrast}>
              {contrastLock ? 'Contrast OFF' : 'Contrast ON'}
            </button>
            <button className="btn small" onClick={toggleOneHand}>
              {oneHand ? 'One‑hand OFF' : 'One‑hand ON'}
            </button>
            <button className="btn small" onClick={toggleFocus}>
              {focus ? 'Focus OFF' : 'Focus ON'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}