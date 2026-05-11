import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { THEMES, GENERAL_LORE } from './themes';
import { ThemeType, AppState, ThemeConfig } from './types';
import { Volume2, VolumeX, RefreshCcw, Activity, ShieldAlert, Cpu, Database, Binary, Radio, HardDrive } from 'lucide-react';

// Advanced Procedural Sound Engine
class SoundEngine {
  private ctx: AudioContext | null = null;
  private drone: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    }
  }

  updateDrone(profile: string, enabled: boolean) {
    if (!this.ctx || !this.masterGain) return;
    
    if (!enabled) {
      if (this.drone) {
        this.droneGain?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
        setTimeout(() => {
          this.drone?.stop();
          this.drone = null;
        }, 1000);
      }
      return;
    }

    if (!this.drone) {
      this.drone = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();
      this.drone.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      this.drone.start();
    }

    const now = this.ctx.currentTime;
    this.droneGain?.gain.setTargetAtTime(0.05, now, 1);

    switch (profile) {
      case 'void':
        this.drone.type = 'sine';
        this.drone.frequency.setTargetAtTime(40, now, 2);
        break;
      case 'cyber':
        this.drone.type = 'sawtooth';
        this.drone.frequency.setTargetAtTime(55, now, 2);
        break;
      case 'corrupt':
        this.drone.type = 'square';
        this.drone.frequency.setTargetAtTime(Math.random() * 80 + 30, now, 0.5);
        break;
      case 'cosmic':
        this.drone.type = 'sine';
        this.drone.frequency.setTargetAtTime(110, now, 4);
        break;
      case 'matrix':
        this.drone.type = 'sawtooth';
        this.drone.frequency.setTargetAtTime(44, now, 1);
        break;
      case 'vhs':
        this.drone.type = 'triangle';
        this.drone.frequency.setTargetAtTime(60, now, 2);
        break;
      case 'flesh':
        this.drone.type = 'sine';
        this.drone.frequency.setTargetAtTime(35, now, 3);
        break;
      default:
        this.drone.type = 'sine';
        this.drone.frequency.setTargetAtTime(80, now, 2);
    }
  }

  playMutation() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.4);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);
    osc.start();
    osc.stop(now + 0.4);
  }

  playClick(theme: ThemeType) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.masterGain);
    const now = this.ctx.currentTime;

    switch (theme) {
      case 'flesh':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(50, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        break;
      case 'vhs':
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        break;
      case 'cyberpunk':
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        break;
      default:
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
    }

    osc.start();
    osc.stop(now + 0.5);
  }

  playScream() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Sub-bass Thump for impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(100, now);
    subOsc.frequency.exponentialRampToValueAtTime(20, now + 0.4);
    subGain.gain.setValueAtTime(1.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.8);

    // Multi-tonal Discordant Scream
    for (let i = 0; i < 12; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      const type = ['sawtooth', 'square', 'sawtooth'][i % 3] as OscillatorType;
      osc.type = type;
      
      const startFreq = 200 + Math.random() * 800;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(4000 + Math.random() * 3000, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(100, now + 1.2);
      
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.8, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
      
      osc.start(now);
      osc.stop(now + 2.1);
    }

    // Harsh Noise Burst
    const bufferSize = this.ctx.sampleRate * 1.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(10, now);
    
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    
    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    whiteNoise.start(now);
    whiteNoise.stop(now + 1.5);
  }
}

const soundEngine = new SoundEngine();

