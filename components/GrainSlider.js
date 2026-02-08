import React, { useState, useEffect } from 'react';

/**
 * GrainSlider
 *
 * Provides a UI slider to control the intensity of the noise overlay.
 * It adjusts the CSS custom property `--noiseOpacity` in realtime.
 * Users can drag between 0 and 0.3; default is 0.08. Changes persist
 * for the current session. You can mount this component anywhere,
 * typically near the bottom of the page or within a settings drawer.
 */
const GrainSlider = () => {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const existing = getComputedStyle(document.documentElement).getPropertyValue('--noiseOpacity');
      return parseFloat(existing) || 0.08;
    }
    return 0.08;
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--noiseOpacity', value.toString());
  }, [value]);

  return (
    <div className="grainSlider">
      <label className="small" htmlFor="grainRange">Grain&nbsp;</label>
      <input
        id="grainRange"
        type="range"
        min="0"
        max="0.3"
        step="0.01"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default GrainSlider;