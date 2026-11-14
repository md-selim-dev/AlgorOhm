import React, { useEffect, useId, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { FieldGalleryItem, PilotFormState, Whitepaper } from '../types/robotics';
import { AlgorOhmLogo } from './ui/AlgorOhmLogo';
import { ResilientImage } from './ui/ResilientImage';

interface ModalsProps {
  demoModalOpen: boolean;
  onCloseDemoModal: () => void;
  pilotForm: PilotFormState;
  setPilotForm: React.Dispatch<React.SetStateAction<PilotFormState>>;
  pilotSubmitted: boolean;
  onPilotSubmit: (e: React.FormEvent) => void;
  selectedWhitepaper: Whitepaper | null;
  onCloseWhitepaper: () => void;
  onRequestWhitepaperPdf: (paper: Whitepaper) => void;
  lightboxPhoto: FieldGalleryItem | null;
  onCloseLightbox: () => void;
  onInquireLightboxDeployment: (photo: FieldGalleryItem) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Modals: React.FC<ModalsProps> = ({
  demoModalOpen,
  onCloseDemoModal,
  pilotForm,
  setPilotForm,
  pilotSubmitted,
  onPilotSubmit,
  selectedWhitepaper,
  onCloseWhitepaper,
  onRequestWhitepaperPdf,
  lightboxPhoto,
  onCloseLightbox,
  onInquireLightboxDeployment,
}) => {
  const nameInputId = useId();
  const emailInputId = useId();
  const companyInputId = useId();
  const platformSelectId = useId();
  const notesTextareaId = useId();
  const [formError, setFormError] = useState<string | null>(null);

  // Close active modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (demoModalOpen) onCloseDemoModal();
        if (selectedWhitepaper) onCloseWhitepaper();
        if (lightboxPhoto) onCloseLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    demoModalOpen,
    selectedWhitepaper,
    lightboxPhoto,
    onCloseDemoModal,
    onCloseWhitepaper,
    onCloseLightbox,
  ]);

  const handleValidatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = pilotForm.name.trim();
    const trimmedEmail = pilotForm.email.trim();
    const trimmedCompany = pilotForm.company.trim();

    if (trimmedName.length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setFormError('Please enter a valid work email address.');
      return;
    }
    if (trimmedCompany.length < 2) {
      setFormError('Please enter your organization or facility name.');
      return;
    }

    setFormError(null);
    onPilotSubmit(e);
  };

  return (
    <>
      {/* 1. Pilot Deployment Consultation Modal */}
      {demoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pilot-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseDemoModal();
          }}
        >
          <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-2xl border border-cyan-500/40 bg-[#0A0F1D] p-5 sm:p-8 shadow-2xl">
            <button
              type="button"
              onClick={onCloseDemoModal}
              aria-label="Close unit demo request dialog"
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            {pilotSubmitted ? (
              <div className="py-4 sm:py-6 text-center space-y-4" role="status" aria-live="polite">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />
                </div>
                <h3
                  id="pilot-modal-title"
                  className="text-xl sm:text-2xl font-bold text-white font-display"
                >
                  Engineering Dossier Dispatched
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-cyan-300 font-medium">{pilotForm.name}</span>.
                  Our Embodied Systems Architects have assigned reference ticket{' '}
                  <span className="font-mono text-amber-300">#AO-2026-884</span> for{' '}
                  <span className="text-white font-medium">{pilotForm.platform}</span> and will
                  deliver URDF/MuJoCo simulation models to{' '}
                  <span className="font-mono text-cyan-300 break-all">{pilotForm.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={onCloseDemoModal}
                  className="mt-4 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-xs uppercase tracking-wider cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                  Return to Console
                </button>
              </div>
            ) : (
              <form onSubmit={handleValidatedSubmit} noValidate className="space-y-4">
                <div className="flex items-center gap-2.5 pr-8">
                  <AlgorOhmLogo className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-cyan-400">
                    ALGOROHM FIELD DEPLOYMENT DESK
                  </span>
                </div>
                <h3
                  id="pilot-modal-title"
                  className="text-xl sm:text-2xl font-bold text-white font-display pr-6"
                >
                  Schedule an Engineering Briefing & Unit Pilot
                </h3>
                <p className="text-xs text-slate-400">
                  Receive full STEP/URDF kinematic packages, Isaac Lab / MuJoCo simulation
                  containers, and on-site pilot scheduling.
                </p>

                {formError && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-rose-950/70 border border-rose-500/40 text-xs font-mono text-rose-200"
                  >
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label
                      htmlFor={nameInputId}
                      className="block text-[11px] font-mono text-slate-300 mb-1"
                    >
                      FULL NAME *
                    </label>
                    <input
                      id={nameInputId}
                      required
                      type="text"
                      maxLength={80}
                      autoComplete="name"
                      placeholder="Dr. Marcus Vance"
                      value={pilotForm.name}
                      onChange={(e) => {
                        setFormError(null);
                        setPilotForm((prev) => ({ ...prev, name: e.target.value }));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={emailInputId}
                      className="block text-[11px] font-mono text-slate-300 mb-1"
                    >
                      WORK EMAIL *
                    </label>
                    <input
                      id={emailInputId}
                      required
                      type="email"
                      maxLength={120}
                      autoComplete="email"
                      placeholder="mvance@enterprise-fab.com"
                      value={pilotForm.email}
                      onChange={(e) => {
                        setFormError(null);
                        setPilotForm((prev) => ({ ...prev, email: e.target.value }));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor={companyInputId}
                      className="block text-[11px] font-mono text-slate-300 mb-1"
                    >
                      ORGANIZATION / FACILITY *
                    </label>
                    <input
                      id={companyInputId}
                      required
                      type="text"
                      maxLength={100}
                      autoComplete="organization"
                      placeholder="Apex Semiconductor GmbH"
                      value={pilotForm.company}
                      onChange={(e) => {
                        setFormError(null);
                        setPilotForm((prev) => ({ ...prev, company: e.target.value }));
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={platformSelectId}
                      className="block text-[11px] font-mono text-slate-300 mb-1"
                    >
                      PRIMARY PLATFORM INTEREST
                    </label>
                    <select
                      id={platformSelectId}
                      value={pilotForm.platform}
                      onChange={(e) =>
                        setPilotForm((prev) => ({ ...prev, platform: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Ohm-X1 Humanoid">Ohm-X1 Humanoid (Bipedal)</option>
                      <option value="Vortex-AMR 400">Vortex-AMR 400 (Heavy AMR)</option>
                      <option value="Kinetix-7 Axis Arm">Kinetix-7 Axis Arm (Manipulator)</option>
                      <option value="Strider-Q8 Quadruped">Strider-Q8 Quadruped (Scout)</option>
                      <option value="Ohm-QDD Actuator OEM Pack">
                        Ohm-QDD Actuator OEM Modules
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={notesTextareaId}
                    className="block text-[11px] font-mono text-slate-300 mb-1"
                  >
                    MISSION PAYLOAD, CYCLE TIME OR ROS 2 / VDA 5050 REQUIREMENTS
                  </label>
                  <textarea
                    id={notesTextareaId}
                    rows={3}
                    maxLength={600}
                    placeholder="e.g., ISO Class 4 cleanroom wafer cassette transfer, 14 kg payload, 24/7 3-shift operation..."
                    value={pilotForm.notes}
                    onChange={(e) =>
                      setPilotForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                  Request Pilot Evaluation & URDF Package
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Whitepaper Reader Modal */}
      {selectedWhitepaper && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="whitepaper-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseWhitepaper();
          }}
        >
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#0A0F1D] p-5 sm:p-8 shadow-2xl space-y-4 sm:space-y-5 max-h-[92dvh] overflow-y-auto">
            <button
              type="button"
              onClick={onCloseWhitepaper}
              aria-label="Close technical monograph viewer"
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="text-[11px] sm:text-xs font-mono text-cyan-400 pr-8">
              {selectedWhitepaper.date}
            </div>
            <h3
              id="whitepaper-modal-title"
              className="text-xl sm:text-2xl font-bold text-white leading-snug pr-6 font-display"
            >
              {selectedWhitepaper.title}
            </h3>
            <div className="text-xs font-mono text-slate-400">{selectedWhitepaper.authors}</div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                EXECUTIVE ABSTRACT
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedWhitepaper.abstract}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                EMPIRICAL LAB FINDINGS
              </div>
              <ul className="space-y-2">
                {selectedWhitepaper.keyFindings.map((finding) => (
                  <li
                    key={finding}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300"
                  >
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono text-emerald-400">
                VERIFIED DELTA: {selectedWhitepaper.benchmarkDelta}
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => onRequestWhitepaperPdf(selectedWhitepaper)}
                  className="px-4 py-2.5 sm:py-2 rounded-xl bg-cyan-400 text-slate-950 text-xs font-semibold uppercase tracking-wider cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                  Request Full PDF & CAD Data
                </button>
                <button
                  type="button"
                  onClick={onCloseWhitepaper}
                  className="px-4 py-2.5 sm:py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. High-Res Field Optics Lightbox */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseLightbox();
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[92dvh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
            <button
              type="button"
              onClick={onCloseLightbox}
              aria-label="Close field optics lightbox"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-lg bg-slate-950/85 border border-slate-700 text-slate-300 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <ResilientImage
              src={lightboxPhoto.image}
              alt={lightboxPhoto.title}
              fallbackLabel={lightboxPhoto.telemetryTag}
              className="w-full max-h-[50vh] sm:max-h-[60vh] object-cover"
            />
            <div className="p-4 sm:p-6 bg-[#090D18] border-t border-slate-800 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-cyan-400">
                  {lightboxPhoto.location} // {lightboxPhoto.environment}
                </span>
                <span className="text-emerald-400">
                  {lightboxPhoto.telemetryTag} • {lightboxPhoto.metricBadge}
                </span>
              </div>
              <h3
                id="lightbox-modal-title"
                className="text-xl sm:text-2xl font-bold text-white font-display"
              >
                {lightboxPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {lightboxPhoto.caption}
              </p>
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-mono text-amber-300">
                  ACTIVE HARDWARE: {lightboxPhoto.robotUnit}
                </span>
                <button
                  type="button"
                  onClick={() => onInquireLightboxDeployment(lightboxPhoto)}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg bg-cyan-400 text-slate-950 text-xs font-semibold uppercase cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                  Inquire About Similar Deployment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
