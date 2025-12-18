export const playDingSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // "Ding" sound: High pitch sine wave with quick exponential decay
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime); // High pitch notification
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1); 

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};
