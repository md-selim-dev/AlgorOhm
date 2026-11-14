import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Box,
  ChevronRight,
  Cpu,
  Factory,
  FileText,
  Layers,
  Sliders,
} from 'lucide-react';
import {
  ARCHITECTURE_STACK,
  FIELD_GALLERY,
  ROBOT_PLATFORMS,
  WHITEPAPERS,
} from '../data/roboticsData';
import { WebsitePageId } from '../types/robotics';
import { WEBSITE_NAV_ITEMS } from './Navbar';
import { Robot3DViewer, ViewerModelId } from './Robot3DViewer';
import { ResilientImage } from './ui/ResilientImage';
import { SpotlightCard } from './ui/SpotlightCard';

interface PageHeaderProps {
  activePage: WebsitePageId;
  onNavigate: (page: WebsitePageId, sectionId?: string) => void;
}

const PAGE_HERO_CONFIG: Record<
  Exclude<WebsitePageId, 'home'>,
  {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    kpis: { label: string; value: string; unit?: string; tone: string }[];
    quickLinks?: { label: string; sectionId: string }[];
  }
> = {
  platforms: {
    badge: 'ALGOROS 4.2 FLEET // UNIFIED SILICON-CARBIDE ACTUATION',
    title: 'Autonomous Robotic Platforms &',
    highlight: 'Deep Spec Inspector.',
    description:
      'Compare our four production-grade autonomous platforms—from bipedal humanoids and heavy cleanroom AMRs to sub-micron manipulators—and run live payload × thermal duty-cycle simulations below.',
    kpis: [
      { label: 'ACTIVE PLATFORMS', value: '4', unit: 'Units', tone: 'text-cyan-400' },
      { label: 'PEAK TRACTION / TORQUE', value: '620', unit: 'Nm', tone: 'text-amber-400' },
      { label: 'MAX DECK PAYLOAD', value: '1,500', unit: 'kg', tone: 'text-emerald-400' },
      { label: 'ISO REPEATABILITY', value: '±0.015', unit: 'mm', tone: 'text-sky-400' },
    ],
    quickLinks: [
      { label: '01. Hardware Fleet Catalog', sectionId: 'platforms' },
      { label: '02. Deep Spec & Thermal Inspector', sectionId: 'inspector' },
    ],
  },
  architecture: {
    badge: 'DETERMINISTIC 4.0 KHZ RTOS × 0.078 mΩ QDD STATORS',
    title: 'Vertically Integrated',
    highlight: 'Algor™ × Ohm™ Stack.',
    description:
      'Explore how AlgorOS 4.2 unifies vision-language-action (VLA) foundation models with 4 kHz whole-body model predictive control—driving custom Silicon-Carbide (SiC) Halbach actuators with zero backlash.',
    kpis: [
      { label: 'CONTROL LOOP RATE', value: '4.0', unit: 'kHz', tone: 'text-cyan-400' },
      { label: 'WORST-CASE JITTER', value: '< 1.2', unit: 'μs', tone: 'text-emerald-400' },
      { label: 'STATOR RESISTANCE', value: '0.078', unit: 'mΩ', tone: 'text-amber-400' },
      { label: 'SIC FOC EFFICIENCY', value: '98.4', unit: '%', tone: 'text-sky-400' },
    ],
  },
  deployments: {
    badge: 'ISO CLASS 3 CLEANROOMS • GIGAFACTORIES • RaaS & CAPEX ROI',
    title: 'Field Deployments &',
    highlight: 'Enterprise Fleet ROI.',
    description:
      'Inspect real-world optical telemetry from semiconductor wafer fabs, automotive spot-welding lines, and thermal torture benches—then model your facility’s exact payback period and 5-year OPEX savings.',
    kpis: [
      { label: 'FLEET AVAILABILITY', value: '99.998', unit: '%', tone: 'text-emerald-400' },
      { label: 'TYPICAL PAYBACK', value: '3.5–8.2', unit: 'mos', tone: 'text-amber-400' },
      { label: 'THROUGHPUT GAIN', value: '+34–52', unit: '%', tone: 'text-cyan-400' },
      { label: 'TSN SYNC JITTER', value: '140', unit: 'ns', tone: 'text-sky-400' },
    ],
    quickLinks: [
      { label: '01. Field Deployment Optics', sectionId: 'field-gallery' },
      { label: '02. Interactive Fleet ROI Simulator', sectionId: 'roi-configurator' },
    ],
  },
  research: {
    badge: 'SAN FRANCISCO • ZURICH • BOSTON • TOKYO R&D LABS',
    title: 'AlgorOhm Lab',
    highlight: 'Technical Monographs.',
    description:
      'Peer-reviewed engineering monographs and empirical benchmarks covering Vision-Language-Action impedance control, sub-milliohm Litz-wire QDD stators, and decentralized VDA 5050 swarm routing.',
    kpis: [
      { label: 'CONTACT IMPULSE DELTA', value: '-78', unit: '%', tone: 'text-emerald-400' },
      { label: 'CONTINUOUS TORQUE GAIN', value: '+41', unit: '%', tone: 'text-amber-400' },
      { label: 'SWARM THROUGHPUT', value: '+29', unit: '%', tone: 'text-cyan-400' },
      { label: 'SIM-TO-REAL CORRELATION', value: '99.1', unit: '%', tone: 'text-sky-400' },
    ],
  },
};