export default function App() {
  const [state, setState] = useState<AppState>({
    currentTheme: 'minimal',
    clickCount: 0,
    unlockedThemes: ['minimal'],
    lastLore: 'ყოველი შეხება არის ახალი დასაწყისი. სამყარო იშლება და ხელახლა იბადება თქვენს თითებს შორის.',
    isGlitching: false,
    stability: 100,
    discoveredSecrets: [],
    isFinalChase: false,
    chaseHits: 0,
    buttonOffset: { x: 0, y: 0 },
    isJumpscare: false,
    isEnding: false,
    isStarted: false,
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chaseTimerRef = useRef<number | null>(null);

  const currentThemeConfig = useMemo(() => 
    (state.isEnding ? THEMES.find(t => t.id === 'minimal') : THEMES.find(t => t.id === state.currentTheme)) || THEMES[0]
  , [state.currentTheme, state.isEnding]);

  const triggerJumpscare = useCallback(() => {
    setState(prev => ({ ...prev, isJumpscare: true }));
    if (soundEnabled) soundEngine.playScream();
    
    // Haptic feedback for jumpscare
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 200, 50, 300, 50, 500, 50, 150, 150, 600]);
    }
    
    setTimeout(() => {
      setState(prev => ({ 
        ...prev, 
        isJumpscare: false, 
        isEnding: true,
        currentTheme: 'minimal',
        lastLore: 'ისევ?',
        stability: 100
      }));
    }, 2000);
  }, [soundEnabled]);

  const resetGame = useCallback(() => {
    setState({
      currentTheme: 'minimal',
      clickCount: 0,
      unlockedThemes: ['minimal'],
      lastLore: 'ციკლი განახლდა.',
      isGlitching: false,
      stability: 100,
      discoveredSecrets: [],
      isFinalChase: false,
      chaseHits: 0,
      buttonOffset: { x: 0, y: 0 },
      isJumpscare: false,
      isEnding: false,
      isStarted: false,
    });
    document.title = "One Button Website";
  }, []);

  const handleInteraction = useCallback(() => {
    if (state.isEnding) {
      resetGame();
      return;
    }

    soundEngine.init();
    if (!state.isStarted) {
      setState(prev => ({ ...prev, isStarted: true }));
      setSoundEnabled(true);
      return;
    }
    
    if (soundEnabled) soundEngine.playClick(state.currentTheme);

    // Haptic interaction feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(state.isFinalChase ? 40 : 15);
    }

    const nextClickCount = state.clickCount + 1;
    
    // Final Chase trigger
    if (nextClickCount >= 150 && !state.isFinalChase) {
      setState(prev => ({ 
        ...prev, 
        isFinalChase: true, 
        clickCount: nextClickCount,
        lastLore: 'გაჩერდი. ის აღარ გემორჩილება.',
        currentTheme: 'corrupted'
      }));
      document.title = "გაიქცა...";
      return;
    }

    if (state.isFinalChase) {
      const nextHits = state.chaseHits + 1;
      if (nextHits >= 8) {
        triggerJumpscare();
        return;
      }
      setState(prev => ({ 
        ...prev, 
        chaseHits: nextHits,
        clickCount: nextClickCount,
        lastLore: ['რატომ დასდევ?', 'მორჩი.', 'გვიანია.', 'სისტემა აღარ არსებობს.'][Math.floor(Math.random() * 4)],
        buttonOffset: { x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 }
      }));
      return;
    }
    const nextStability = Math.max(0, 100 - (nextClickCount * 0.4));
    
    // Reality Mutation Logic
    let nextTheme = state.currentTheme;
    const stabilityFactor = (100 - nextStability) / 100;
    const mutationChance = 0.15 + (stabilityFactor * 0.4);
    
    if (Math.random() < mutationChance || nextClickCount % 8 === 0) {
      const availableThemes = THEMES.filter(t => t.id !== state.currentTheme);
      // Progressive unlocking themes based on click count
      let progressionThemes = availableThemes;
      if (nextClickCount < 15) {
        progressionThemes = availableThemes.filter(t => ['minimal', 'dreamcore', 'void', 'retro'].includes(t.id));
      } else if (nextClickCount < 40) {
        progressionThemes = availableThemes.filter(t => !['corrupted', 'chaos', 'conscious', 'flesh'].includes(t.id));
      }
      
      const themeChoice = progressionThemes[Math.floor(Math.random() * progressionThemes.length)];
      nextTheme = themeChoice.id;
      
      if (soundEnabled) soundEngine.playMutation();
      
      // Special Cinematic Effects
      if (nextTheme === 'gold') {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#ffd700', '#fcf6ba'] });
      }
    }

    // Lore & Meta-Narrative Logic
    let nextLore = state.lastLore;
    if (Math.random() > 0.3) {
      const combinedLore = [...currentThemeConfig.lore, ...GENERAL_LORE];
      nextLore = combinedLore[Math.floor(Math.random() * combinedLore.length)];
    }

    // Fourth Wall Breaking - Browser Meta
    if (nextClickCount === 25) document.title = "ღილაკი გხედავს...";
    if (nextClickCount === 50) document.title = "რატომ აგრძელებ?";
    if (nextClickCount === 100) document.title = "გაჩერდი! სისტემა ინგრევა.";

    setState(prev => ({
      ...prev,
      clickCount: nextClickCount,
      currentTheme: nextTheme,
      lastLore: nextLore,
      stability: nextStability,
      isGlitching: Math.random() < (1 - nextStability / 100) * 0.8,
    }));
  }, [state, soundEnabled, currentThemeConfig]);

  useEffect(() => {
    if (soundEnabled) {
      soundEngine.updateDrone(currentThemeConfig.audioProfile, true);
    } else {
      soundEngine.updateDrone('', false);
    }
  }, [state.currentTheme, soundEnabled, currentThemeConfig.audioProfile]);

  // Layout Dynamic Instability
  const layoutStyles = useMemo(() => {
    if (state.stability > 40) return {};
    const offset = (100 - state.stability);
    const shake = Math.sin(state.clickCount * 1.5) * (offset / 15);
    return {
      transform: `rotate(${shake / 2}deg) translate(${shake}px, ${Math.cos(state.clickCount) * (offset / 20)}px)`,
      filter: state.stability < 20 ? `hue-rotate(${state.clickCount * 12}deg) contrast(1.2) brightness(1.1)` : 'none'
    };
  }, [state.stability, state.clickCount]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!state.isFinalChase || state.isJumpscare || state.isEnding) return;
    
    // Check distance to button
    const button = document.getElementById('the-button');
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;
    
    const dist = Math.hypot(e.clientX - bx, e.clientY - by);
    
    if (dist < 150) {
      // Button runs away
      const angle = Math.atan2(by - e.clientY, bx - e.clientX);
      const push = 200 * (1 - dist / 150);
      
      setState(prev => {
        const nextX = (prev.buttonOffset?.x || 0) + Math.cos(angle) * push + (Math.random() - 0.5) * 100;
        const nextY = (prev.buttonOffset?.y || 0) + Math.sin(angle) * push + (Math.random() - 0.5) * 100;
        
        // Clamp to screen boundaries (centered flex container, so offsets are from center)
        const margin = 100; // Account for button half-width/height
        const maxX = window.innerWidth / 2 - margin;
        const maxY = window.innerHeight / 2 - margin;
        
        return {
          ...prev,
          buttonOffset: {
            x: Math.max(-maxX, Math.min(maxX, nextX)),
            y: Math.max(-maxY, Math.min(maxY, nextY))
          }
        };
      });
    }
  }, [state.isFinalChase, state.isJumpscare, state.isEnding]);

  return (
    <div 
      id="experience-root"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ cursor: currentThemeConfig.cursor }}
      className={`w-full min-h-screen ${state.isJumpscare ? 'bg-black animate-shake' : state.isEnding ? 'bg-white' : currentThemeConfig.bgColor} ${state.currentTheme === 'corrupted' ? 'animate-chromatic animate-tearing' : ''} flex flex-col justify-between p-6 md:p-12 relative overflow-hidden transition-all duration-1000 selection:bg-white/20`}
    >
      {/* Corrupted CRT Overlay */}
      {state.currentTheme === 'corrupted' && (
        <div className="fixed inset-0 z-[150] pointer-events-none overflow-hidden opacity-60">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[size:100%_3px,4px_100%]" />
           <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/40 animate-scanline shadow-[0_0_15px_red]" />
           <div className="absolute inset-0 bg-red-900/10 mix-blend-color-burn" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] opacity-20 animate-noise" />
        </div>
      )}
      
      {/* Start Overlay / Volume Selection */}
      {!state.isStarted && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center text-white p-8 space-y-12"
        >
          <div className="space-y-4 text-center">
            <h2 className="text-4xl font-light tracking-tighter opacity-80 uppercase">Warning</h2>
            <p className="text-xs font-mono opacity-40 uppercase tracking-widest">This experience uses flashing lights and sudden loud noises.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <button 
              onClick={() => { soundEngine.init(); setSoundEnabled(true); setState(prev => ({ ...prev, isStarted: true })); }}
              className="px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition-all flex items-center gap-3 group"
            >
              <Volume2 className="group-hover:scale-110 transition-transform" />
              <span className="uppercase text-xs tracking-widest font-bold">Start with Audio</span>
            </button>
            <button 
              onClick={() => { setState(prev => ({ ...prev, isStarted: true })); }}
              className="px-8 py-4 border border-white/5 hover:border-white/20 transition-all flex items-center gap-3 opacity-40 hover:opacity-100"
            >
              <VolumeX />
              <span className="uppercase text-xs tracking-widest font-bold">Start Muted</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Jumpscare Overlay */}
      {state.isJumpscare && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [1, 0.8, 1], 
            scale: [1, 1.2, 1.1],
            filter: ['brightness(1) contrast(5)', 'brightness(2) contrast(10)', 'brightness(1) contrast(5)']
          }}
          className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
        >
          <div className="relative w-full h-full">
             <div className="absolute inset-0 bg-red-600 opacity-20 mix-blend-difference animate-pulse" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] text-white opacity-20 font-black animate-ping">
                ?
             </div>
             
             {/* Terrifying Entity Image */}
             <div className="absolute inset-0 z-50 overflow-hidden">
               <motion.img 
                  src="/hackee-jumpscare.png"
                  onError={(e) => {
                    // Fallback if local file not found
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000&auto=format&fit=crop";
                  }}
                  initial={{ scale: 2.5, opacity: 0 }}
                  animate={{ 
                    scale: [2, 2.5, 2.2, 3, 2], 
                    opacity: [1, 0.9, 1, 0.8, 1],
                    x: [0, -15, 15, -10, 10, 0],
                    y: [0, 10, -10, 20, -20, 0],
                    filter: [
                      'contrast(1.2) brightness(1.1)',
                      'contrast(1.5) brightness(1.3)',
                      'contrast(1.2) brightness(1.1)'
                    ]
                  }}
                  transition={{ duration: 0.05, repeat: Infinity }}
                  className="absolute inset-0 w-full h-full object-cover"
               />
               
               {/* Subtle Overlay to match the vibe without changing colors too much */}
               <motion.div 
                 animate={{ opacity: [0, 0.3, 0] }}
                 transition={{ duration: 0.1, repeat: Infinity }}
                 className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none"
               />
             </div>

             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50 mix-blend-overlay" />
             <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-96 h-96 border-8 border-red-600 rounded-full animate-wiggle" />
                <div className="text-white text-6xl font-mono tracking-widest animate-bounce">SYSTEM_ERROR</div>
             </div>
          </div>
        </motion.div>
      )}

      {/* Visual Universe Renderer */}
      <AnimatePresence mode="wait">
        {!state.isEnding && !state.isJumpscare && (
          <motion.div
            key={state.currentTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          {state.currentTheme === 'void' && <VoidBackground />}
          {state.currentTheme === 'matrix' && <MatrixBackground />}
          {state.currentTheme === 'cosmic' && <CosmicBackground />}
          {state.currentTheme === 'dreamcore' && <DreamBackground />}
          {state.currentTheme === 'cyberpunk' && <CyberBackground />}
          {state.currentTheme === 'vhs' && <VHSBackground />}
          {state.currentTheme === 'flesh' && <FleshBackground />}
          {state.currentTheme === 'surveillance' && <SurveillanceBackground />}
          {state.currentTheme === 'conscious' && <MachineBackground />}
          {state.currentTheme === 'corrupted' && <CorruptBackground />}
          
          <div className="absolute inset-0 opacity-10 blur-[120px] pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-current to-transparent opacity-20" />
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch Intermittence */}
      {state.isGlitching && (
        <div className="absolute inset-0 z-[100] mix-blend-difference pointer-events-none">
           <div className="absolute inset-0 bg-red-600/10 animate-pulse" />
           <div className="absolute top-[20%] left-0 w-full h-[1px] bg-white opacity-40 shadow-[0_0_10px_white]" />
           <div className="absolute bottom-[40%] left-0 w-full h-[2px] bg-cyan-400 opacity-30" />
        </div>
      )}

      {/* Navigation & Stats HUD */}
      {!state.isEnding && !state.isJumpscare && (
        <motion.header style={layoutStyles} className="flex flex-col md:flex-row justify-between items-start z-50 gap-6 transition-transform">
          <div className="space-y-2">
            <h1 className="text-[10px] tracking-[0.4em] uppercase opacity-40 mb-1 font-sans font-bold flex items-center gap-2">
              <Cpu size={12} className="animate-pulse" /> {state.isFinalChase ? "CRITICAL SYSTEM BREACH" : "სინთეზური რეალობის პროტოკოლი"}
            </h1>
            <div className="flex items-center gap-4">
              <span className={`text-2xl md:text-3xl font-light tracking-tighter ${currentThemeConfig.textColor}`}>
                {state.isFinalChase ? "ERR_UNKNOWN_LOC" : `განზომილება #${state.clickCount + 821}`}
              </span>
              <div className="flex gap-1.5 h-4 items-center">
                 {[...Array(6)].map((_, i) => (
                   <motion.div 
                     key={i} 
                     animate={(state.isGlitching || state.isFinalChase) ? { height: [4, 16, 4] } : {}}
                     className={`w-1.5 h-full rounded-full transition-colors duration-500 ${i < (state.stability / 16) ? 'bg-current' : 'bg-red-600/20'}`} 
                   />
                 ))}
              </div>
            </div>
          </div>
          <div className="md:text-right space-y-1">
            <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-sans font-bold">გეო-ლოკაცია: {state.isFinalChase ? "???.??? N, ???.??? E" : "41.7151° N, 44.8271° E"}</p>
            <p className={`text-xl md:text-2xl font-light ${currentThemeConfig.textColor}`}>{state.isFinalChase ? "LOST_IN_VOID" : "თბილისი, საქართველო"}</p>
            <div className="flex items-center md:justify-end gap-2 text-[10px] font-mono opacity-40">
               <Database size={10} /> {state.isFinalChase ? "STABILITY: 0.001%" : `${state.stability.toFixed(2)}% STABILITY`}
            </div>
          </div>
        </motion.header>
      )}

      {/* Central Mutant Interface */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-40 w-full">
        {state.isEnding ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-8"
          >
             <button
               onClick={handleInteraction}
               className="w-16 h-16 border border-black rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center text-sm"
             >
                Again?
             </button>
          </motion.div>
        ) : !state.isJumpscare && (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={state.currentTheme + (Math.floor(state.clickCount / 5))}
              initial={{ scale: 0.7, opacity: 0, filter: 'blur(20px)' }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                filter: 'blur(0px)',
                x: state.buttonOffset?.x || 0,
                y: state.buttonOffset?.y || 0
              }}
              exit={{ scale: 1.2, opacity: 0, filter: 'blur(40px)' }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              style={layoutStyles}
              className="relative"
            >
               <button
                id="the-button"
                onClick={handleInteraction}
                className={`${currentThemeConfig.buttonClass} group relative flex items-center justify-center transition-all active:scale-95 z-50 overflow-hidden outline-none`}
              >
                <div className="absolute inset-0 bg-white opacity-[0.01] group-hover:opacity-[0.05] transition-opacity" />
                <div className="text-center space-y-3 pointer-events-none select-none">
                  <span className={`${currentThemeConfig.textColor} block text-3xl md:text-5xl font-light tracking-tighter transition-all`}>
                    {state.isFinalChase ? "დამიჭირე" : currentThemeConfig.buttonText}
                  </span>
                  <span className="block text-[8px] md:text-[11px] uppercase tracking-[0.3em] opacity-30 font-black">
                    {state.isFinalChase ? "REMAINING: " + (8 - state.chaseHits) : (state.stability < 15 ? "DANGER: CRITICAL" : "ბირთვის მანიპულაცია")}
                  </span>
                </div>
                
                {/* Kinetic Counter */}
                <div className={`absolute -top-6 -right-6 w-14 h-14 border border-current rounded-full flex items-center justify-center bg-black/90 text-xs font-mono backdrop-blur-xl shadow-2xl ${currentThemeConfig.textColor} animate-bounce-slow`}>
                   {state.clickCount}
                </div>
              </button>

              {/* Duplicate Fake Buttons */}
              {state.isFinalChase && [...Array(3)].map((_, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 0.4,
                    x: (Math.sin(state.clickCount + i) * 300),
                    y: (Math.cos(state.clickCount + i) * 300)
                  }}
                  className={`${currentThemeConfig.buttonClass} absolute inset-0 opacity-20 pointer-events-none blur-sm scale-75`}
                >
                  {currentThemeConfig.buttonText}
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!state.isEnding && !state.isJumpscare && (
          <div className="mt-16 md:mt-24 max-w-sm md:max-w-2xl text-center px-6 relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={state.lastLore}
                initial={{ opacity: 0, rotateX: 90 }}
                animate={{ opacity: 0.9, rotateX: 0 }}
                exit={{ opacity: 0, rotateX: -90 }}
                transition={{ duration: 0.6 }}
                className={`text-xl md:text-2xl italic font-serif leading-relaxed tracking-wide ${currentThemeConfig.textColor} drop-shadow-2xl`}
              >
                „{state.lastLore}“
              </motion.p>
            </AnimatePresence>
            {(state.stability < 50 || state.isFinalChase) && (
              <div className="absolute -inset-4 border border-current opacity-5 pointer-events-none skew-x-12" />
            )}
          </div>
        )}
      </main>

      {/* Infrastructure Telemetry */}
      <footer className="flex flex-col md:flex-row justify-between items-end z-50 gap-10 md:gap-4 mt-8 w-full transition-transform">
        <div className="w-full md:w-80 space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] opacity-30 font-black">
              <span className="flex items-center gap-1"><Binary size={10} /> ენტროპიის დონე</span>
              <span>{Math.floor(100 - state.stability)}%</span>
            </div>
            <div className="h-[1px] w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${100 - state.stability}%` }} className={`h-full ${currentThemeConfig.textColor} bg-current opacity-60`} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] opacity-30 font-black">
              <span className="flex items-center gap-1"><Radio size={10} /> სიგნალის დრიფტი</span>
              <span>{(state.clickCount * 1.3) % 100 | 0}%</span>
            </div>
            <div className="h-[1px] w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div animate={{ width: `${(state.clickCount * 1.3) % 100}%` }} className={`h-full ${currentThemeConfig.textColor} bg-current opacity-30`} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-10 items-end justify-end w-full md:w-auto">
          <div className="text-right hidden sm:block max-w-[200px]">
             <span className="block text-[9px] uppercase tracking-[0.3em] opacity-30 font-black mb-1">უნივერსალური კავშირი</span>
             <span className={`text-sm italic tracking-tight opacity-70 ${currentThemeConfig.textColor}`}>«{currentThemeConfig.name}»</span>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => { soundEngine.init(); setSoundEnabled(!soundEnabled); }}
              className="group p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
              title="აუდიო"
            >
              {soundEnabled ? <Volume2 size={18} className={currentThemeConfig.textColor} /> : <VolumeX size={18} />}
            </button>
            <button 
              onClick={() => { 
                resetGame();
                soundEngine.playMutation();
              }}
              className="group p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all hover:rotate-180 active:scale-90"
              title="რესეტი"
            >
              <RefreshCcw size={18} className={currentThemeConfig.textColor} />
            </button>
          </div>
        </div>
      </footer>

      {/* Decorative Structural Artifacts */}
      <div className="absolute top-0 right-0 p-4 font-mono text-[8px] opacity-10 pointer-events-none select-none text-right">
        BUILD_VER: 2.0.4<br />
        CORE_SYS: REACT_MOTION<br />
        STATE: {state.stability < 10 ? 'COLLAPSING' : 'ACTIVE'}
      </div>
      
      {state.stability < 30 && (
        <div className="absolute bottom-32 left-12 p-2 border border-red-500/20 text-[10px] font-mono text-red-500/40 animate-pulse">
           CRITICAL_FAIL_OVERFLOW: 0x{state.clickCount.toString(16).toUpperCase()}
        </div>
      )}
    </div>
  );
}

// --- Specialized Visual Environment Components ---

function VoidBackground() {
  return (
    <div className="absolute inset-0 bg-black">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{ width: '1px', height: '1px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%' }}
          animate={{ opacity: [0, 0.4, 0], scale: [1, 2, 1] }}
          transition={{ duration: Math.random() * 8 + 3, repeat: Infinity, delay: Math.random() * 10 }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-80" />
    </div>
  );
}

function MatrixBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden flex justify-around select-none opacity-30 mix-blend-screen">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className="text-[#00ff41] text-[11px] font-mono leading-none writing-vertical-rl"
          initial={{ y: -1200 }}
          animate={{ y: 2400 }}
          transition={{ duration: Math.random() * 12 + 6, repeat: Infinity, ease: "linear", delay: Math.random() * 8 }}
        >
          {Array(60).fill(0).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
        </motion.div>
      ))}
    </div>
  );
}

