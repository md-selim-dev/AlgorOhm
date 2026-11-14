import React, { useState } from 'react';
import { CircuitBoard, Layers, Zap } from 'lucide-react';
import { ARCHITECTURE_STACK } from '../data/roboticsData';
import { ArchitectureTabId } from '../types/robotics';
import { ResilientImage } from './ui/ResilientImage';

export const ArchitectureSection: React.FC = () => {
  const [archTab, setArchTab] = useState<ArchitectureTabId>('algor');
  const activeArch = ARCHITECTURE_STACK[archTab];

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-10 sm:mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>03. VERTICALLY INTEGRATED ARCHITECTURE</span>
          </div>
          <h2
            id="architecture-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display"
          >
            The Algor™ × Ohm™ Dual-Core Stack
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
            Toggle between our deterministic neural software layer (Algor™) and our ultra-low
            impedance electromechanical hardware core (Ohm™).
          </p>
        </div>

        {/* Stack Switcher */}
        <div
          role="tablist"
          aria-label="Select architecture layer"
          className="grid grid-cols-2 sm:inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-full sm:w-auto self-start"
        >
          <button
            type="button"
            role="tab"
            aria-selected={archTab === 'algor'}
            onClick={() => setArchTab('algor')}
            className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
              archTab === 'algor'
                ? 'bg-cyan-400 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CircuitBoard className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">ALGOR™ NEURAL OS</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={archTab === 'ohm'}
            onClick={() => setArchTab('ohm')}
            className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 ${
              archTab === 'ohm'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">OHM™ ACTUATION CORE</span>
          </button>
        </div>
      </div>

      {/* Active Architecture Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Banner Card */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-4 sm:p-6 flex flex-col justify-between ${
            archTab === 'algor'
              ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/25 via-slate-900/90 to-slate-950'
              : 'border-amber-500/40 bg-gradient-to-b from-amber-950/25 via-slate-900/90 to-slate-950'
          }`}
        >
          <div className="space-y-4">
            <span
              className={`inline-block px-3 py-1 rounded-md text-[10px] sm:text-[11px] font-mono uppercase tracking-wider border ${
                archTab === 'algor'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              }`}
            >
              {activeArch.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {activeArch.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeArch.description}
            </p>

            {/* 4 Key Metrics */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2">
              {activeArch.metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90"
                >
                  <div className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                    {m.label}
                  </div>
                  <div
                    className={`text-lg sm:text-xl font-bold font-mono tabular-nums mt-1 ${
                      archTab === 'algor' ? 'text-cyan-300' : 'text-amber-300'
                    }`}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photography Preview */}
          <div className="mt-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <ResilientImage
              src={activeArch.heroImage}
              alt={activeArch.title}
              fallbackLabel={activeArch.subtitle}
              className="w-full h-44 sm:h-48 object-cover"
            />
            <div className="p-3 text-xs font-mono text-slate-400 bg-slate-950">
              {activeArch.heroCaption}
            </div>
          </div>
        </div>

        {/* Right 4-Module Stack Breakdown */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {activeArch.modules.map((mod) => (
            <div
              key={mod.code}
              className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 sm:p-6 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                      archTab === 'algor'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {mod.code}
                  </span>
                  <span className="text-xs font-mono tabular-nums text-emerald-400">
                    {mod.latencyOrSpec}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-2 font-display">
                  {mod.name}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{mod.summary}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-slate-800/80">
                {mod.techTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
