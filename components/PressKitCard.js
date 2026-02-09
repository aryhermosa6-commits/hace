import React from 'react';

/**
 * PressKitCard
 *
 * Presents an overview of the brand/scene in a polished media kit style.
 * Use this component to provide context about Ponorogo Hardcore, its
 * values and mission. It lives on the home page below the hero and
 * before the product grid. Feel free to customize the content.
 */
const PressKitCard = () => {
  return (
    <div className="pressKit card cardPad reveal">
      <h2 className="h2">About Ponorogo Hardcore</h2>
      <p className="p">Ponorogo Hardcore is a DIY collective celebrating the raw energy of the
        Ponorogo music scene. We craft limited‑run merchandise and media that
        capture the atmosphere of underground shows, the camaraderie of the pit
        and the spirit of independence.</p>
      <p className="p">Founded by locals for locals, our mission is to amplify the voices of
        bands, artists and fans in East Java and beyond. Every drop is a
        collaboration, every shirt tells a story.</p>
      <p className="small">Contact: ponorogohc@example.com</p>
    </div>
  );
};

export default PressKitCard;