import React, { useState, useEffect } from 'react';
import './MiniGames.css';
import confetti from 'canvas-confetti';

const SYMBOLS = ['⛽', '🏍️', '🕶️', '🎸', '💰', '🔥'];

const SlotMachine = ({ onClose }) => {
  const [reels, setReels] = useState(['⛽', '⛽', '⛽']);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState('準備好了嗎？');

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setMessage('轉動中...');

    // Animation interval
    const interval = setInterval(() => {
      setReels(reels.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]));
    }, 100);

    // Stop after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      const finalReels = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ];
      setReels(finalReels);
      setSpinning(false);
      checkWin(finalReels);
    }, 2000);
  };

  const checkWin = (currentReels) => {
    if (currentReels[0] === currentReels[1] && currentReels[1] === currentReels[2]) {
      setMessage('大獎！DIESEL POWER！⛽⛽⛽');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Play sound if we had one
    } else if (currentReels[0] === currentReels[1] || currentReels[1] === currentReels[2] || currentReels[0] === currentReels[2]) {
      setMessage('差一點點！再試一次！');
    } else {
      setMessage('沒中，再接再厲。');
    }
  };

  return (
    <div className="game-wrapper">
      <h2>Diesel 拉霸機</h2>
      <div className="slot-machine-container">
        {reels.map((symbol, index) => (
          <div key={index} className={`slot-reel ${spinning ? 'spinning' : ''}`}>
            {symbol}
          </div>
        ))}
      </div>
      <p style={{ minHeight: '30px', color: '#ff00cc' }}>{message}</p>
      <button className="game-action-btn" onClick={spin} disabled={spinning}>
        {spinning ? '...' : '開始'}
      </button>
    </div>
  );
};

export default SlotMachine;
