import React, { useState } from 'react';
import './MiniGames.css';
import SlotMachine from './SlotMachine';
import Roulette from './Roulette';
import Darts from './Darts';

const MiniGamesWidget = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  const FOOD_ITEMS = ['鼎泰豐', '一蘭拉麵', '饗饗', '麥當勞', '醐同燒肉', '旭集', '7-11', '永和豆漿'];
  const DRINK_ITEMS = ['WAT', 'Draft Land', '春水堂', '星巴克 101', '路易莎', '啜飲室', '50嵐', '全家'];

  return (
    <>
      {/* Floating Action Button */}
      <button className="minigame-fab" onClick={toggleMenu} title="小遊戲">
        🎮
      </button>

      {/* Menu */}
      {isMenuOpen && (
        <div className="minigame-menu">
          <button onClick={() => { setActiveGame('slots'); setIsMenuOpen(false); }}>
            🎰 Diesel 拉霸機
          </button>
          <button onClick={() => { setActiveGame('darts'); setIsMenuOpen(false); }}>
            🎯 射飛鏢挑戰
          </button>
          <button onClick={() => { setActiveGame('food'); setIsMenuOpen(false); }}>
            🍖 信義區吃什麼?
          </button>
          <button onClick={() => { setActiveGame('drink'); setIsMenuOpen(false); }}>
            🍹 信義區喝什麼?
          </button>
        </div>
      )}

      {/* Game Modal */}
      {activeGame && (
        <div className="game-modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) closeGame(); }}>
          <div className="game-modal">
            <button className="close-game-btn" onClick={closeGame}>&times;</button>
            
            {activeGame === 'slots' && <SlotMachine onClose={closeGame} />}
            
            {activeGame === 'darts' && <Darts />}
            
            {activeGame === 'food' && (
                <Roulette title="今晚吃什麼?" items={FOOD_ITEMS} />
            )}
            
            {activeGame === 'drink' && (
                <Roulette title="今晚喝什麼?" items={DRINK_ITEMS} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MiniGamesWidget;
