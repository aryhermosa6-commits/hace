import { useState } from 'react';

/**
 * BeforeAfterSlider component shows two images in a split view with a draggable
 * slider to reveal more or less of the after image. It can be used to compare
 * print vs blank shirts or front/back artwork. It accepts `before` and `after`
 * URLs and renders a range input to control the split percentage. On mobile
 * the slider is still usable via touch. Styles for `.beforeAfter` and its
 * children are defined in globals.css.
 */
export default function BeforeAfterSlider({ before, after }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="beforeAfter">
      {/* The before layer is clipped to the percentage position */}
      <div
        className="beforeAfter-before"
        style={{
          backgroundImage: `url(${before})`,
          width: `${pos}%`,
        }}
      />
      {/* The after layer fills the remainder */}
      <div
        className="beforeAfter-after"
        style={{
          backgroundImage: `url(${after})`,
        }}
      />
      {/* Slider control */}
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="beforeAfterRange"
        aria-label="Slide to reveal"
      />
    </div>
  );
}