function CosmicBackground() {
  return (
    <div className="absolute inset-0 bg-[#00000a]">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#1B2735_0%,_#090A0F_100%)] opacity-90" />
       <motion.div 
         animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.4, 1], filter: ['blur(100px)', 'blur(150px)', 'blur(100px)'] }} 
         transition={{ duration: 25, repeat: Infinity }}
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-indigo-600/5 rounded-full" 
       />
       <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
    </div>
  );
}

function DreamBackground() {
  return (
    <div className="absolute inset-0 bg-[#0c051a] overflow-hidden">
      <motion.div 
         animate={{ rotate: 360 }} 
         transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
         className="absolute -inset-[150%] bg-[conic-gradient(from_0deg_at_50%_50%,_#1e0c3a_0%,_#0c051a_50%,_#1e0c3a_100%)] opacity-60" 
      />
      <div className="absolute inset-0 backdrop-blur-[2px]" />
    </div>
  );
}

function CyberBackground() {
  return (
    <div className="absolute inset-0 bg-black">
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,255,100,0.1)_1px,_transparent_1px),_linear-gradient(90deg,rgba(0,255,100,0.1)_1px,_transparent_1px)] bg-[size:50px_50px]" />
      <motion.div 
        animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 0.2, repeat: Infinity }}
        className="absolute top-0 left-0 w-full h-[1px] bg-[#0f0] opacity-30 shadow-[0_0_15px_#0f0]" 
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_90%)]" />
    </div>
  );
}

