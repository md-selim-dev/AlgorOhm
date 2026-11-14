import React from 'react';
import { Award, Globe, MapPin, ShieldCheck } from 'lucide-react';
import { ROBOT_PLATFORMS } from '../data/roboticsData';
import { WebsitePageId } from '../types/robotics';
import { getPageHref } from '../utils/routes';
import { AlgorOhmLogo } from './ui/AlgorOhmLogo';

interface FooterProps {
  onSelectRobot: (robotId: string) => void;
  onNavigate: (page: WebsitePageId, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectRobot, onNavigate }) => {
  const handlePageLink = (
    e: React.MouseEvent,
    page: WebsitePageId,
    sectionId?: string
  ) => {
    e.preventDefault();
    onNavigate(page, sectionId);
  };

  return (
    <footer className="border-t border-slate-800 bg-[#05070B] py-12 sm:py-16 text-sm text-slate-400 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-slate-800/80">
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <a
              href={getPageHref('home')}
              onClick={(e) => handlePageLink(e, 'home')}
              className="inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-cyan-400 rounded-lg"
            >
              <AlgorOhmLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-display">
                ALGOR<span className="text-cyan-400">OHM</span> ROBOTICS
              </span>
            </a>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              AlgorOhm Robotics Inc. engineers vertically integrated embodied physical AI systems
              — combining deterministic edge neural compute with ultra-low impedance
              Silicon-Carbide QDD actuators.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 text-xs font-mono text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                San Francisco • Zurich • Tokyo
              </span>
              <span className="hidden sm:inline" aria-hidden="true">
                |
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                ISO 10218-1 & ISO 3691-4 Certified
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Robotic Platforms
            </h3>
            <ul className="space-y-2.5 text-xs">
              {ROBOT_PLATFORMS.map((r) => (
                <li key={r.id}>
                  <a
                    href={getPageHref('platforms', 'inspector')}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectRobot(r.id);
                      onNavigate('platforms', 'inspector');
                    }}
                    className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded inline-block py-0.5"
                  >
                    {r.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={getPageHref('home')}
                  onClick={(e) => handlePageLink(e, 'home')}
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded inline-block py-0.5"
                >
                  Home & Kinematic Bench
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('platforms')}
                  onClick={(e) => handlePageLink(e, 'platforms')}
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded inline-block py-0.5"
                >
                  Platforms & Spec Inspector
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('architecture')}
                  onClick={(e) => handlePageLink(e, 'architecture')}
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded inline-block py-0.5"
                >
                  Algor × Ohm Architecture
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('deployments')}
                  onClick={(e) => handlePageLink(e, 'deployments')}
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded inline-block py-0.5"
                >
                  Deployments & Fleet ROI
                </a>
              </li>
              <li>
                <a
                  href={getPageHref('research')}
                  onClick={(e) => handlePageLink(e, 'research')}
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded inline-block py-0.5"
                >
                  Research Monographs
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Compliance & Safety
            </h3>
            <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-1 gap-2.5 text-xs">
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                <span>SIL-3 / PLd Force Limiting</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                <span>Zero-Cloud Air-Gapped Option</span>
              </li>
              <li>ROS 2 Jazzy / EtherCAT 10G</li>
              <li>UL 2580 SiC Battery Pack</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} ALGOROHM ROBOTICS INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400">● TELEMETRY BUS NOMINAL (4.00 kHz)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
