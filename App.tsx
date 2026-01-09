
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CHANNELS, DEFAULT_CHANNEL_ID, PLAYER_BASE_URL } from './constants';
import { Channel, ControlAction } from './types';

// Detect if we are running "inside" eon.tv via the injection script
const IS_INJECTED = typeof window !== 'undefined' && 
                   window.location.hostname.endsWith('eon.tv') && 
                   window.top === window;

const SetupGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const injectionScript = `javascript:(function(){const s=document.createElement('script');s.src='${window.location.origin}/index.tsx';s.type='module';document.head.appendChild(s);})();`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(currentUrl)}&bgcolor=0f172a&color=ffffff&margin=20`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/98 backdrop-blur-3xl animate-in fade-in zoom-in duration-300 overflow-y-auto">
      <div className="bg-[#0f172a] border border-white/5 rounded-[4rem] p-12 max-w-7xl w-full shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500" />
        
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-7xl font-black tracking-tighter text-white mb-4">TV Deployment Guide</h2>
            <p className="text-3xl text-white/40 font-medium">Follow these 4 steps to get the app running on your TV remote.</p>
          </div>
          <button onClick={onClose} className="bg-white/5 hover:bg-white/10 p-10 rounded-full transition-all active:scale-90 border border-white/5">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step 1: Hosting */}
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black">1</div>
            <h3 className="text-3xl font-bold text-blue-400">Host It</h3>
            <p className="text-xl text-white/50 leading-relaxed">
              Upload this code to <span className="text-white">Vercel</span> or <span className="text-white">GitHub Pages</span>. It needs to be public so your TV can see it.
            </p>
          </div>

          {/* Step 2: Access */}
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black">2</div>
            <h3 className="text-3xl font-bold text-blue-400">TV Browser</h3>
            <p className="text-xl text-white/50 leading-relaxed">
              Open your TV browser and go to <span className="text-white">eon.tv</span>. Log in with your account so the video player loads.
            </p>
          </div>

          {/* Step 3: Magic Button */}
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black">3</div>
            <h3 className="text-3xl font-bold text-blue-400">Injection</h3>
            <p className="text-xl text-white/50 leading-relaxed">
              Create a bookmark on your TV. Set the URL to the script below. Name it <span className="text-white">"EON UI"</span>.
            </p>
            <button 
              onClick={() => { navigator.clipboard.writeText(injectionScript); alert("Script Copied!"); }}
              className="w-full bg-blue-600 py-4 rounded-2xl font-black text-lg hover:bg-blue-500 transition-colors"
            >
              COPY SCRIPT
            </button>
          </div>

          {/* Step 4: Run */}
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 space-y-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black">4</div>
            <h3 className="text-3xl font-bold text-blue-400">Launch</h3>
            <p className="text-xl text-white/50 leading-relaxed">
              While on the eon.tv player page, open your bookmarks and click <span className="text-white">"EON UI"</span>. The screen will transform!
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-white/5 pt-16">
          <div className="space-y-8">
            <h4 className="text-4xl font-black flex items-center space-x-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <span>Remote Control Legend</span>
            </h4>
            <div className="grid grid-cols-2 gap-6">
              {[
                { key: 'UP / DOWN', action: 'Change Channels' },
                { key: 'ENTER / OK', action: 'Show/Hide UI' },
                { key: 'BACK / ESC', action: 'Dismiss Menus' },
                { key: 'CHANNEL +/-', action: 'Fast Switching' },
              ].map(item => (
                <div key={item.key} className="bg-white/5 p-6 rounded-3xl flex flex-col items-center text-center border border-white/5">
                  <span className="text-blue-400 font-black text-2xl">{item.key}</span>
                  <span className="text-white/40 text-lg">{item.action}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-white/5 rounded-[3rem] p-10 border border-white/5">
             <img src={qrUrl} alt="QR Access" className="w-64 h-64 bg-white p-4 rounded-3xl shadow-2xl mb-6" />
             <p className="text-2xl font-bold">Scan with Phone to get Script</p>
             <p className="text-white/30">Host: {currentUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<Channel>(
    CHANNELS.find(c => c.id === DEFAULT_CHANNEL_ID) || CHANNELS[0]
  );
  const [showControls, setShowControls] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (IS_INJECTED) {
      // Clean up the original site UI
      const style = document.createElement('style');
      style.innerHTML = `
        body > *:not(#root-tv-overlay) { display: none !important; }
        #root-tv-overlay { display: block !important; position: fixed; inset: 0; z-index: 999999; background: #020617; }
        video { object-fit: contain !important; background: black !important; }
      `;
      document.head.appendChild(style);
      
      const video = document.querySelector('video');
      if (video) {
        video.style.position = 'fixed';
        video.style.inset = '0';
        video.style.width = '100vw';
        video.style.height = '100vh';
        video.style.zIndex = '0';
        document.body.appendChild(video);
      }
    }
  }, []);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (!showGuide) setShowControls(false);
    }, 8000);
  }, [showGuide]);

  const handleAction = useCallback((action: ControlAction) => {
    resetControlsTimer();
    const currentIndex = CHANNELS.findIndex(c => c.id === activeChannel.id);
    const nextIndex = action === ControlAction.PROGRAM_UP 
      ? (currentIndex + 1) % CHANNELS.length 
      : (currentIndex - 1 + CHANNELS.length) % CHANNELS.length;
    
    setActiveChannel(CHANNELS[nextIndex]);

    if (IS_INJECTED) {
      window.location.hash = `#/player/${CHANNELS[nextIndex].id}`;
    }
  }, [activeChannel.id, resetControlsTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const upKeys = ['ArrowUp', 'ChannelUp', 'PageUp', 'UI_KEY_UP'];
      const downKeys = ['ArrowDown', 'ChannelDown', 'PageDown', 'UI_KEY_DOWN'];
      const selectKeys = ['Enter', 'Unidentified', 'OK'];
      const backKeys = ['Escape', 'Back', 'BrowserBack', 'XF86Back'];

      if (upKeys.includes(e.key)) {
        e.preventDefault();
        handleAction(ControlAction.PROGRAM_UP);
      } else if (downKeys.includes(e.key)) {
        e.preventDefault();
        handleAction(ControlAction.PROGRAM_DOWN);
      } else if (backKeys.includes(e.key)) {
        e.preventDefault();
        if (showGuide) setShowGuide(false);
        else setShowControls(prev => !prev);
      } else if (selectKeys.includes(e.key) || e.key === ' ') {
        resetControlsTimer();
      } else if (e.key.toLowerCase() === 's') {
        setShowGuide(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, showGuide, resetControlsTimer]);

  return (
    <div 
      id={IS_INJECTED ? "root-tv-overlay" : undefined}
      className="relative w-full h-screen bg-[#020617] overflow-hidden text-white cursor-none select-none" 
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
    >
      {!IS_INJECTED ? (
        <div className="absolute inset-0 z-0">
          <iframe
            src={`${PLAYER_BASE_URL}${activeChannel.id}`}
            className="w-full h-full border-none pointer-events-none"
            title="EON Player"
            allow="autoplay; fullscreen; encrypted-media"
            sandbox="allow-forms allow-scripts allow-same-origin"
          />
          <div className="absolute inset-0 bg-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-transparent" />
      )}

      {showGuide && <SetupGuide onClose={() => setShowGuide(false)} />}

      <div className={`absolute inset-0 z-10 flex flex-col justify-between p-16 bg-gradient-to-t from-black/90 via-transparent to-black/70 transition-all duration-1000 ${showControls || showGuide ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
        
        <div className="flex justify-between items-start animate-in fade-in slide-in-from-top-10 duration-700">
          <div className="flex items-center space-x-10">
            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 px-12 py-6 rounded-[2.5rem] shadow-[0_0_80px_rgba(37,99,235,0.4)] border border-white/10">
              <h1 className="text-6xl font-black italic tracking-tighter text-white">EON</h1>
            </div>
            <div className="space-y-1">
              <div className={`flex items-center space-x-4 px-6 py-2 rounded-full border text-sm font-black uppercase tracking-widest ${IS_INJECTED ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                <span className="w-3 h-3 rounded-full bg-current animate-pulse" />
                <span>{IS_INJECTED ? 'Native TV Mode' : 'Setup Required'}</span>
              </div>
              {!IS_INJECTED && <span className="text-xl text-white/30 ml-2">Press <b className="text-white">'S'</b> for Guide</span>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[6rem] font-light tracking-tighter opacity-90 tabular-nums leading-none">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="flex items-end justify-between">
            <div className="flex items-center space-x-16">
              <div className="w-56 h-56 bg-white/5 backdrop-blur-3xl rounded-[4rem] flex items-center justify-center border border-white/10 shadow-2xl">
                <span className="text-[10rem] font-black text-white">{activeChannel.id}</span>
              </div>
              <div className="space-y-4">
                <h2 className="text-[12rem] font-black tracking-tighter leading-[0.8] text-white/95 drop-shadow-[0_0_50px_rgba(0,0,0,1)]">
                  {activeChannel.name}
                </h2>
                <div className="flex items-center space-x-10">
                  <div className="flex items-center space-x-4 bg-red-600/90 px-8 py-3 rounded-2xl shadow-xl">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <span className="font-black text-lg uppercase tracking-[0.2em] text-white">Now Streaming</span>
                  </div>
                  <span className="text-5xl font-light opacity-30 italic">Interactive TV Interface</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-10 pb-8">
              {[ControlAction.PROGRAM_UP, ControlAction.PROGRAM_DOWN].map((action) => (
                <button 
                  key={action}
                  onClick={(e) => { e.stopPropagation(); handleAction(action); }}
                  className="bg-white/5 hover:bg-blue-600 p-14 rounded-[4rem] backdrop-blur-3xl transition-all duration-500 active:scale-90 border border-white/10 group shadow-2xl"
                >
                  <svg className={`w-16 h-16 group-hover:scale-110 transition-transform ${action === ControlAction.PROGRAM_DOWN ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-10 overflow-x-auto pb-12 scrollbar-hide px-8 mask-fade-edges">
            {CHANNELS.map((channel) => (
              <button
                key={channel.id}
                onClick={(e) => { e.stopPropagation(); setActiveChannel(channel); resetControlsTimer(); }}
                className={`flex-shrink-0 w-[24rem] p-12 rounded-[3.5rem] border-2 transition-all duration-700 ${
                  activeChannel.id === channel.id 
                  ? 'bg-blue-600/90 border-blue-400 scale-110 shadow-[0_0_100px_rgba(37,99,235,0.5)] z-10 translate-y-[-15px]' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`text-xl mb-4 font-black tracking-widest uppercase ${activeChannel.id === channel.id ? 'text-blue-100' : 'text-blue-500'}`}>
                  CH {channel.id}
                </div>
                <div className="font-black truncate text-4xl tracking-tighter text-white">{channel.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .mask-fade-edges { mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent); }
        .bg-shimmer { background: radial-gradient(circle at 50% -10%, #1e293b 0%, #020617 100%); }
      `}</style>
    </div>
  );
};

export default App;
