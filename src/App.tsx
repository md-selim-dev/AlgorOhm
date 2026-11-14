/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ArchitectureSection } from './components/ArchitectureSection';
import { FieldGallerySection } from './components/FieldGallerySection';
import { Footer } from './components/Footer';
import { HeroKinematicBench } from './components/HeroKinematicBench';
import { Modals } from './components/Modals';
import { Navbar } from './components/Navbar';
import { PlatformsSection } from './components/PlatformsSection';
import { ResearchSection } from './components/ResearchSection';
import { RoiConfiguratorSection } from './components/RoiConfiguratorSection';
import { SeoGeoManager } from './components/SeoGeoManager';
import {
  HomeOverviewPortal,
  PageHeroHeader,
  PagePaginationFooter,
} from './components/WebsiteShell';
import {
  FieldGalleryItem,
  PilotFormState,
  RobotPlatform,
  WebsitePageId,
  Whitepaper,
} from './types/robotics';

function resolvePageFromHash(): WebsitePageId {
  if (typeof window === 'undefined') return 'home';
  const rawHash = window.location.hash.replace('#', '').trim().toLowerCase();
  if (rawHash === 'platforms' || rawHash === 'inspector') return 'platforms';
  if (rawHash === 'architecture') return 'architecture';
  if (
    rawHash === 'deployments' ||
    rawHash === 'field-gallery' ||
    rawHash === 'roi-configurator'
  ) {
    return 'deployments';
  }
  if (rawHash === 'research') return 'research';
  return 'home';
}

