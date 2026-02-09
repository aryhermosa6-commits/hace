import { useEffect, useRef } from 'react';

/**
 * QRCodeModal renders a modal overlay containing a QR code for the given text.
 * It loads the lightweight qrcode.js library on demand from the public/js folder.
 *
 * Props:
 * - open: boolean to control visibility
 * - onClose: function called when the overlay/backdrop is clicked or close button pressed
 * - text: the string to encode into the QR code
 */
export default function QRCodeModal({ open, onClose, text = '' }) {
  const qrRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // Load the QRCode library only when open
    function loadAndRender() {
      if (window.QRCode) {
        // clear previous contents
        if (qrRef.current) qrRef.current.innerHTML = '';
        // eslint-disable-next-line no-new
        new window.QRCode(qrRef.current, {
          text: String(text || ''),
          width: 200,
          height: 200,
          colorDark: '#FFFFFF',
          colorLight: '#070709',
          correctLevel: window.QRCode.CorrectLevel.M
        });
        return;
      }
      const script = document.createElement('script');
      script.src = '/js/qrcode.min.js';
      script.async = true;
      script.onload = () => {
        if (qrRef.current) qrRef.current.innerHTML = '';
        // eslint-disable-next-line no-new
        new window.QRCode(qrRef.current, {
          text: String(text || ''),
          width: 200,
          height: 200,
          colorDark: '#FFFFFF',
          colorLight: '#070709',
          correctLevel: window.QRCode.CorrectLevel.M
        });
      };
      document.body.appendChild(script);
    }
    loadAndRender();
  }, [open, text]);

  if (!open) return null;
  return (
    <div
      className="modalBack"
      onMouseDown={(e) => {
        // Close if clicking the backdrop (not inner modal)
        if (e.target.classList.contains('modalBack')) onClose?.();
      }}
    >
      <div className="modal">
        <div className="modalHeader">
          <div className="row">
            <div className="badge">QR CODE</div>
            <div className="small">SCAN TO OPEN</div>
          </div>
          <button className="btn small" onClick={onClose}>
            CLOSE
          </button>
        </div>
        <div className="modalBody" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '280px' }}>
          <div ref={qrRef} />
        </div>
      </div>
    </div>
  );
}