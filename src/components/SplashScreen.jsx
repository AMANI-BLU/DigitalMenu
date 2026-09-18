import React, { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish, duration = 1400 }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, duration - 350);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[999] bg-[#0c0d12] flex flex-col items-center justify-center transition-opacity duration-350 ease-out select-none px-6 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-600/15 blur-3xl -top-10 animate-pulse pointer-events-none"></div>
      <div className="absolute w-72 h-72 rounded-full bg-amber-500/15 blur-3xl -bottom-10 animate-pulse pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated Ring & Logo */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-amber-300 to-emerald-500 shadow-2xl shadow-amber-500/20 animate-spin-slow">
            <div className="w-full h-full rounded-full p-1 bg-[#0c0d12]">
              <img 
                src="/abu-coffee-logo.png" 
                alt="Abu Coffee" 
                className="w-full h-full rounded-full object-cover shadow-inner"
              />
            </div>
          </div>

          {/* Pulse Ripple */}
          <div className="absolute inset-0 rounded-full border border-amber-400/40 animate-ping pointer-events-none"></div>
        </div>

        {/* Brand Text */}
        <h1 
          className="text-2xl sm:text-3xl font-black text-white tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Abu Coffee
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400/90 font-bold mt-1">
          Ethiopia · Digital Menu
        </p>

        {/* Animated Loading Bar */}
        <div className="w-36 h-1 bg-[#1e2232] rounded-full overflow-hidden mt-8">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
}
