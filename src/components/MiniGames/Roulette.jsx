import React, { useState, useRef, useMemo } from 'react';
import './MiniGames.css';
import confetti from 'canvas-confetti';

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#54A0FF', '#5F27CD', '#FF9FF3', '#00D2D3'];

const Roulette = ({ title, items }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const wheelRef = useRef(null);

  // Generate dynamic gradient based on items count
  const wheelBackground = useMemo(() => {
    const segmentAngle = 360 / items.length;
    let gradient = 'conic-gradient(';
    items.forEach((_, index) => {
      const color = COLORS[index % COLORS.length];
      const start = segmentAngle * index;
      const end = segmentAngle * (index + 1);
      gradient += `${color} ${start}deg ${end}deg, `;
    });
    gradient = gradient.slice(0, -2) + ')'; // Remove trailing comma
    return gradient;
  }, [items]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Random extra spins (5 to 10)
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 5));
    // Random landing angle
    const randomAngle = Math.floor(Math.random() * 360);
    const newRotation = rotation + extraSpins + randomAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      calculateResult(newRotation);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 3000); // 3 seconds matching CSS transition
  };

  const calculateResult = (finalRotation) => {
    const normalizedRotation = finalRotation % 360;
    // Pointer is at Top (0 deg).
    // If wheel rotates Clockwise by X deg. The segment at Top is based on:
    // (360 - X) % 360.
    const effectiveAngle = (360 - normalizedRotation) % 360;
    
    const segmentAngle = 360 / items.length;
    const winningIndex = Math.floor(effectiveAngle / segmentAngle);
    
    setResult(items[winningIndex]);
  };

  return (
    <div className="game-wrapper">
      <h2>{title}</h2>
      
      <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
        <div className="roulette-pointer"></div>
        <div 
            className="roulette-wheel"
            style={{ 
                transform: `rotate(${rotation}deg)`,
                background: wheelBackground
            }}
        >
            {/* Render Labels */}
            {items.map((item, index) => {
                const segmentAngle = 360 / items.length;
                const angle = segmentAngle * index + (segmentAngle / 2); // Center of segment
                return (
                    <div 
                        key={index}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            // Move text further out (translate Y -100px) and ensure text is upright-ish for some layouts, 
                            // but for wheels usually radial text is best.
                            transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, -110px) rotate(90deg)`,
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                            textShadow: '0 0 2px rgba(255,255,255,0.8)',
                            writingMode: 'horizontal-tb' 
                        }}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
      </div>

      <div className="roulette-result">
        {result ? `結果是：${result}！` : '轉動轉盤！'}
      </div>

      <button className="game-action-btn" onClick={spin} disabled={spinning}>
        開始
      </button>
    </div>
  );
};

export default Roulette;
