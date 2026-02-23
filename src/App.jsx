import React, { useState, useEffect, useRef } from 'react';
import TimerBox from './components/TimerBox';
import Quote from './components/Quote';
import Popup from './components/Popup';
import BlogLink from './components/BlogLink';
import MainImage from './components/MainImage';
import './App.css'; // Ensure CSS is imported
import DailyMotivation from './components/DailyMotivation';
import MiniGamesWidget from './components/MiniGames/MiniGamesWidget';
import { workQuotes, offworkQuotes } from './data/quotes';

// Helper for sound
const playDingSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1); 

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

// Animation helpers
const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#ff69b4', '#95e1d3'];
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
};

const createBalloon = () => {
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
};

const triggerCelebration = () => {
    for (let i = 0; i < 100; i++) setTimeout(createConfetti, i * 50);
    for (let i = 0; i < 20; i++) setTimeout(createBalloon, i * 200);

    const interval = setInterval(() => {
        createConfetti();
        if (Math.random() > 0.7) createBalloon();
    }, 300);

    setTimeout(() => clearInterval(interval), 5000);
};

// Shifts
const shifts = [
    { id: 'timer-normal', name: '正常班', startHour: 8, startMinute: 50, endHour: 17, endMinute: 30 }
];

function App() {
    const [timers, setTimers] = useState({});
    const [isWorking, setIsWorking] = useState(false);
    const [quote, setQuote] = useState('');
    const [showRestingPopup, setShowRestingPopup] = useState(false);
    const [showOffWorkPopup, setShowOffWorkPopup] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [isRestingTime, setIsRestingTime] = useState(false);

    // Refs to track state without triggering re-renders for logic checks
    const restingClosedRef = useRef(false);
    const offWorkClosedRef = useRef(false);
    const prevOffWorkStateRef = useRef(false);
    const celebrationTriggeredRef = useRef({});
    const clockOutNotificationSentRef = useRef(false);

    // 請求通知權限
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                setNotificationPermission(permission);
            });
        } else if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    // 發送打卡提醒通知
    const sendClockOutNotification = () => {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('⏰ 打卡提醒', {
                body: '現在是下午 5:30，記得打卡下班喔！',
                icon: '/疲憊上班族.gif',
                tag: 'clock-out-reminder',
                requireInteraction: true
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }
    };

    useEffect(() => {
        const updateTick = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const day = now.getDay();
            const totalMinutes = currentHour * 60 + currentMinute;

            // 1. Update Timers & Check Working Status
            const newTimers = {};
            let anyoneWorking = false;

            shifts.forEach(shift => {
                const startTime = new Date();
                startTime.setHours(shift.startHour, shift.startMinute, 0, 0);
                const endTime = new Date();
                endTime.setHours(shift.endHour, shift.endMinute, 0, 0);

                let timeLeft;
                let isFinished = false;

                if (now < startTime) {
                    const diff = endTime - now;
                    timeLeft = formatTime(diff);
                } else if (now >= startTime && now < endTime) {
                    anyoneWorking = true;
                    const diff = endTime - now;
                    timeLeft = formatTime(diff);

                    // Check for near end
                     if (diff <= 1000 && diff > 0) {
                        celebrationTriggeredRef.current[shift.id] = false;
                     }

                } else {
                    timeLeft = '回家';
                    isFinished = true;
                    
                    if (celebrationTriggeredRef.current[shift.id] === undefined) {
                         // Initialize if undefined (first run might be after work)
                         celebrationTriggeredRef.current[shift.id] = true;
                    } else if (celebrationTriggeredRef.current[shift.id] === false) {
                        celebrationTriggeredRef.current[shift.id] = true;
                        triggerCelebration();
                    }
                }

                newTimers[shift.id] = { timeLeft, isFinished, shiftTime: `${shift.endHour}:${shift.endMinute.toString().padStart(2, '0')}` };
            });

            setTimers(newTimers);
            
            // 2. Update IsWorking State & Quote (Only if changed to avoid jitter)
            if (isWorking !== anyoneWorking) {
                setIsWorking(anyoneWorking);
                const quotes = anyoneWorking ? workQuotes : offworkQuotes;
                setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            } else if (!quote) {
                 // Initial quote
                 const quotes = anyoneWorking ? workQuotes : offworkQuotes;
                 setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
            }


            // 3. Check Clock Out Notification (17:30)
            const clockOutTime = 17 * 60 + 30; // 17:30
            if (totalMinutes === clockOutTime && !clockOutNotificationSentRef.current) {
                sendClockOutNotification();
                clockOutNotificationSentRef.current = true;
            } else if (totalMinutes !== clockOutTime) {
                // 重置標記，以便明天可以再次發送
                clockOutNotificationSentRef.current = false;
            }

            // 4. Check Popups
            // Resting: 12:00 - 13:30
            const startRest = 12 * 60;
            const endRest = 13 * 60 + 30;
            const isResting = totalMinutes >= startRest && totalMinutes < endRest;

            setIsRestingTime(isResting);

            if (isResting) {
                if (!restingClosedRef.current) setShowRestingPopup(true);
            } else {
                restingClosedRef.current = false;
                setShowRestingPopup(false);
            }

            // Off Work: Weekday 17:30 - Next 07:00
            const isWeekdayEvening = (day >= 1 && day <= 5) && (totalMinutes >= 17 * 60 + 30);
            const isPostWorkMorning = (day >= 2 && day <= 6) && (totalMinutes < 7 * 60);
            const isOffWorkPopupTime = isWeekdayEvening || isPostWorkMorning;

            if (isOffWorkPopupTime) {
                if (!offWorkClosedRef.current) {
                    setShowOffWorkPopup(true);
                    if (!prevOffWorkStateRef.current) playDingSound();
                }
            } else {
                offWorkClosedRef.current = false;
                setShowOffWorkPopup(false);
            }
            prevOffWorkStateRef.current = isOffWorkPopupTime;
        };

        const intervalId = setInterval(updateTick, 1000);
        updateTick(); // Run immediately

        return () => clearInterval(intervalId);
    }, [isWorking, quote]); // dependencies minimal check

    const formatTime = (ms) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <>
            <MainImage isWorking={isWorking} />

            <div id="countdown">
                <div id="timers-container">
                    {shifts.map(shift => (
                        <TimerBox
                            key={shift.id}
                            name={shift.name}
                            shiftTime={timers[shift.id]?.shiftTime || '...'}
                            timeLeft={timers[shift.id]?.timeLeft || '00:00:00'}
                            isFinished={timers[shift.id]?.isFinished}
                        />
                    ))}
                </div>
            </div>

            <BlogLink />
            <DailyMotivation />
            <Quote text={quote} isWorking={isWorking} isRestingTime={isRestingTime} />

            <Popup 
                isOpen={showRestingPopup} 
                onClose={() => { setShowRestingPopup(false); restingClosedRef.current = true; }}
                title="😴 休息中"
                titleColor="#ff6b6b"
                content={<p>現在是午休時間 (12:00 - 13:30)<br/>請勿打擾，正在充電...</p>}
                icon="🍱🍵"
                buttonColor="#ff6b6b"
                buttonText="好，我知道了"
            />

            <Popup 
                isOpen={showOffWorkPopup} 
                onClose={() => { setShowOffWorkPopup(false); offWorkClosedRef.current = true; }}
                title="🎉 下班啦！"
                titleColor="#4ecdc4"
                content={
                    <>
                        <p>現在時間 17:30</p>
                        <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#4ecdc4' }}>該打卡下班啦</p>
                        <p className="sub-text">好好休息，明天見！</p>
                    </>
                }
                icon="🏃‍♂️💨"
                buttonColor="#4ecdc4"
                buttonText="下班！"
            />
            
            <MiniGamesWidget />
        </>
    );
}

export default App;
