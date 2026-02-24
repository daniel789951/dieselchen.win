import { useState, useEffect, useRef } from 'react';

const IDLE_TIMEOUT_MS = 7000 //3 * 60 * 1000;  // 3 分鐘
const SPECIAL_GIF_DURATION_MS = 6000;   // 特殊 GIF 播放時長（ms），依實際 GIF 長度調整
const SPECIAL_GIF_2_PROB = 0.01;        // 1% 機率播放第二個 GIF

const MainImage = ({ isWorking }) => {
  const [isLunchTime, setIsLunchTime] = useState(false);
  const [specialGifSrc, setSpecialGifSrc] = useState(null);
  const idleTimerRef = useRef(null);
  const gifPlayTimerRef = useRef(null);

  useEffect(() => {
    const checkLunchTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const totalMinutes = currentHour * 60 + currentMinute;

      // 午餐時間: 11:50 - 13:30
      const startLunch = 11 * 60 + 50;  // 11:50
      const endLunch = 13 * 60 + 30;     // 13:30
      const isLunch = totalMinutes >= startLunch && totalMinutes < endLunch;

      setIsLunchTime(isLunch);
    };

    // 每秒檢查一次
    const intervalId = setInterval(checkLunchTime, 1000);
    checkLunchTime(); // 立即執行一次

    return () => clearInterval(intervalId);
  }, []);

  // 閒置計時器：停留 3 分鐘後觸發特殊 GIF
  useEffect(() => {
    const playSpecialGif = () => {
      const src = Math.random() < SPECIAL_GIF_2_PROB ? '/塊陶啊2.gif' : '/塊陶啊1.gif';
      setSpecialGifSrc(`${src}?t=${Date.now()}`); // cache-bust 確保 GIF 從頭播放

      gifPlayTimerRef.current = setTimeout(() => {
        setSpecialGifSrc(null);
        scheduleNextPlay(); // 播放完畢，重置 3 分鐘倒計時
      }, SPECIAL_GIF_DURATION_MS);
    };

    const scheduleNextPlay = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(playSpecialGif, IDLE_TIMEOUT_MS);
    };

    scheduleNextPlay(); // 頁面載入即開始計時

    return () => {
      clearTimeout(idleTimerRef.current);
      clearTimeout(gifPlayTimerRef.current);
    };
  }, []);

  // Assets in the public folder are served at the root path
  let src;
  if (isLunchTime) {
    src = '/吃午餐.gif';
  } else {
    src = isWorking ? '/疲憊上班族.gif' : '/大家可以回家拉.gif';
  }

  return (
    <img
      id="main-image"
      src={specialGifSrc ?? src}
      alt="狀態圖片"
    />
  );
};

export default MainImage;
