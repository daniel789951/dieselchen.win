import React, { useState, useRef } from 'react';
import './MiniGames.css';

const Darts = () => {
  const [score, setScore] = useState(0);
  const [darts, setDarts] = useState([]); // Array of {x, y} relative to board center %
  const [message, setMessage] = useState('瞄準並點擊！');
  
  const boardRef = useRef(null);

  const handleThrow = (e) => {
    if (!boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Board Center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Simulate jitter/sway (The "Throw")
    const jitter = 15; // px
    const actualX = clickX + (Math.random() * jitter * 2 - jitter);
    const actualY = clickY + (Math.random() * jitter * 2 - jitter);

    // Calculate distance from center (0 to Radius)
    const dx = actualX - centerX;
    const dy = actualY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = rect.width / 2;

    let points = 0;
    let hitMsg = '';

    // Scoring Zones (approximate)
    if (distance < 10) { 
        points = 50; 
        hitMsg = '正中紅心！太神啦！🎯'; 
    } else if (distance < 40) {
        points = 25;
        hitMsg = '好球！';
    } else if (distance < 70) {
        points = 10;
        hitMsg = '還不錯！';
    } else if (distance < 100) {
        points = 5;
        hitMsg = '上靶了';
    } else if (distance < maxRadius) {
        points = 1;
        hitMsg = '差一點脫靶';
    } else {
        points = 0;
        hitMsg = '脫靶啦！';
    }

    setScore(score + points);
    setMessage(hitMsg);
    
    // Store dart position in % for responsiveness
    setDarts([...darts, { 
        x: (actualX / rect.width) * 100, 
        y: (actualY / rect.height) * 100 
    }]);
  };

  const resetGame = () => {
    setScore(0);
    setDarts([]);
    setMessage('瞄準並點擊！');
  };

  return (
    <div className="game-wrapper">
      <h2>飛鏢挑戰</h2>
      <div 
        className="dart-board" 
        ref={boardRef}
        onClick={handleThrow}
      >
        <div className="dart-target"></div>
        {/* Render Darts */}
        {darts.map((dart, i) => (
            <div 
                key={i} 
                className="dart-hit"
                style={{ left: `${dart.x}%`, top: `${dart.y}%` }}
            ></div>
        ))}
      </div>
      
      <p style={{ marginTop: '15px'}}>{message}</p>
      <div className="dart-score">分數: {score}</div>
      
      <button 
        className="game-action-btn" 
        style={{ marginTop: '10px', background: '#444', fontSize: '14px', padding: '10px 20px' }}
        onClick={resetGame}
      >
        重置
      </button>
    </div>
  );
};

export default Darts;