function VHSBackground() {
  return (
    <div className="absolute inset-0 bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
      <motion.div 
        animate={{ y: [-1000, 1000] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-[300px] bg-white/5 blur-[80px] opacity-20 skew-y-12" 
      />
      <div className="absolute top-10 left-10 text-red-600 font-mono text-xl md:text-3xl animate-pulse tracking-tighter flex items-center gap-2">
        <div className="w-3 h-3 bg-red-600 rounded-full" /> REC 00:00:29:12
      </div>
      <div className="absolute bottom-10 right-10 text-white/20 font-mono text-xs uppercase tracking-widest">
        SP_MODE // AUTO_TRACK
      </div>
    </div>
  );
}

function FleshBackground() {
  return (
    <div className="absolute inset-0 bg-[#1a0202]">
      {[...Array(8)].map((_, i) => (
        <motion.div
           key={i}
           className="absolute rounded-full bg-red-900/15 blur-[120px]"
           style={{ width: '500px', height: '500px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%' }}
           animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.4, 0.1] }}
           transition={{ duration: 6, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_transparent_0%,_#080000_100%)]" />
    </div>
  );
}

function CorruptBackground() {
  return (
    <div className="absolute inset-0 bg-[#050000] overflow-hidden">
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.05),rgba(0,0,255,0.1))] bg-[size:100%_4px,3px_100%]" />
        <div className="absolute top-0 left-0 w-full h-[50px] bg-red-600/10 blur-xl animate-scanline opacity-30 shadow-[0_0_20px_red]" />
        <div className="absolute bottom-0 left-0 w-full h-[100px] bg-white/5 blur-2xl animate-scanline opacity-10" style={{ animationDelay: '-2s' }} />
      </div>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            opacity: [0, 0.6, 0.2, 0.8, 0],
            x: [(-100 + Math.random() * 200) + '%', (Math.random() * 200 - 100) + '%'],
            scaleX: [1, 5, 2, 8, 1],
            height: [1, 2, 1, 4, 1]
          }}
          transition={{ duration: 0.05 + Math.random() * 0.1, repeat: Infinity, delay: Math.random() }}
          className="absolute bg-red-600/40 blur-[1px] w-full"
          style={{ top: (Math.random() * 100) + '%', height: Math.random() * 4 + 'px' }}
        />
      ))}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`block-${i}`}
          animate={{ 
            opacity: [0, 0.2, 0],
            x: [Math.random() * 100 + '%', (Math.random() * 100) + '%'],
            y: [Math.random() * 100 + '%', (Math.random() * 100) + '%'],
            width: [20, 100, 50],
            height: [20, 60, 30]
          }}
          transition={{ duration: 0.1, repeat: Infinity, delay: Math.random() }}
          className="absolute bg-white/5 border border-white/10 backdrop-blur-sm z-0"
        />
      ))}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay animate-noise" />
      <div className="absolute inset-0 bg-red-900/5 mix-blend-color-burn" />
    </div>
  );
}

