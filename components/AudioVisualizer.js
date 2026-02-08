import React from 'react';

/**
 * AudioVisualizer
 *
 * Displays a simple animated bar visualizer. Even if no actual audio
 * playback is happening, the bars animate subtly to enhance the sense
 * of energy. Bars have different animation delays and durations to
 * create a pseudo-random look. You can place this component in the
 * header next to brand elements or at the bottom nav.
 */
const AudioVisualizer = () => {
  return (
    <div className="audioViz">
      {Array.from({ length: 5 }).map((_, idx) => (
        <span key={idx} />
      ))}
    </div>
  );
};

export default AudioVisualizer;