/**
 * Cohesive Architectural Page Hero Header for inner pages.
 * Shares the exact same tech-grid, ambient radial lighting, and typography as the Home Hero.
 */
export const PageHeroHeader: React.FC<PageHeaderProps> = ({
  activePage,
  onNavigate,
}) => {
  if (activePage === 'home') return null;

  const config = PAGE_HERO_CONFIG[activePage];
  const activeNav = WEBSITE_NAV_ITEMS.find((i) => i.id === activePage);

  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 pt-8 pb-12 sm:pt-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Clean Breadcrumb Bar */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/70 text-xs font-mono"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-600" aria-hidden="true">
              /
            </span>
            <span className="text-cyan-300 font-semibold">{activeNav?.label}</span>
          </div>

          {config.quickLinks && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 hidden sm:inline">ON THIS PAGE:</span>
              {config.quickLinks.map((link) => (
                <a
                  key={link.sectionId}
                  href={`#${link.sectionId}`}
                  className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-[11px] font-mono">
              <span className="text-emerald-400" aria-hidden="true">
                ●
              </span>
              <span>{config.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1] font-display">
              {config.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-amber-400">
                {config.highlight}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {config.description}
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {config.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-sm"
              >
                <div className="text-[10px] font-mono text-slate-400 tracking-wider truncate">
                  {kpi.label}
                </div>
                <div className={`text-xl font-bold font-mono tabular-nums mt-0.5 ${kpi.tone}`}>
                  {kpi.value}
                  {kpi.unit && (
                    <span className="text-xs font-mono text-slate-400 ml-1">{kpi.unit}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const PagePaginationFooter: React.FC<PageHeaderProps> = ({
  activePage,
  onNavigate,
}) => {
  const currentIdx = WEBSITE_NAV_ITEMS.findIndex((item) => item.id === activePage);
  const prevItem =
    WEBSITE_NAV_ITEMS[
      (currentIdx - 1 + WEBSITE_NAV_ITEMS.length) % WEBSITE_NAV_ITEMS.length
    ];
  const nextItem = WEBSITE_NAV_ITEMS[(currentIdx + 1) % WEBSITE_NAV_ITEMS.length];

  return (
    <section
      aria-label="Website Page Navigation"
      className="border-t border-slate-800/80 bg-[#080C16]/85 backdrop-blur-sm py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onNavigate(prevItem.id)}
            className="group p-5 rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  PREVIOUS PAGE
                </div>
                <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display truncate">
                  {prevItem.label}
                </div>
                <div className="text-xs text-slate-400 truncate">{prevItem.subtitle}</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(nextItem.id)}
            className="group p-5 rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-right flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                NEXT PAGE
              </div>
              <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display truncate">
                {nextItem.label}
              </div>
              <div className="text-xs text-slate-400 truncate">{nextItem.subtitle}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

interface HomeOverviewPortalProps {
  selectedRobotId: string;
  onSelectRobotAndInspect: (robotId: string) => void;
  onNavigate: (page: WebsitePageId, sectionId?: string) => void;
}

/**
 * Cohesive Home Page Executive Teaser Portal:
 * Preserves the exact visual design, cards, and engineering content while guiding users
 * effortlessly into Platforms, Architecture, Deployments & ROI, and Research.
 */
export const HomeOverviewPortal: React.FC<HomeOverviewPortalProps> = ({
  selectedRobotId,
  onSelectRobotAndInspect,
  onNavigate,
}) => {
  const initial3DModel: ViewerModelId =
    selectedRobotId === 'ohm-x1' ? 'ohm-x1' : 'kinetix-7-arm';

  return (
    <div className="divide-y divide-slate-800/80">
      {/* 01. Flagship Robotic Fleet Teaser on Home */}
      <section
        aria-labelledby="home-fleet-teaser-heading"
        className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>01. EMBODIED HARDWARE FLEET</span>
            </div>
            <h2
              id="home-fleet-teaser-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display"
            >
              Production-Grade Autonomous Platforms
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Every AlgorOhm unit shares a unified AlgorOS neural kernel and modular Ohm™
              Silicon-Carbide actuators. Select any platform to inspect its full kinematic &
              thermal datasheet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('platforms')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer"
            >
              <span>View All Platforms & Specs</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('platforms', 'inspector')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-500/50 hover:text-white transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Open Spec Inspector</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ROBOT_PLATFORMS.map((robot) => {
            const isSelected = robot.id === selectedRobotId;
            return (
              <SpotlightCard
                key={robot.id}
                onClick={() => onSelectRobotAndInspect(robot.id)}
                ariaLabel={`Inspect ${robot.name} specifications`}
                className={`rounded-2xl border cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400/80 bg-[#0B1222]'
                    : 'border-slate-800/90 bg-[#0A0E19]/90 hover:border-slate-700'
                }`}
              >
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-950">
                  <ResilientImage
                    src={robot.image}
                    alt={`${robot.name} — ${robot.tagline}`}
                    fallbackLabel={robot.cvBoundingBox}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0A0E19] via-[#0A0E19]/40 to-transparent"
                    aria-hidden="true"
                  />

                  <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-mono uppercase tracking-wider bg-slate-950/85 border border-slate-700/80 text-cyan-300 backdrop-blur-md">
                      {robot.codename}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-mono uppercase tracking-wider backdrop-blur-md border ${
                        robot.availability === 'Production Ready'
                          ? 'bg-emerald-950/85 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-950/85 border-amber-500/40 text-amber-300'
                      }`}
                    >
                      ● {robot.availability}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 sm:left-5 sm:right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block text-[11px] sm:text-xs font-mono text-amber-400 uppercase tracking-wider truncate">
                        {robot.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display truncate">
                        {robot.name}
                      </h3>
                    </div>
                    <span className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono text-cyan-300 bg-cyan-950/85 border border-cyan-500/40 px-2.5 py-1 rounded-md">
                      INSPECT DATASHEET
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {robot.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80 text-center">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">PEAK TORQUE</div>
                      <div className="text-xs font-mono font-semibold text-white mt-0.5 tabular-nums">
                        {robot.specs.peakTorque.split(' ')[0]} Nm
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">COMPUTE</div>
                      <div className="text-xs font-mono font-semibold text-cyan-300 mt-0.5 tabular-nums">
                        {robot.specs.computePower.split(' ')[0]} TOPS
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">MAX PAYLOAD</div>
                      <div className="text-xs font-mono font-semibold text-amber-300 mt-0.5 tabular-nums">
                        {robot.specs.maxPayloadKg} kg
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">RUNTIME</div>
                      <div className="text-xs font-mono font-semibold text-emerald-300 mt-0.5 tabular-nums">
                        {robot.specs.baseRuntimeHours} hrs
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Interactive 3D Mechanical Joint & Actuator Viewer Showcase */}
        <div className="mt-12 sm:mt-16 pt-12 border-t border-slate-800/80">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
                <Box className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>INTERACTIVE REACT THREE FIBER // 3D KINEMATIC & STATOR VIEWER</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-display">
                3D Mechanical Joint & Ohm™ Actuator Inspector
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl">
                Rotate, zoom, and click any mechanical joint on the{' '}
                <strong className="text-slate-200">Kinetix-7 Axis Arm</strong> or{' '}
                <strong className="text-slate-200">Ohm-X1 Humanoid</strong> to inspect its
                Silicon-Carbide Halbach stator windings, BiSS-C dual optical encoder ring, and
                live joint articulation in 3D.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('platforms', 'inspector')}
              className="self-start lg:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 font-semibold transition-all cursor-pointer shrink-0"
            >
              <span>Open Full Datasheet & Thermal Sim</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <Robot3DViewer initialModelId={initial3DModel} />
        </div>
      </section>

      {/* 02. Architecture, Deployments & Research Executive Portals */}
      <section
        aria-labelledby="home-directory-heading"
        className="py-16 sm:py-20 bg-[#090D18]/75 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
              <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>02. CORE ARCHITECTURE, DEPLOYMENTS & RESEARCH</span>
            </div>
            <h2
              id="home-directory-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display"
            >
              Explore the AlgorOhm Engineering Ecosystem
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Dive deeper into our dual-core silicon and electromechanical stack, real-world
              cleanroom and gigafactory deployments, interactive ROI calculator, and lab papers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Architecture Card */}
            <SpotlightCard
              onClick={() => onNavigate('architecture')}
              ariaLabel="Explore Architecture page"
              className="rounded-2xl border border-cyan-500/35 bg-gradient-to-b from-cyan-950/20 via-[#0A0E19]/95 to-slate-950 p-6 cursor-pointer"
            >
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 uppercase tracking-wider">
                      ARCHITECTURE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      ALGOR × OHM
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    The Algor™ × Ohm™ Dual-Core Stack
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {ARCHITECTURE_STACK.algor.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {ARCHITECTURE_STACK.algor.metrics.slice(0, 2).map((m) => (
                      <div
                        key={m.label}
                        className="p-3 rounded-xl bg-slate-950/85 border border-slate-800"
                      >
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {m.label}
                        </div>
                        <div className="text-base font-bold font-mono text-cyan-300 mt-0.5 tabular-nums">
                          {m.value}
                        </div>
                      </div>
                    ))}
                    {ARCHITECTURE_STACK.ohm.metrics.slice(0, 2).map((m) => (
                      <div
                        key={m.label}
                        className="p-3 rounded-xl bg-slate-950/85 border border-slate-800"
                      >
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {m.label}
                        </div>
                        <div className="text-base font-bold font-mono text-amber-300 mt-0.5 tabular-nums">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>Explore Dual-Core Architecture</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Deployments & ROI Card */}
            <SpotlightCard
              onClick={() => onNavigate('deployments')}
              ariaLabel="Explore Deployments and ROI Simulator page"
              className="rounded-2xl border border-slate-800/90 bg-[#0A0E19]/90 hover:border-cyan-500/40 p-6 cursor-pointer"
            >
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Factory className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>DEPLOYMENTS & ROI</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      LIVE SIMULATOR
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Field Optics & Fleet Payback Configurator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Inspect optical telemetry from ISO Class 3 semiconductor fabs and EV welding
                    cells, and calculate 5-year net OPEX savings for your facility.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {FIELD_GALLERY.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950"
                      >
                        <ResilientImage
                          src={item.image}
                          alt={item.title}
                          fallbackLabel={item.telemetryTag}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2 text-[10px] font-mono text-slate-300 truncate">
                          {item.location}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span className="inline-flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Open Field Optics & ROI Sim</span>
                    </span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Research Monographs Card */}
            <SpotlightCard
              onClick={() => onNavigate('research')}
              ariaLabel="Explore Research Monographs page"
              className="rounded-2xl border border-slate-800/90 bg-[#0A0E19]/90 hover:border-cyan-500/40 p-6 cursor-pointer"
            >
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>RESEARCH LABS</span>
                    </span>
                    <span className="text-slate-400">3 MONOGRAPHS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Peer-Reviewed Benchmarks & Whitepapers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Technical monographs from Zurich, Boston, and San Francisco on VLA impedance
                    control, sub-milliohm stators, and VDA 5050 swarm routing.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    {WHITEPAPERS.map((wp) => (
                      <div
                        key={wp.id}
                        className="p-2.5 rounded-xl bg-slate-950/85 border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs text-slate-200 font-medium truncate">
                          {wp.title}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                          {wp.benchmarkDelta}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>Read Technical Monographs</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </div>
  );
};