function SurveillanceBackground() {
  return (
    <div className="absolute inset-0 bg-zinc-900 grayscale brightness-75 contrast-125">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] bg-[size:30px_30px]" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="absolute border border-red-500/30 w-40 h-40 flex flex-col items-center justify-center p-2" style={{ top: 15 + (i % 2) * 40 + '%', left: 10 + Math.floor(i / 2) * 50 + '%' }}>
           <div className="w-1.5 h-1.5 bg-red-600 animate-ping mb-2" />
           <span className="text-[7px] font-mono text-red-500 uppercase tracking-tighter">OBJ_REF_{i*102} // TRACKING</span>
           <div className="absolute bottom-1 right-1 text-[6px] font-mono text-red-500 opacity-30">41.7°N / 44.8°E</div>
        </div>
      ))}
      <div className="absolute bottom-10 left-10 font-mono text-[10px] text-red-600/60 leading-tight">
        MONITOR_ACTIVE // SIGNAL_ENCRYPTED<br />
        USER_ID: AI_EXP_B3T<br />
        STATUS: OBSERVING
      </div>
    </div>
  );
}

function MachineBackground() {
  return (
    <div className="absolute inset-0 bg-[#00040d] flex items-center justify-center overflow-hidden">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="w-[1000px] h-[1000px] border border-blue-500/10 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(59,130,246,0.05)]"
      >
        <div className="w-[800px] h-[800px] border border-blue-500/5 rounded-full" />
        <div className="w-[600px] h-[600px] border border-blue-500/10 rounded-full flex items-center justify-center">
            <div className="w-[200px] h-[200px] bg-blue-500/5 blur-[80px] rounded-full animate-pulse" />
        </div>
      </motion.div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] opacity-70" />
    </div>
  );
}
