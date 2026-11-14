import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { WebsitePageId } from '../types/robotics';
import { AlgorOhmLogo } from './ui/AlgorOhmLogo';

interface NavbarProps {
  activePage: WebsitePageId;
  onNavigate: (page: WebsitePageId, sectionId?: string) => void;
  onOpenDemoModal: () => void;
}

export const WEBSITE_NAV_ITEMS: {
  id: WebsitePageId;
  label: string;
  subtitle: string;
}[] = [
  { id: 'home', label: 'Home', subtitle: 'Kinematic Workbench & Executive Summary' },
  { id: 'platforms', label: 'Platforms', subtitle: 'Autonomous Fleet & Spec Inspector' },
  { id: 'architecture', label: 'Architecture', subtitle: 'Algor™ Neural OS × Ohm™ Actuators' },
  { id: 'deployments', label: 'Deployments & ROI', subtitle: 'Field Optics & Payback Simulator' },
  { id: 'research', label: 'Research', subtitle: 'Peer-Reviewed Lab Monographs' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenDemoModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, page: WebsitePageId) => {
    e.preventDefault();
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#07090E]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 group focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-lg"
          aria-label="AlgorOhm Robotics Home"
        >
          <div className="relative shrink-0">
            <AlgorOhmLogo className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-display truncate">
                ALGOR<span className="text-cyan-400">OHM</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shrink-0">
                ROBOTICS
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 tracking-wider truncate">
              NEURAL COMPUTE × PHYSICAL ACTUATION
            </span>
          </div>
        </a>

        {/* Desktop Professional Website Navigation */}
        <nav
          aria-label="Primary Website Navigation"
          className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/70 border border-slate-800/90 shrink-0"
        >
          {WEBSITE_NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-4 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Primary Action CTA (Tablet & Desktop) */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenDemoModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300 whitespace-nowrap"
          >
            <span>Request Unit Demo</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile & Tablet Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-lg border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 focus-visible:outline-2 focus-visible:outline-cyan-400"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Mobile Website Navigation"
          className="lg:hidden border-t border-slate-800 bg-[#07090E]/98 backdrop-blur-xl px-4 sm:px-6 py-4 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {WEBSITE_NAV_ITEMS.map((item) => {
              const isActive = activePage === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`p-3 rounded-xl border transition-colors flex flex-col justify-between ${
                    isActive
                      ? 'bg-cyan-500/15 border-cyan-400/60 text-white'
                      : 'bg-slate-900/70 border-slate-800/80 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${
                        isActive ? 'text-cyan-300' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5">{item.subtitle}</span>
                </a>
              );
            })}
          </div>
          <div className="pt-2 border-t border-slate-800 sm:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-cyan-400 text-slate-950 text-center flex items-center justify-center gap-1.5"
            >
              <span>Request Unit Demo</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};
