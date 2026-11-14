import React, { useId, useMemo, useState } from 'react';
import { ArrowUpRight, BarChart3 } from 'lucide-react';
import { ROI_INDUSTRY_PRESETS } from '../data/roboticsData';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { RoiIndustryId } from '../types/robotics';

interface RoiConfiguratorSectionProps {
  onExportProposal: (summary: {
    recommendedRobot: string;
    environmentLabel: string;
    notes: string;
  }) => void;
}

export const RoiConfiguratorSection: React.FC<RoiConfiguratorSectionProps> = ({
  onExportProposal,
}) => {
  const fleetSizeSliderId = useId();
  const facilitySqFtSliderId = useId();

  const [roiIndustry, setRoiIndustry] = useState<RoiIndustryId>('semiconductor');
  const [roiFleetSize, setRoiFleetSize] = useState<number>(12);
  const [roiShiftsPerDay, setRoiShiftsPerDay] = useState<number>(3);
  const [roiFacilitySqFt, setRoiFacilitySqFt] = useState<number>(120000);

  const roiResults = useMemo(() => {
    const preset = ROI_INDUSTRY_PRESETS[roiIndustry];
    const annualHoursPerShift = 2080;
    const displacedLaborHours = roiFleetSize * roiShiftsPerDay * annualHoursPerShift * 0.88;
    const grossLaborSavings = displacedLaborHours * preset.laborHourlyUsd;
    const qualityYieldBonus = grossLaborSavings * (preset.scrapReductionFactor - 1);
    const fleetEnergyAndMaintCost = roiFleetSize * 7400 * roiShiftsPerDay;
    const netAnnualSavings = Math.max(
      45000,
      Math.round(grossLaborSavings + qualityYieldBonus - fleetEnergyAndMaintCost)
    );
    const totalCapex = roiFleetSize * preset.unitCapexUsd;
    const paybackMonths = Math.max(
      3.5,
      Number(((totalCapex / netAnnualSavings) * 12).toFixed(1))
    );
    const fiveYearNetRoi = netAnnualSavings * 5 - totalCapex;
    const fiveYearNetRoiMillions = Number((fiveYearNetRoi / 1000000).toFixed(2));
    const coverageDensity = Math.round(roiFacilitySqFt / roiFleetSize);

    return {
      preset,
      netAnnualSavings,
      totalCapex,
      paybackMonths,
      fiveYearNetRoi,
      fiveYearNetRoiMillions,
      coverageDensity,
    };
  }, [roiIndustry, roiFleetSize, roiShiftsPerDay, roiFacilitySqFt]);

  const animAnnualSavings = useAnimatedNumber(roiResults.netAnnualSavings, 340, 0);
  const animPaybackMonths = useAnimatedNumber(roiResults.paybackMonths, 340, 1);
  const animFiveYearRoi = useAnimatedNumber(roiResults.fiveYearNetRoiMillions, 340, 2);

  return (
    <section
      id="roi-configurator"
      aria-labelledby="roi-heading"
      className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
          <BarChart3 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>05. ENTERPRISE DEPLOYMENT & TELEMETRY ROI SIMULATOR</span>
        </div>
        <h2
          id="roi-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display"
        >
          Interactive Fleet Payback & Throughput Configurator
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
          Model capital payback, displaced ergonomic risk, and 5-year net OPEX savings when
          deploying an AlgorOhm fleet across your facility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Controls */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          {/* Industry Sector Buttons */}
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              1. SELECT INDUSTRIAL DEPLOYMENT SECTOR
            </span>
            <div
              role="group"
              aria-label="Select industrial deployment sector"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            >
              {(Object.keys(ROI_INDUSTRY_PRESETS) as RoiIndustryId[]).map((key) => {
                const item = ROI_INDUSTRY_PRESETS[key];
                const active = roiIndustry === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRoiIndustry(key)}
                    aria-pressed={active}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                      active
                        ? 'bg-cyan-500/15 border-cyan-400 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[11px] font-mono text-cyan-400 mt-1">
                      Rec: {item.recommendedRobot}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-5 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono tabular-nums mb-1.5">
                <label htmlFor={fleetSizeSliderId} className="text-slate-300">
                  2. AUTONOMOUS UNITS DEPLOYED
                </label>
                <span className="text-cyan-400 font-bold">{roiFleetSize} Units</span>
              </div>
              <input
                id={fleetSizeSliderId}
                type="range"
                min={2}
                max={60}
                value={roiFleetSize}
                onChange={(e) => setRoiFleetSize(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono tabular-nums mb-2">
                <span className="text-slate-300">3. DAILY SHIFT OPERATIONS</span>
                <span className="text-amber-400 font-bold">
                  {roiShiftsPerDay} Shift{roiShiftsPerDay > 1 ? 's' : ''} (
                  {roiShiftsPerDay * 8} hrs/day)
                </span>
              </div>
              <div
                role="group"
                aria-label="Select daily shift operations"
                className="grid grid-cols-3 gap-2 sm:gap-3"
              >
                {[1, 2, 3].map((shift) => (
                  <button
                    key={shift}
                    type="button"
                    onClick={() => setRoiShiftsPerDay(shift)}
                    aria-pressed={roiShiftsPerDay === shift}
                    className={`py-2.5 px-2 rounded-xl font-mono text-[11px] sm:text-xs border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 ${
                      roiShiftsPerDay === shift
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {shift} Shift{shift > 1 ? 's' : ''} ({shift * 8}h)
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono tabular-nums mb-1.5">
                <label htmlFor={facilitySqFtSliderId} className="text-slate-300">
                  4. ACTIVE FACILITY FOOTPRINT
                </label>
                <span className="text-emerald-400 font-bold">
                  {roiFacilitySqFt.toLocaleString()} sq. ft.
                </span>
              </div>
              <input
                id={facilitySqFtSliderId}
                type="range"
                min={25000}
                max={500000}
                step={25000}
                value={roiFacilitySqFt}
                onChange={(e) => setRoiFacilitySqFt(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Output Telemetry Card */}
        <div className="lg:col-span-5 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-[#0C1526] to-[#070B14] p-4 sm:p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                  PROJECTED FINANCIAL & TELEMETRY OUTPUT
                </div>
                <div className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {roiResults.preset.recommendedRobot}
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-300 shrink-0">
                RaaS OR CAPEX
              </span>
            </div>

            <div>
              <div className="text-xs font-mono text-slate-400">
                ESTIMATED ANNUAL NET OPEX SAVINGS
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tabular-nums text-white mt-1 break-words">
                ${animAnnualSavings.toLocaleString()}
                <span className="text-xs sm:text-sm font-normal text-emerald-400 ml-1">
                  / yr
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/85 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">FULL CAPEX PAYBACK</div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1">
                  {animPaybackMonths.toFixed(1)}
                  <span className="text-xs uppercase font-mono text-slate-400 ml-1">
                    mos
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Includes hot-swap docks
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/85 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">THROUGHPUT BOOST</div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-cyan-400 mt-1">
                  +{roiResults.preset.throughputBoostPct}
                  <span className="text-xs uppercase font-mono text-slate-400 ml-1">%</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Zero shift-change downtime
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/85 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">5-YEAR NET CUMULATIVE</div>
                <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                  ${animFiveYearRoi.toFixed(2)}M
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  After maintenance & power
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/85 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">COVERAGE DENSITY</div>
                <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-200 mt-1">
                  {roiResults.coverageDensity.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">sq. ft. per active unit</div>
              </div>
            </div>
          </div>

          <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() =>
                onExportProposal({
                  recommendedRobot: roiResults.preset.recommendedRobot,
                  environmentLabel: roiResults.preset.label,
                  notes: `Fleet ROI Simulation: ${roiFleetSize} units across ${roiFacilitySqFt.toLocaleString()} sq.ft (${roiShiftsPerDay} shifts/day). Projected annual savings: $${roiResults.netAnnualSavings.toLocaleString()}/yr (${roiResults.paybackMonths} mos payback).`,
                })
              }
              className="w-full py-3.5 px-4 sm:px-5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              <span>Export Custom Fleet Proposal & CAD Pack</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
