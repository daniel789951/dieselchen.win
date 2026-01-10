import React from 'react';

const Quote = ({ text, isWorking, isRestingTime }) => {
  // 午休時間不顯示語錄
  if (isRestingTime) {
    return null;
  }

  return (
    <div
      id="quote"
      className={`show ${isWorking ? 'working' : 'offwork'}`}
    >
      {text}
    </div>
  );
};

export default Quote;
