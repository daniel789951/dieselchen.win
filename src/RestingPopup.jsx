import React from 'react';

export default function RestingPopup({ isOpen }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="resting-overlay"></div>
      <div className="resting-popup">
        <h2>😴 休息中</h2>
        <p>現在是午休時間 (12:00 - 13:30)<br/>請勿打擾，正在充電...</p>
        <div style={{ fontSize: '3rem' }}>🍱🍵</div>
      </div>
    </>
  );
}
