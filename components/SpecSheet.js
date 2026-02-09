import React from 'react';

/**
 * SpecSheet
 *
 * Displays key specifications for a product in a datasheet style. If a
 * product does not provide a specification property, fallback values
 * are used based on its type. This component can be rendered on
 * product pages or within product cards.
 */
const defaultSpecs = {
  TEE: {
    Material: '100% Cotton',
    Weight: '180 gsm',
    Sablon: 'Plastisol',
    Fit: 'Regular'
  },
  LONGSLEEVE: {
    Material: '100% Cotton',
    Weight: '200 gsm',
    Sablon: 'Plastisol',
    Fit: 'Regular'
  }
};

const SpecSheet = ({ type, specs }) => {
  const combined = specs || defaultSpecs[type] || {};
  return (
    <div className="specSheet card cardPad">
      <div className="h2" style={{ marginTop: 0, fontSize: 18 }}>Spec Sheet</div>
      <table className="specTable">
        <tbody>
          {Object.entries(combined).map(([k, v]) => (
            <tr key={k}>
              <td className="specKey">{k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SpecSheet;