import React, { useEffect } from 'react';
import { ROBOT_PLATFORMS } from '../data/roboticsData';
import { FieldGalleryItem, WebsitePageId, Whitepaper } from '../types/robotics';

interface SeoGeoManagerProps {
  activePage: WebsitePageId;
  selectedRobotId: string;
  selectedWhitepaper: Whitepaper | null;
  lightboxPhoto: FieldGalleryItem | null;
}

const DEFAULT_TITLE = 'AlgorOhm Robotics — Neural Compute × Physical Actuation';
const DEFAULT_DESCRIPTION =
  'Embodied Physical AI systems fusing deterministic edge neural compute with sub-milliohm Silicon-Carbide QDD actuators for industrial humanoids, AMRs, and precision manipulators.';

const PAGE_SEO_META: Record<WebsitePageId, { title: string; description: string }> = {
  home: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  platforms: {
    title:
      'Autonomous Robotic Platforms & Deep Spec Inspector — Ohm-X1, Vortex-AMR, Kinetix-7 | AlgorOhm',
    description:
      'Compare AlgorOhm production-grade autonomous platforms (Ohm-X1 Humanoid, Vortex-AMR 400, Kinetix-7 Axis Arm, Strider-Q8) and run live payload × runtime simulations.',
  },
  architecture: {
    title: 'Algor™ Neural OS × Ohm™ Hardware Core Architecture | AlgorOhm Robotics',
    description:
      'Vertically integrated robotics architecture pairing 4.0 kHz AlgorOS visuomotor policies with 0.078 mΩ Silicon-Carbide QDD Halbach stators.',
  },
  deployments: {
    title: 'Field Deployments & Enterprise Fleet ROI Simulator | AlgorOhm Robotics',
    description:
      'Real-world industrial deployments across ISO Class 3 semiconductor cleanrooms and EV welding lines, paired with an interactive CAPEX payback & OPEX ROI configurator.',
  },
  research: {
    title: 'Peer-Reviewed Technical Monographs & Whitepapers | AlgorOhm Research',
    description:
      'Technical monographs on 100Hz VLA to 4kHz WB-MPC impedance control, sub-milliohm QDD stators, and decentralized VDA 5050 fleet consensus.',
  },
};

export const SeoGeoManager: React.FC<SeoGeoManagerProps> = ({
  activePage,
  selectedRobotId,
  selectedWhitepaper,
  lightboxPhoto,
}) => {
  useEffect(() => {
    const activeRobot =
      ROBOT_PLATFORMS.find((r) => r.id === selectedRobotId) || ROBOT_PLATFORMS[0];

    let nextTitle = PAGE_SEO_META[activePage]?.title || DEFAULT_TITLE;
    let nextDescription = PAGE_SEO_META[activePage]?.description || DEFAULT_DESCRIPTION;

    if (selectedWhitepaper) {
      nextTitle = `${selectedWhitepaper.title} | AlgorOhm Research`;
      nextDescription = selectedWhitepaper.abstract;
    } else if (lightboxPhoto) {
      nextTitle = `${lightboxPhoto.title} (${lightboxPhoto.location}) | AlgorOhm Robotics`;
      nextDescription = lightboxPhoto.caption;
    } else if (activePage === 'platforms' && activeRobot) {
      nextTitle = `${activeRobot.name} & Fleet Spec Inspector (${activeRobot.specs.peakTorque}) | AlgorOhm Robotics`;
      nextDescription = `${activeRobot.name}: ${activeRobot.description} Peak Torque: ${activeRobot.specs.peakTorque}, Compute: ${activeRobot.specs.computePower}, Repeatability: ${activeRobot.specs.repeatability}.`;
    }

    document.title = nextTitle;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', nextDescription);
    }

    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', nextTitle);
    }

    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) {
      ogDescMeta.setAttribute('content', nextDescription);
    }

    const scriptId = 'algorohm-dynamic-entity-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const activeEntitySchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `https://algorohm.robotics/#active-inspector-${activeRobot.id}`,
      name: activeRobot.name,
      category: activeRobot.category,
      description: activeRobot.description,
      image: activeRobot.image,
      brand: {
        '@type': 'Brand',
        name: 'AlgorOhm Robotics',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Degrees of Freedom', value: activeRobot.specs.dof },
        { '@type': 'PropertyValue', name: 'Peak Torque', value: activeRobot.specs.peakTorque },
        { '@type': 'PropertyValue', name: 'AI Compute', value: activeRobot.specs.computePower },
        { '@type': 'PropertyValue', name: 'Rated Payload', value: activeRobot.specs.payload },
        {
          '@type': 'PropertyValue',
          name: 'Pose Repeatability',
          value: activeRobot.specs.repeatability,
        },
        {
          '@type': 'PropertyValue',
          name: 'Comms Protocol',
          value: activeRobot.specs.commsProtocol,
        },
      ],
    };

    scriptEl.textContent = JSON.stringify(activeEntitySchema);
  }, [activePage, selectedRobotId, selectedWhitepaper, lightboxPhoto]);

  return null;
};
