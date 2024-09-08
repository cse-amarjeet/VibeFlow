'use client'

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Breathing() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showTimings, setShowTimings] = useState(true);
  const [showCircleTime, setShowCircleTime] = useState(true);
  const [settings, setSettings] = useState({
    breatheIn: 4,
    hold: 4,
    breatheOut: 6,
    pause: 2,
    beepOnPhaseChange: true
  });

  const breathInSound = useRef(null);
  const breathOutSound = useRef(null);
  const restSound = useRef(null);
  const backgroundMusic = useRef(null);

  useEffect(() => {
    // Initialize audio elements
    breathInSound.current = new Audio('/music/breathin.mp3');
    breathOutSound.current = new Audio('/music/breathout.mp3');
    restSound.current = new Audio('/music/rest.mp3');
    backgroundMusic.current = new Audio('/music/deepmusic.mp3');
    
    // Set background music volume to 8%
    backgroundMusic.current.volume = 0.08;
    backgroundMusic.current.loop = true;
    
    // Start playing background music
    backgroundMusic.current.play();

    return () => {
      // Stop all sounds when component unmounts
      breathInSound.current.pause();
      breathOutSound.current.pause();
      restSound.current.pause();
      backgroundMusic.current.pause();
    };
  }, []);

  useEffect(() => {
    // Parse settings from URL parameters
    const breatheIn = parseFloat(searchParams.get('breatheIn')) || 4;
    const hold = parseFloat(searchParams.get('hold')) || 4;
    const breatheOut = parseFloat(searchParams.get('breatheOut')) || 6;
    const pause = parseFloat(searchParams.get('pause')) || 2;
    const beepOnPhaseChange = searchParams.get('beepOnPhaseChange') !== 'false';

    setSettings({ breatheIn, hold, breatheOut, pause, beepOnPhaseChange });
  }, [searchParams]);

  useEffect(() => {
    const { breatheIn, hold, breatheOut, pause, beepOnPhaseChange } = settings;
    const totalTime = breatheIn + hold + breatheOut + pause;
    let phaseTimer;
    let countdownTimer;

    function startBreathingCycle() {
      setPhase('Breathe In');
      setTimeLeft(breatheIn);
      if (beepOnPhaseChange) playSound(breathInSound.current);
      startCountdown(breatheIn);

      phaseTimer = setTimeout(() => {
        // Hold phase (if hold > 0)
        if (hold > 0) {
          setPhase('Hold');
          setTimeLeft(hold);
          if (beepOnPhaseChange) playSound(restSound.current);
          startCountdown(hold);

          phaseTimer = setTimeout(() => {
            startBreathOut();
          }, hold * 1000);
        } else {
          // Skip directly to Breathe Out if hold is 0
          startBreathOut();
        }
      }, breatheIn * 1000);
    }

    function startBreathOut() {
      setPhase('Breathe Out');
      setTimeLeft(breatheOut);
      if (beepOnPhaseChange) playSound(breathOutSound.current);
      startCountdown(breatheOut);

      phaseTimer = setTimeout(() => {
        // Pause phase (if pause > 0)
        if (pause > 0) {
          setPhase('Pause');
          setTimeLeft(pause);
          if (beepOnPhaseChange) playSound(restSound.current);
          startCountdown(pause);

          phaseTimer = setTimeout(() => {
            startBreathingCycle(); // Restart the cycle
          }, pause * 1000);
        } else {
          // Restart the cycle immediately if pause is 0
          startBreathingCycle();
        }
      }, breatheOut * 1000);
    }

    function startCountdown(duration) {
      clearInterval(countdownTimer);
      let timeRemaining = duration;
      
      countdownTimer = setInterval(() => {
        timeRemaining -= 0.1;
        setTimeLeft(Math.max(0, timeRemaining.toFixed(1)));
        
        if (timeRemaining <= 0) {
          clearInterval(countdownTimer);
        }
      }, 100);
    }

    startBreathingCycle();

    return () => {
      clearTimeout(phaseTimer);
      clearInterval(countdownTimer);
    };
  }, [settings]);

  function playSound(audioElement) {
    audioElement.currentTime = 0; // Reset to start
    audioElement.play();
  }

  function playBeep() {
    switch(phase) {
      case 'Breathe In':
        playSound(breathInSound.current);
        break;
      case 'Breathe Out':
        playSound(breathOutSound.current);
        break;
      case 'Hold':
      case 'Pause':
        playSound(restSound.current);
        break;
    }
  }

  const containerClass = phase === 'Breathe In' || phase === 'Hold' ? 'animate-grow' : 'animate-shrink';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500 text-white p-4">
      <h1 className="text-5xl font-bold mb-12 text-center">VibeFlow Breathing</h1>

      <div className={`relative flex items-center justify-center w-64 h-64 ${containerClass}`}
           style={{
             '--breathe-in-time': `${settings.breatheIn}s`,
             '--breathe-out-time': `${settings.breatheOut}s`
           }}>
        <div className="absolute w-full h-full bg-white bg-opacity-20 rounded-full"></div>
        <div className="absolute w-56 h-56 bg-white bg-opacity-30 rounded-full"></div>
        <div className="absolute w-48 h-48 bg-white bg-opacity-40 rounded-full"></div>
        <div className="absolute w-40 h-40 bg-white bg-opacity-50 rounded-full"></div>
        <div className="relative z-10 text-center">
          <p className="text-3xl font-semibold">{phase}</p>
          {showCircleTime && <p className="text-2xl">{timeLeft.toFixed(1)}s</p>}
        </div>
      </div>

      <div className="mt-12 flex space-x-8">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showTimings}
            onChange={() => setShowTimings(!showTimings)}
            className="form-checkbox h-5 w-5 text-teal-600"
          />
          <span>Show Timings</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCircleTime}
            onChange={() => setShowCircleTime(!showCircleTime)}
            className="form-checkbox h-5 w-5 text-teal-600"
          />
          <span>Show Time in Circle</span>
        </label>
      </div>

      {showTimings && (
        <div className="mt-8 text-center bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-lg">Breathe In: {settings.breatheIn}s</p>
          <p className="text-lg">Hold: {settings.hold}s</p>
          <p className="text-lg">Breathe Out: {settings.breatheOut}s</p>
          <p className="text-lg">Pause: {settings.pause}s</p>
        </div>
      )}
    </div>
  );
}
