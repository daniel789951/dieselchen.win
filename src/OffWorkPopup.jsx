import React from 'react';

export default function OffWorkPopup({ isOpen }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="resting-overlay"></div>
      <div className="resting-popup" style={{ border: '4px solid #4ecdc4' }}>
        <h2>🎉 下班啦！</h2>
        <p>現在時間 17:30</p>
        <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#4ecdc4' }}>該打卡下班啦</p>
        <p className="sub-text">好好休息，明天見！</p>
        <div style={{ fontSize: '3rem', marginTop: '20px' }}>🏃‍♂️💨</div>
      </div>
    </>
  );
}
