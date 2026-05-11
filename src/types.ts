export type ThemeType = 
  | 'minimal' 
  | 'cyberpunk' 
  | 'dreamcore' 
  | 'retro' 
  | 'void' 
  | 'corrupted' 
  | 'cosmic' 
  | 'matrix' 
  | 'chaos' 
  | 'gold'
  | 'vhs'
  | 'flesh'
  | 'surveillance'
  | 'conscious';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  buttonText: string;
  bgColor: string;
  textColor: string;
  buttonClass: string;
  containerClass: string;
  lore: string[];
  cursor: 'default' | 'crosshair' | 'none' | 'wait' | 'text' | 'help' | 'cell';
  glitchFrequency: number;
  physics: {
    gravity: number;
    friction: number;
    speed: number;
  };
  audioProfile: string;
}

export interface AppState {
  currentTheme: ThemeType;
  clickCount: number;
  unlockedThemes: ThemeType[];
  lastLore: string;
  isGlitching: boolean;
  stability: number; // 0 to 100
  discoveredSecrets: string[];
  isFinalChase: boolean;
  chaseHits: number;
  buttonOffset: { x: number; y: number };
  isJumpscare: boolean;
  isEnding: boolean;
  isStarted: boolean;
}
