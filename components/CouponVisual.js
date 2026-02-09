import React from 'react';

/**
 * CouponVisual
 *
 * A simple visual component that displays a coupon or discount code. It
 * renders as a stylized ticket-like element. On click it copies the
 * code to clipboard. The code is passed via props; if absent, the
 * component renders nothing.
 */
const CouponVisual = ({ code }) => {
  if (!code) return null;
  const copy = () => {
    try {
      navigator.clipboard.writeText(code);
      alert('Copied coupon code');
    } catch (e) {}
  };
  return (
    <div className="couponVisual" onClick={copy}>
      <span className="couponLabel">COUPON</span>
      <span className="couponCode">{code}</span>
    </div>
  );
};

export default CouponVisual;