import React from 'react';

export default function RestingPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="resting-overlay" onClick={onClose}></div>
      <div className="resting-popup">
        <h2>😴 休息中</h2>
        <p>現在是午休時間 (12:00 - 13:30)<br/>請勿打擾，正在充電...</p>
        <div style={{ fontSize: '3rem' }}>🍱🍵</div>
        <button 
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '10px 25px',
            fontSize: '1em',
            cursor: 'pointer',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          好，我知道了
        </button>
      </div>
    </>
  );
}
