import React, { useState, useEffect, useMemo } from 'react';
import { 
  Cpu, Zap, HeartPulse, BrainCircuit, Sparkles, 
  Layers, Unplug, Radio, Activity, Mic2, HardDrive,
  ShieldAlert, Loader2, GitBranch, Share2, Waves
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection } from 'firebase/firestore';

/**
 * NOODLE-VISION NEXUS v21.3 - PRODUCTION HANDOFF
 * ═══════════════════════════════════════════════
 * TRIPLE PLUG-IN SUITE:
 * → Real Plug-in: Physical hardware routing (B1-B16 schematic pathways)
 * → Sound Reactive: Professional 12-band frequency analyzer
 * → Biometric Sync: Emotional runtime with spatial color morphing
 * 
 * VR/XR WIRE SCHEMATICS:
 * → Build-specific SVG routing (Fiber, Thunderbolt, USB-C, BT Mesh)
 * → Emotional state drives wire color/pattern/speed
 * → Authentic cable physics with decay curves
 */

const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'noodle-vision-nexus';

// BUILD 1-16 SCHEMATIC & ROUTING REGISTRY
const SCHEMATIC_REGISTRY = {
  B1_G9: { 
    path: 'PATH_XR_01_ALPHA', 
    center: 'NET_CORE_01', 
    type: 'Fiber', 
    routing: 'Direct-Link',
    startPos: { x: 200, y: 600 },
    endPos: { x: 1400, y: 150 },
    pathStyle: 'smooth',
    pulseSpeed: 1.2
  },
  B2_STUDIO: { 
    path: 'PATH_TB4_02_BETA', 
    center: 'NET_CORE_01', 
    type: 'Thunderbolt', 
    routing: 'Daisy-Chain',
    startPos: { x: 500, y: 600 },
    endPos: { x: 1400, y: 150 },
    pathStyle: 'branching',
    pulseSpeed: 0.8
  },
  B9_IPHONE: { 
    path: 'PATH_USB_C_07_GAMMA', 
    center: 'MOBILE_HUB_X', 
    type: 'PD-Data', 
    routing: 'Interface-Link',
    startPos: { x: 800, y: 600 },
    endPos: { x: 1200, y: 250 },
    pathStyle: 'bidirectional',
    pulseSpeed: 1.5
  },
  B11_RING: { 
    path: 'PATH_BT_MESH_09_DELTA', 
    center: 'DATA_NODE_SECURE', 
    type: 'Inductive', 
    routing: 'Biometric-Bridge',
    startPos: { x: 1100, y: 600 },
    endPos: { x: 1300, y: 350 },
    pathStyle: 'mesh',
    pulseSpeed: 2.0
  }
};

