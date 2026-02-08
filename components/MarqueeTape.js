import React from 'react';

/**
 * MarqueeTape
 *
 * A horizontally scrolling tape of text, reminiscent of label tape running
 * along a cassette or zine. Use this to separate sections or to display
 * announcements. The text repeats seamlessly and scrolls infinitely via
 * CSS animation. Children of this component define the content. If no
 * children are provided, a default chant is shown.
 */
const MarqueeTape = ({ children }) => {
  const content = children || 'Ponorogo Hardcore • Hardcore Scene • DIY Merch • ';
  return (
    <div className="marqueeTape">
      <div className="tapeInner">
        <span>{content}</span>
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  );
};

export default MarqueeTape;