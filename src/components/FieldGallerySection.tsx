import React from 'react';
import { Factory, Maximize2 } from 'lucide-react';
import { FIELD_GALLERY } from '../data/roboticsData';
import { FieldGalleryItem } from '../types/robotics';
import { ResilientImage } from './ui/ResilientImage';

interface FieldGallerySectionProps {
  onOpenLightbox: (item: FieldGalleryItem) => void;
}

export const FieldGallerySection: React.FC<FieldGallerySectionProps> = ({
  onOpenLightbox,
}) => {
  return (
    <section
      id="field-gallery"
      aria-labelledby="field-gallery-heading"
      className="py-16 sm:py-20 border-b border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
              <Factory className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>04. FIELD DEPLOYMENT & R&D LAB OPTICS</span>
            </div>
            <h2
              id="field-gallery-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display"
            >
              Proven in Cleanrooms, Gigafactories & Thermal Labs
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Inspect real-world industrial deployments and electromechanical validation benches.
              Click any optical feed for full-resolution telemetry inspection.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FIELD_GALLERY.map((item) => (
            <article
              key={item.id}
              onClick={() => onOpenLightbox(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenLightbox(item);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Inspect field deployment optical feed: ${item.title}`}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 hover:border-cyan-500/50 transition-all flex flex-col focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <div className="relative h-52 sm:h-64 overflow-hidden bg-slate-900">
                <ResilientImage
                  src={item.image}
                  alt={item.title}
                  fallbackLabel={item.telemetryTag}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent"
                  aria-hidden="true"
                />

                {/* Telemetry Top Strip */}
                <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5">
                  <span className="px-2.5 py-1 rounded bg-slate-950/85 border border-slate-700 text-[10px] sm:text-[11px] font-mono text-cyan-300">
                    {item.telemetryTag}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono text-emerald-300">
                    {item.metricBadge}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute bottom-3 right-3 p-2 rounded-lg bg-slate-950/80 border border-slate-700 text-slate-300 group-hover:text-cyan-300 group-hover:border-cyan-500/50 transition-colors">
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] sm:text-xs font-mono text-amber-400 mb-1">
                    <span>{item.location}</span>
                    <span>{item.environment}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.caption}</p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                  <span>DEPLOYED: {item.robotUnit}</span>
                  <span className="text-cyan-400 group-hover:underline">Inspect Feed →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