export default function App() {
  const [activePage, setActivePage] = useState<WebsitePageId>(resolvePageFromHash);
  const [selectedRobotId, setSelectedRobotId] = useState<string>('ohm-x1');

  // Modals & Interactive Drawers
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<Whitepaper | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<FieldGalleryItem | null>(null);

  // Pilot Inquiry Form State
  const [pilotForm, setPilotForm] = useState<PilotFormState>({
    name: '',
    email: '',
    company: '',
    platform: 'Ohm-X1 Humanoid',
    environment: 'High-Mix Manufacturing / Cleanroom',
    notes: '',
  });
  const [pilotSubmitted, setPilotSubmitted] = useState<boolean>(false);

  // Navigate between website pages with optional smooth scroll to an anchor section
  const handleNavigate = useCallback((page: WebsitePageId, sectionId?: string) => {
    setActivePage(page);
    if (typeof window !== 'undefined') {
      const nextHash = sectionId ? `#${sectionId}` : page === 'home' ? '#home' : `#${page}`;
      if (window.location.hash !== nextHash) {
        window.history.pushState({ page, sectionId }, '', nextHash);
      }

      if (sectionId) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const targetEl = document.getElementById(sectionId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 40);
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const onHashOrPopState = () => {
      setActivePage(resolvePageFromHash());
    };
    window.addEventListener('popstate', onHashOrPopState);
    window.addEventListener('hashchange', onHashOrPopState);
    return () => {
      window.removeEventListener('popstate', onHashOrPopState);
      window.removeEventListener('hashchange', onHashOrPopState);
    };
  }, []);

  const handleSelectRobotAndInspect = useCallback(
    (robotId: string) => {
      setSelectedRobotId(robotId);
      handleNavigate('platforms', 'inspector');
    },
    [handleNavigate]
  );

  const handleOpenDemoModal = useCallback(() => {
    setPilotSubmitted(false);
    setDemoModalOpen(true);
  }, []);

  const handleOpenPilotForRobot = useCallback((robot: RobotPlatform) => {
    setPilotForm((prev) => ({
      ...prev,
      platform: robot.name,
      notes: `Requesting technical datasheet, URDF/MuJoCo models, and on-site pilot evaluation for ${robot.name} (${robot.codename}).`,
    }));
    setPilotSubmitted(false);
    setDemoModalOpen(true);
  }, []);

  const handleExportRoiProposal = useCallback(
    (summary: { recommendedRobot: string; environmentLabel: string; notes: string }) => {
      setPilotForm((prev) => ({
        ...prev,
        platform: summary.recommendedRobot,
        environment: summary.environmentLabel,
        notes: summary.notes,
      }));
      setPilotSubmitted(false);
      setDemoModalOpen(true);
    },
    []
  );

  const handleRequestWhitepaperPdf = useCallback((paper: Whitepaper) => {
    setSelectedWhitepaper(null);
    setPilotForm((prev) => ({
      ...prev,
      notes: `Requesting full PDF & benchmark dataset for monograph: "${paper.title}"`,
    }));
    setPilotSubmitted(false);
    setDemoModalOpen(true);
  }, []);

  const handleInquireLightboxDeployment = useCallback((photo: FieldGalleryItem) => {
    setLightboxPhoto(null);
    setPilotForm((prev) => ({
      ...prev,
      platform: photo.robotUnit,
      notes: `Inquiry regarding deployment: ${photo.title} (${photo.location})`,
    }));
    setPilotSubmitted(false);
    setDemoModalOpen(true);
  }, []);

  const handlePilotSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPilotSubmitted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] bg-tech-grid text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans relative overflow-x-hidden">
      {/* Persistent Global Ambient Radial Backlights for Coherent Atmosphere Across All Pages */}
      <div
        className="pointer-events-none fixed -top-48 left-1/4 w-[520px] h-[520px] rounded-full bg-cyan-500/8 blur-[140px] z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-1/3 right-8 w-[440px] h-[440px] rounded-full bg-amber-500/8 blur-[140px] z-0"
        aria-hidden="true"
      />

      {/* Non-Visual Dynamic SEO / AEO / GEO Head & JSON-LD Synchronizer */}
      <SeoGeoManager
        activePage={activePage}
        selectedRobotId={selectedRobotId}
        selectedWhitepaper={selectedWhitepaper}
        lightboxPhoto={lightboxPhoto}
      />

      {/* Accessibility: Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan-400 focus:text-slate-950 focus:font-semibold focus:text-xs"
      >
        Skip to main content
      </a>

      {/* Top Sticky Multi-Page Website Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenDemoModal={handleOpenDemoModal}
      />

      {/* Semantic Main Content Landmark */}
      <main id="main-content" className="flex-1 relative z-10">
        {/* Unified Architectural Page Hero Header on Inner Pages */}
        <PageHeroHeader activePage={activePage} onNavigate={handleNavigate} />

        {activePage === 'home' && (
          <>
            <HeroKinematicBench onNavigate={handleNavigate} />
            <HomeOverviewPortal
              selectedRobotId={selectedRobotId}
              onSelectRobotAndInspect={handleSelectRobotAndInspect}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {activePage === 'platforms' && (
          <PlatformsSection
            selectedRobotId={selectedRobotId}
            onSelectRobot={setSelectedRobotId}
            onOpenPilotForRobot={handleOpenPilotForRobot}
            viewMode="all"
          />
        )}

        {activePage === 'architecture' && <ArchitectureSection />}

        {activePage === 'deployments' && (
          <>
            <FieldGallerySection onOpenLightbox={setLightboxPhoto} />
            <RoiConfiguratorSection onExportProposal={handleExportRoiProposal} />
          </>
        )}

        {activePage === 'research' && (
          <ResearchSection onSelectWhitepaper={setSelectedWhitepaper} />
        )}

        {/* Website Cross-Page Pagination Footer */}
        <PagePaginationFooter activePage={activePage} onNavigate={handleNavigate} />
      </main>

      {/* Semantic Global Website Footer */}
      <Footer onSelectRobot={setSelectedRobotId} onNavigate={handleNavigate} />

      {/* Accessible Modals (Pilot Evaluation, Whitepaper Reader, High-Res Optics Lightbox) */}
      <Modals
        demoModalOpen={demoModalOpen}
        onCloseDemoModal={() => setDemoModalOpen(false)}
        pilotForm={pilotForm}
        setPilotForm={setPilotForm}
        pilotSubmitted={pilotSubmitted}
        onPilotSubmit={handlePilotSubmit}
        selectedWhitepaper={selectedWhitepaper}
        onCloseWhitepaper={() => setSelectedWhitepaper(null)}
        onRequestWhitepaperPdf={handleRequestWhitepaperPdf}
        lightboxPhoto={lightboxPhoto}
        onCloseLightbox={() => setLightboxPhoto(null)}
        onInquireLightboxDeployment={handleInquireLightboxDeployment}
      />
    </div>
  );
}
