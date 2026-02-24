import { useState, useEffect, useRef } from 'react';

const IDLE_TIMEOUT_MS = 2000 //3 * 60 * 1000;  // 3 分鐘
const SPECIAL_GIF_DURATION_MS = 6500;   // 特殊 GIF 播放時長（ms），依實際 GIF 長度調整
const SPECIAL_GIF_2_PROB = 0.01;        // 1% 機率播放第二個 GIF

const MainImage = ({ isWorking }) => {
  const [isLunchTime, setIsLunchTime] = useState(false);
  const [specialGifSrc, setSpecialGifSrc] = useState(null);
  const [countdownNum, setCountdownNum] = useState(null); // null=不顯示, 5-1=倒數中
  const idleTimerRef = useRef(null);
  const gifPlayTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

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

    const intervalId = setInterval(checkLunchTime, 1000);
    checkLunchTime();

    return () => clearInterval(intervalId);
  }, []);

  // 閒置計時器：停留 3 分鐘後觸發倒數 + 特殊 GIF
  useEffect(() => {
    const triggerSequence = () => {
      // Phase 1: 部門解散倒數 5 秒
      let current = 5;
      setCountdownNum(current);
      countdownIntervalRef.current = setInterval(() => {
        current--;
        if (current <= 0) {
          clearInterval(countdownIntervalRef.current);
          setCountdownNum(null);
          // Phase 2: 顯示特殊 GIF
          const gifSrc = Math.random() < SPECIAL_GIF_2_PROB ? '/塊陶啊2.gif' : '/塊陶啊1.gif';
          setSpecialGifSrc(`${gifSrc}?t=${Date.now()}`);
          gifPlayTimerRef.current = setTimeout(() => {
            setSpecialGifSrc(null);
            scheduleNextPlay();
          }, SPECIAL_GIF_DURATION_MS);
        } else {
          setCountdownNum(current);
        }
      }, 1000);
    };

    const scheduleNextPlay = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(triggerSequence, IDLE_TIMEOUT_MS);
    };

    scheduleNextPlay();

    return () => {
      clearTimeout(idleTimerRef.current);
      clearTimeout(gifPlayTimerRef.current);
      clearInterval(countdownIntervalRef.current);
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
    <>
      <img id="main-image" src={src} alt="狀態圖片" />

      {countdownNum !== null && (
        <div className="alert-countdown-overlay">
          <div className="alert-countdown-title">⚠️ 部門解散倒數 ⚠️</div>
          <div className="alert-countdown-number" key={countdownNum}>{countdownNum}</div>
        </div>
      )}

      {specialGifSrc && (
        <div className="alert-gif-wrapper">
          <div className="alert-marquee-text" aria-hidden="true">
            {'塊陶啊!!! '.repeat(10)}
          </div>
          <img className="special-gif-overlay" src={specialGifSrc} alt="塊陶啊" />
        </div>
      )}
    </>
  );
};

export default MainImage;
