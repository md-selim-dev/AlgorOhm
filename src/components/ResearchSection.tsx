import React from 'react';
import { ChevronRight, FileText, Terminal } from 'lucide-react';
import { WHITEPAPERS } from '../data/roboticsData';
import { Whitepaper } from '../types/robotics';

interface ResearchSectionProps {
  onSelectWhitepaper: (paper: Whitepaper) => void;
}

export const ResearchSection: React.FC<ResearchSectionProps> = ({
  onSelectWhitepaper,
}) => {
  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>06. ALGOROHM LAB TECHNICAL MONOGRAPHS</span>
            </div>
            <h2
              id="research-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display"
            >
              Peer-Reviewed Benchmarks & Whitepapers
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Explore our latest publications on vision-language-action (VLA) foundation models,
              sub-milliohm stator windings, and decentralized VDA 5050 fleet orchestration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHITEPAPERS.map((paper) => (
            <article
              key={paper.id}
              itemScope
              itemType="https://schema.org/TechArticle"
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                  <span itemProp="articleSection" className="text-cyan-400">
                    {paper.category}
                  </span>
                  <span className="shrink-0">{paper.readTime}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">{paper.date}</div>
                <h3
                  itemProp="headline"
                  className="text-base sm:text-lg font-bold text-white leading-snug font-display"
                >
                  {paper.title}
                </h3>
                <p
                  itemProp="abstract"
                  className="text-xs text-slate-300 leading-relaxed line-clamp-4"
                >
                  {paper.abstract}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-800/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
                  <span className="text-slate-400">BENCHMARK GAIN:</span>
                  <span className="text-emerald-400 font-bold">{paper.benchmarkDelta}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectWhitepaper(paper)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  <Terminal className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Read Executive Brief</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
