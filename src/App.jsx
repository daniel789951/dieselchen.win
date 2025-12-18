import { useState, useEffect, useRef } from 'react';
import RestingPopup from './RestingPopup';
import OffWorkPopup from './OffWorkPopup';
import { playDingSound } from './audioUtils';
// Import images so Vite processes them
import tiredGif from '../疲憊上班族.gif';
import homeGif from '../大家可以回家拉.gif';

/* Logic Constants */
const shifts = [
  { id: 'timer-normal', name: '正常班', startHour: 8, startMinute: 50, endHour: 17, endMinute: 30 },
  { id: 'timer-late', name: '晚班', startHour: 9, startMinute: 50, endHour: 18, endMinute: 30 },
  { id: 'timer-finance', name: '金控', startHour: 9, startMinute: 0, endHour: 18, endMinute: 0 }
];

const offworkQuotes = [
  '終於可以回家了！',
  '回家吃飯囉～',
  '下班萬歲！',
  '自由的感覺真好！',
  '今天辛苦了！',
  '回家的路上最美麗',
  '終於解放了！',
  '家，我回來了！',
  '打卡下班，開心回家',
  '又是充實的一天',
  '期待已久的下班時刻',
  '準備享受自己的時間了'
];

const workQuotes = [
  '明明昨天還好好的啊!?',
  '今天又是充滿挑戰的一天...',
  '咖啡...需要更多咖啡...',
  '為什麼周一這麼快就到了',
  '深呼吸，你可以的！',
  '距離下班還有好久...',
  '又是努力搬磚的一天',
  '加油！撐過今天就好',
  '會議怎麼這麼多啊',
  '想念被窩的溫暖',
  '這個 bug 怎麼還在...',
  '堅持住，等等就下班了'
];

/* Helper Animations */
function createConfetti() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#ff69b4', '#95e1d3'];
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.style.left = Math.random() * 100 + 'vw';
  confetti.style.top = '-10px';
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.animationDelay = Math.random() * 0.5 + 's';
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 3000);
}

function createBalloon() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#ff69b4', '#95e1d3'];
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  balloon.style.left = Math.random() * 90 + 5 + 'vw';
  balloon.style.top = '100vh';
  balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  balloon.style.setProperty('--float-x', (Math.random() - 0.5) * 200 + 'px');
  balloon.style.animationDelay = Math.random() * 0.5 + 's';
  document.body.appendChild(balloon);
  setTimeout(() => balloon.remove(), 5000);
}

function triggerCelebration() {
  for (let i = 0; i < 100; i++) {
    setTimeout(() => createConfetti(), i * 50);
  }
  for (let i = 0; i < 20; i++) {
    setTimeout(() => createBalloon(), i * 200);
  }
}