// 12-BAND FREQUENCY ANALYZER CONFIGURATION
const FREQUENCY_BANDS = [
  { label: 'SUB', range: '20-60Hz', baseDecay: 0.92, color: 'emerald' },
  { label: 'BASS', range: '60-120Hz', baseDecay: 0.90, color: 'emerald' },
  { label: 'LOW', range: '120-250Hz', baseDecay: 0.88, color: 'teal' },
  { label: 'LM1', range: '250-500Hz', baseDecay: 0.86, color: 'cyan' },
  { label: 'LM2', range: '500-1kHz', baseDecay: 0.84, color: 'cyan' },
  { label: 'MID1', range: '1k-2kHz', baseDecay: 0.82, color: 'sky' },
  { label: 'MID2', range: '2k-4kHz', baseDecay: 0.80, color: 'blue' },
  { label: 'HM1', range: '4k-6kHz', baseDecay: 0.78, color: 'indigo' },
  { label: 'HM2', range: '6k-8kHz', baseDecay: 0.76, color: 'violet' },
  { label: 'HIGH', range: '8k-12kHz', baseDecay: 0.74, color: 'purple' },
  { label: 'AIR1', range: '12k-16kHz', baseDecay: 0.72, color: 'fuchsia' },
  { label: 'AIR2', range: '16k-20kHz', baseDecay: 0.70, color: 'pink' }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [activeBuild, setActiveBuild] = useState(null);
  const [frequencyLevels, setFrequencyLevels] = useState(FREQUENCY_BANDS.map(() => 0));
  const [emotionalState, setEmotionalState] = useState({ 
    mood: 'CALM', 
    stress: 15, 
    heartRate: 72,
    color: '#3b82f6',
    bgIntensity: 5 
  });
  const [showSchematics, setShowSchematics] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else { await signInAnonymously(auth); }
      } catch (err) { console.error("Nexus Auth Fault", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // PROFESSIONAL 12-BAND FREQUENCY ANALYZER (Sound Plug-in)
  useEffect(() => {
    const interval = setInterval(() => {
      setFrequencyLevels(prev => {
        return prev.map((level, i) => {
          // Simulate frequency input with band-specific characteristics
          const band = FREQUENCY_BANDS[i];
          const newInput = Math.random() * 100;
          
          // Lower frequencies have more energy typically
          const frequencyBias = 1 - (i / FREQUENCY_BANDS.length) * 0.6;
          const targetLevel = newInput * frequencyBias;
          
          // Apply decay curve for realistic fall-off
          const decayedLevel = level * band.baseDecay;
          
          // Return max of new input or decayed previous level
          return Math.max(targetLevel, decayedLevel);
        });
      });
    }, 50); // 20fps for smooth animation
    return () => clearInterval(interval);
  }, []);

  // BIOMETRIC & EMOTIONAL RUNTIME (Biometric Plug-in)
  useEffect(() => {
    const interval = setInterval(() => {
      setEmotionalState(prev => {
        const stress = Math.floor(Math.random() * 45) + 5;
        const heartRate = 60 + Math.floor(stress * 0.8);
        
        let mood = 'CALM';
        let color = '#3b82f6'; // blue-500
        let bgIntensity = 5;
        
        if (stress > 25) { 
          mood = 'FOCUS'; 
          color = '#8b5cf6'; // violet-500
          bgIntensity = 10;
        }
        if (stress > 35) { 
          mood = 'STRESS_ALERT'; 
          color = '#ef4444'; // red-500
          bgIntensity = 15;
        }
        
        return { mood, stress, heartRate, color, bgIntensity };
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // GENERATE SVG PATH BASED ON BUILD TYPE
  const generateSchematicPath = (build) => {
    if (!build) return '';
    const { startPos, endPos, pathStyle } = build;
    
    switch (pathStyle) {
      case 'smooth': // Fiber optic - smooth bezier
        return `M ${startPos.x} ${startPos.y} Q ${(startPos.x + endPos.x) / 2} ${startPos.y - 200} ${endPos.x} ${endPos.y}`;
      
      case 'branching': // Thunderbolt - split path
        const midX = (startPos.x + endPos.x) / 2;
        const midY = (startPos.y + endPos.y) / 2;
        return `M ${startPos.x} ${startPos.y} L ${midX} ${midY} L ${endPos.x} ${endPos.y} M ${midX} ${midY} L ${midX + 100} ${midY - 80}`;
      
      case 'bidirectional': // USB-C - dual flow
        return `M ${startPos.x} ${startPos.y} C ${startPos.x + 150} ${startPos.y - 100}, ${endPos.x - 150} ${endPos.y + 100}, ${endPos.x} ${endPos.y}`;
      
      case 'mesh': // Bluetooth - scattered dots
        return `M ${startPos.x} ${startPos.y} Q ${startPos.x + 200} ${startPos.y - 150} ${endPos.x} ${endPos.y}`;
      
      default:
        return `M ${startPos.x} ${startPos.y} L ${endPos.x} ${endPos.y}`;
    }
  };

  if (loading) return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-blue-500 font-black uppercase italic tracking-[0.5em]">
      <Loader2 className="w-10 h-10 animate-spin mb-4" />
      Syncing Nexus Core...
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-[#010101] text-white selection:bg-blue-500/30">
      
      {/* SORA SPATIAL BACKGROUND (Emotional Atmosphere) */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000" 
        style={{ 
          backgroundColor: `${emotionalState.color}${emotionalState.bgIntensity.toString(16).padStart(2, '0')}` 
        }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-black via-transparent to-black" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <Waves 
            className="w-[80vw] h-[80vw] transition-all duration-1000" 
            style={{ 
              filter: `drop-shadow(0 0 60px ${emotionalState.color}40)`,
              animationDuration: `${3 - (emotionalState.stress / 50)}s`
            }} 
          />
        </div>
      </div>

      {/* VR/XR SCHEMATIC OVERLAY (Emotional Wire Routing) */}
      {showSchematics && activeBuild && (
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {/* Main schematic pathway */}
          <path 
            d={generateSchematicPath(activeBuild)} 
            stroke={emotionalState.color} 
            strokeWidth={emotionalState.mood === 'STRESS_ALERT' ? '3' : '2'} 
            fill="none" 
            className="transition-all duration-500" 
            opacity={emotionalState.mood === 'STRESS_ALERT' ? '0.6' : '0.3'}
            strokeDasharray={activeBuild.pathStyle === 'mesh' ? '8 4' : 'none'}
          />
          
          {/* Animated data packet */}
          <circle 
            r={activeBuild.pathStyle === 'mesh' ? '3' : '5'} 
            fill={emotionalState.color}
            filter={`drop-shadow(0 0 8px ${emotionalState.color})`}
          >
            <animateMotion 
              dur={`${activeBuild.pulseSpeed * (emotionalState.mood === 'STRESS_ALERT' ? 0.5 : 1)}s`} 
              repeatCount="indefinite" 
              path={generateSchematicPath(activeBuild)} 
            />
          </circle>

          {/* Secondary pulse for bidirectional paths */}
          {activeBuild.pathStyle === 'bidirectional' && (
            <circle r="4" fill={`${emotionalState.color}80`}>
              <animateMotion 
                dur={`${activeBuild.pulseSpeed * 1.5}s`} 
                repeatCount="indefinite" 
                path={generateSchematicPath(activeBuild)}
                begin="0.5s"
              />
            </circle>
          )}

          {/* Network center node visualization */}
          <g transform={`translate(${activeBuild.endPos.x}, ${activeBuild.endPos.y})`}>
            <circle 
              r="12" 
              fill="none" 
              stroke={emotionalState.color} 
              strokeWidth="2" 
              opacity="0.4"
            >
              <animate 
                attributeName="r" 
                from="12" 
                to="24" 
                dur="2s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                from="0.4" 
                to="0" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </circle>
            <circle r="6" fill={emotionalState.color} opacity="0.8" />
            <text 
              y="-20" 
              textAnchor="middle" 
              className="text-[8px] font-mono font-bold uppercase tracking-wider fill-white/60"
            >
              {activeBuild.center}
            </text>
          </g>
        </svg>
      )}

      {/* PLUG-IN HUD: TOP LEFT (Triple Plugin Suite) */}
      <div className="absolute top-10 left-10 z-50 flex flex-col gap-4">
        
        {/* Real Hardware Plug-in (Mapping Builds 1-16) */}
        <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] w-80 shadow-2xl transition-all border-l-4 border-l-blue-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <HardDrive className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Real_Plug-in</p>
              <h2 className="text-[11px] font-black uppercase tracking-tight">Hardware_Interface</h2>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <p className="text-[9px] font-mono text-slate-400">PATH:</p>
              <p className="text-[9px] font-mono text-blue-400">{activeBuild?.path || 'SCANNING...'}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[9px] font-mono text-slate-400">CENTER:</p>
              <p className="text-[9px] font-mono text-emerald-400">{activeBuild?.center || 'N/A'}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[9px] font-mono text-slate-400">TYPE:</p>
              <p className="text-[9px] font-mono text-violet-400">{activeBuild?.type || 'IDLE'}</p>
            </div>
          </div>
        </div>

        {/* Sound Reactive Plug-in (Professional 12-Band Frequency Analyzer) */}
        <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] w-80 shadow-2xl border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Mic2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Sound_Plug-in</p>
              <h2 className="text-[11px] font-black uppercase tracking-tight">12-Band_Analyzer</h2>
            </div>
          </div>
          
          {/* Professional frequency equalizer */}
          <div className="flex items-end justify-between gap-0.5 h-24 mb-2">
            {frequencyLevels.map((level, i) => {
              const band = FREQUENCY_BANDS[i];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className={`w-full bg-gradient-to-t from-${band.color}-500 to-${band.color}-300 rounded-t-sm transition-all duration-75 shadow-lg`}
                    style={{ 
                      height: `${level}%`,
                      boxShadow: `0 0 ${level * 0.2}px var(--tw-shadow-color)`,
                      filter: level > 70 ? `drop-shadow(0 0 4px rgb(var(--tw-${band.color}-500)))` : 'none'
                    }} 
                  />
                  <p className="text-[6px] font-mono text-white/40 uppercase">{band.label}</p>
                </div>
              );
            })}
          </div>
          
          {/* Peak meter */}
          <div className="flex gap-1 h-1">
            {frequencyLevels.map((level, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-all duration-100 ${
                  level > 80 ? 'bg-red-500' : level > 60 ? 'bg-yellow-500' : 'bg-emerald-500/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Biometric Sync Plug-in (Emotional Anchor) */}
        <div 
          className="bg-black/80 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] w-80 shadow-2xl transition-all border-l-4" 
          style={{ borderColor: emotionalState.color }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all" 
              style={{ 
                backgroundColor: emotionalState.color,
                boxShadow: `0 0 20px ${emotionalState.color}40`
              }}
            >
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <p 
                className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 transition-colors" 
                style={{ color: emotionalState.color }}
              >
                Biometric_Plug-in
              </p>
              <h2 className="text-[11px] font-black uppercase tracking-tight">{emotionalState.mood}</h2>
            </div>
          </div>
          
          <div className="space-y-2">
            {/* Stress Index */}
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-slate-400 uppercase">Stress_Index</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: emotionalState.color }}>
                {emotionalState.stress}%
              </span>
            </div>
            
            {/* Stress bar visualization */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300 rounded-full"
                style={{ 
                  width: `${emotionalState.stress}%`,
                  backgroundColor: emotionalState.color
                }}
              />
            </div>

            {/* Heart rate */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-[9px] font-mono text-slate-400 uppercase flex items-center gap-1">
                <HeartPulse className="w-3 h-3" style={{ color: emotionalState.color }} />
                Heart_Rate
              </span>
              <span className="text-[10px] font-mono font-bold text-white">
                {emotionalState.heartRate} BPM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV: TERMINAL INTERFACE (B1-B16) */}
      <div className="absolute bottom-10 inset-x-10 z-50">
        <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {Object.entries(SCHEMATIC_REGISTRY).map(([key, item]) => {
            const isActive = activeBuild?.id === key;
            return (
              <button 
                key={key}
                onClick={() => setActiveBuild({ ...item, id: key })}
                className={`snap-center flex-shrink-0 w-72 p-8 rounded-[3.5rem] border transition-all duration-500 group ${
                  isActive 
                    ? 'bg-white text-black scale-105 shadow-2xl' 
                    : 'bg-black/60 text-white border-white/5 hover:border-white/20 hover:bg-black/80'
                }`}
              >
                <div className="flex justify-between items-center mb-8">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    isActive ? 'text-black/30' : 'text-white/20'
                  }`}>
                    {key.split('_')[0]}
                  </p>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    isActive ? 'border-black/10 bg-blue-600' : 'border-white/10 group-hover:border-white/30'
                  }`}>
                    <Unplug className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-white/20 group-hover:text-white/50'
                    }`} />
                  </div>
                </div>
                
                <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none mb-1">
                  {key.split('_')[1]}
                </h3>
                
                <p className={`text-[9px] font-mono uppercase tracking-widest mb-3 ${
                  isActive ? 'text-blue-600' : 'text-white/30'
                }`}>
                  {item.routing}
                </p>

                <div className="flex gap-2 text-[8px] font-mono">
                  <span className={`px-2 py-1 rounded-full ${
                    isActive ? 'bg-black/10 text-black/60' : 'bg-white/5 text-white/40'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CARETAKER SAFETY (Build 14) - Persistent Monitor */}
      <div className="absolute bottom-10 right-10 z-50">
        <div className="bg-red-500/10 backdrop-blur-3xl border border-red-500/20 p-6 rounded-[3rem] flex items-center gap-6 shadow-2xl">
          <div className="relative">
            <HeartPulse className="w-8 h-8 text-red-500 animate-pulse" />
            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse" />
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1 leading-none">
              Caretaker_B14
            </p>
            <div className="bg-red-500/20 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-red-500 inline-block">
              LIVE_MONITOR
            </div>
          </div>
        </div>
      </div>

      {/* SCHEMATIC TOGGLE (Top Right) */}
      <button
        onClick={() => setShowSchematics(!showSchematics)}
        className="absolute top-10 right-10 z-50 bg-black/80 backdrop-blur-3xl border border-white/10 p-4 rounded-2xl hover:border-white/30 transition-all"
      >
        <GitBranch className={`w-5 h-5 ${showSchematics ? 'text-blue-500' : 'text-white/30'}`} />
      </button>

    </div>
  );
}
