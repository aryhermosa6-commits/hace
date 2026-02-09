import React from 'react';

/**
 * StageLights
 *
 * A subtle moving gradient overlay reminiscent of stage lights sweeping across
 * the crowd. This component renders a full page overlay using a CSS class
 * defined in the global stylesheet. It does not intercept pointer events
 * so the underlying UI remains interactive. The animation is purely CSS
 * driven. See styles/globals.css for the keyframes definition.
 */
const StageLights = () => {
  return <div className="stageLights" />;
};

export default StageLights;