export default function App() {
  const [now, setNow] = useState(new Date());
  
  // State
  const [isWorking, setIsWorking] = useState(false);
  const [quote, setQuote] = useState('');
  const [celebratedShifts, setCelebratedShifts] = useState({});

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine working status
  useEffect(() => {
    let anyoneWorking = false;
    for (const shift of shifts) {
      const startTime = new Date(now);
      startTime.setHours(shift.startHour, shift.startMinute, 0, 0);
      const endTime = new Date(now);
      endTime.setHours(shift.endHour, shift.endMinute, 0, 0);

      if (now >= startTime && now < endTime) {
        anyoneWorking = true;
        break;
      }
    }

    if (anyoneWorking !== isWorking) {
      setIsWorking(anyoneWorking);
      // Update Quote when status changes
      const quotesArray = anyoneWorking ? workQuotes : offworkQuotes;
      setQuote(quotesArray[Math.floor(Math.random() * quotesArray.length)]);
    } else if (quote === '') {
       // Initial quote
       const quotesArray = anyoneWorking ? workQuotes : offworkQuotes;
       setQuote(quotesArray[Math.floor(Math.random() * quotesArray.length)]);
    }
  }, [now, isWorking, quote]);

  // Check for celebration triggers
  useEffect(() => {
    // Only celebrate if explicitly transitioned to "Home" (finished) for a shift
    // We check purely based on time remaining logic in render, but for side-effects we do it here?
    // Actually, let's keep it simple. If a shift just ended, trigger.
    
    // We'll rely on the rendering logic to update 'celebratedShifts' state if needed, but setState in render is bad.
    // Instead we can check in this effect.
    
    shifts.forEach(shift => {
        const startTime = new Date(now);
        startTime.setHours(shift.startHour, shift.startMinute, 0, 0);
        const endTime = new Date(now);
        endTime.setHours(shift.endHour, shift.endMinute, 0, 0);
        
        // If we are past end time, but haven't celebrated yet today (or reasonably recently)
        // The original logic was: "If just became finished"
        
        // Simplified Logic: If now > endTime and !celebratedShifts[id]
        // But we need to reset it next day. 
        // For simplicity, we just trigger if we detect transition.
        
        // Let's stick to the visual check: render will show "Home".
        // Use a ref to track previous "finished" state to detect Edge trigger? 
        // Or just re-implement the exact logic:
        
        // Original logic:
        // if (now < startTime) ...
        // else if (now >= startTime && now < endTime) -> reset triggered=false
        // else -> if triggered=false -> trigger(), set triggered=true
        
        const isBeforeStart = now < startTime;
        const isWorkingShift = now >= startTime && now < endTime;
        const isFinished = now >= endTime;
        
        if (isWorkingShift) {
             // Mark as 'not yet celebrated' (i.e. currently working)
             if (celebratedShifts[shift.id] !== false) {
                 setCelebratedShifts(prev => ({...prev, [shift.id]: false}));
             }
        } else if (isFinished) {
             // Only celebrate if explicitly transitioned from 'working' state (false)
             // rigid check === false ensures we don't trigger on undefined (initial load)
             if (celebratedShifts[shift.id] === false) {
                 triggerCelebration();
                 setCelebratedShifts(prev => ({...prev, [shift.id]: true}));
             }
        }
    });

  }, [now, celebratedShifts]);


  // Calculate Resting Popup State
  // 12:00 - 13:30
  const isRestingTime = (() => {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const startRest = 12 * 60; // 12:00
    const endRest = 13 * 60 + 30; // 13:30
    
    return totalMinutes >= startRest && totalMinutes < endRest;
  })();

  // Off Work Popup State
  // Weekdays (Mon-Fri) 17:30 to Next Day 07:00
  // Mon=1 ... Fri=5.
  // Logic: 
  //   IF (Workday AND Time >= 17:30)
  //   OR (Tue-Sat AND Time < 07:00) (This covers the "Next Day" morning part for Mon-Fri nights)
  const isOffWorkPopupTime = (() => {
      const day = now.getDay(); // 0-6
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      
      const isWeekdayEvening = (day >= 1 && day <= 5) && (totalMinutes >= 17 * 60 + 30);
      // Tuesday(2) morning covers Monday night. Saturday(6) morning covers Friday night.
      const isPostWorkMorning = (day >= 2 && day <= 6) && (totalMinutes < 7 * 60);

      return isWeekdayEvening || isPostWorkMorning;
  })();

  // Sound Effect Trigger
  // We want to trigger ONCE when we enter the state, or on initial load if in state
  const [hasPlayedDing, setHasPlayedDing] = useState(false);
  const prevOffWorkState = useRef(false);

  useEffect(() => {
      // If we just entered the off work state
      if (isOffWorkPopupTime && !prevOffWorkState.current) {
          playDingSound();
      }
      prevOffWorkState.current = isOffWorkPopupTime;
  }, [isOffWorkPopupTime]);


  // Render Helper
  const renderTimer = (shift) => {
    const startTime = new Date(now);
    startTime.setHours(shift.startHour, shift.startMinute, 0, 0);
    const endTime = new Date(now);
    endTime.setHours(shift.endHour, shift.endMinute, 0, 0);
    
    let content;
    let className = "timer";

    if (now < startTime) {
        // Counting down to End of shift (essentially assumes you start working?)
        // Original logic: "Hasn't started work, count down to end time" (Wait, really?)
        // Original: `const diff = endTime - now;` ... YES. Even if not started, it counts to end.
        
        const diff = endTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        content = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else if (now >= startTime && now < endTime) {
        // Working
        const diff = endTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        content = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        // Finished
        content = '回家';
        className += " finished";
    }

    return (
      <div className="timer-box" key={shift.id}>
        <h3>{shift.name}</h3>
        <div className="shift-time">{String(shift.endHour).padStart(2,'0')}:{String(shift.endMinute).padStart(2,'0')}</div>
        <div className={className} id={shift.id}>{content}</div>
      </div>
    );
  };

  // State for closing popups manually in this session
  const [restingClosed, setRestingClosed] = useState(false);
  const [offWorkClosed, setOffWorkClosed] = useState(false);

  useEffect(() => {
    if (!isRestingTime) setRestingClosed(false);
  }, [isRestingTime]);

  useEffect(() => {
    if (!isOffWorkPopupTime) setOffWorkClosed(false);
  }, [isOffWorkPopupTime]);

  return (
    <>
      <img id="main-image" src={isWorking ? tiredGif : homeGif} alt="狀態圖片" />

      <RestingPopup 
        isOpen={isRestingTime && !restingClosed} 
        onClose={() => setRestingClosed(true)} 
      />
      <OffWorkPopup 
        isOpen={isOffWorkPopupTime && !offWorkClosed} 
        onClose={() => setOffWorkClosed(true)} 
      />

      <div id="countdown">
        <div id="timers-container">
          {shifts.map(renderTimer)}
        </div>
      </div>

      <div id="blog-link">
        <h3>技術顧問</h3>
        <a href="https://blog.giveanornot.com/" target="_blank" rel="noopener noreferrer">
            前往部落格
        </a>
      </div>

      <div id="quote" className={`quote show ${isWorking ? 'working' : 'offwork'}`}>
        {quote}
      </div>
    </>
  );
}
