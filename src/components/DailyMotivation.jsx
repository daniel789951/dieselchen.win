import React, { useState, useEffect } from 'react';
import { motivationQuotes } from '../data/quotes';

const DailyMotivation = () => {
  const [quote, setQuote] = useState('');

  const refreshQuote = () => {
    const randomQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
    setQuote(randomQuote);
  };

  useEffect(() => {
    refreshQuote();
  }, []);

  return (
    <div className="daily-motivation" onClick={refreshQuote} title="點擊換一句">
      <div className="motivation-icon">💡</div>
      <div className="motivation-text">{quote}</div>
    </div>
  );
};

export default DailyMotivation;
