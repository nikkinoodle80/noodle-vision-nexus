import React from 'react';
import NexusAudio12 from './components/NexusAudio12';
import SmartCoinMeter from './components/SmartCoinMeter';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative font-sans overflow-hidden">
      {/* SORA LAYER: The Entry Room Background */}
      <div className="absolute inset-0 opacity-30 z-0">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/assets/stadium_entry.mp4" type="video/mp4" />
        </video>
      </div>

      <main className="relative z-10 p-10 grid grid-cols-12 gap-8 h-screen">
        <header className="col-span-12 flex justify-between items-end border-b border-white/10 pb-4">
          <div>
            <h1 className="text-5xl font-black italic text-cyan-400">NEXUS <span className="text-white text-2xl">v21.3</span></h1>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-tighter">Sovereign_ID: 150,000_SEAT_MASTER</p>
          </div>
          <div className="text-right font-mono text-[10px] text-cyan-500/50">
            PORT: 31173 | ENGINE: RAGTAG_AURA
          </div>
        </header>

        {/* WORKSTATION: The 12-Band Acoustic Ray-Tracer */}
        <section className="col-span-8 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-10 shadow-2xl">
          <NexusAudio12 />
        </section>

        {/* RACK BAY: Patch Cables & Smart Coin Monetization */}
        <section className="col-span-4 space-y-8">
          <div className="bg-slate-900/90 p-8 rounded-[2rem] border border-cyan-500/20 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-6">Sora Rack Bay</h3>
            <div className="aspect-square bg-black/80 rounded-2xl border border-dashed border-slate-700 flex items-center justify-center">
              <span className="text-slate-600 animate-pulse text-xs font-mono">[ 3D_SPLINE_RACK_ACTIVE ]</span>
            </div>
          </div>
          <SmartCoinMeter userTier="pro" />
        </section>
      </main>
    </div>
  );
}
