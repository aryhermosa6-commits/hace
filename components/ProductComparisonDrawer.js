import React, { useState } from 'react';

/**
 * ProductComparisonDrawer
 *
 * A slide‑up drawer that allows users to compare two products side by side.
 * This is a simple placeholder implementation. In a full version you would
 * integrate with application state to allow users to select products for
 * comparison. The drawer toggles open/closed when the button is clicked.
 */
const ProductComparisonDrawer = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="compareToggle btn small" onClick={() => setOpen(!open)}>
        {open ? 'Close Comparison' : 'Compare Products'}
      </button>
      {open && (
        <div className="compareDrawer">
          <h3 style={{ marginTop: 0 }}>Comparison</h3>
          <p className="small">Feature coming soon. Select products to see side‑by‑side specs.</p>
        </div>
      )}
    </>
  );
};

export default ProductComparisonDrawer;