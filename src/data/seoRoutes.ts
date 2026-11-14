import { WebsitePageId } from '../types/robotics';

export interface RouteSeoMetadata {
  id: WebsitePageId;
  path: string;
  breadcrumbName: string;
  title: string;
  description: string;
  noscriptHeading: string;
  noscriptSummary: string;
}

export const SEO_ROUTES: Record<WebsitePageId, RouteSeoMetadata> = {
  home: {
    id: 'home',
    path: '/',
    breadcrumbName: 'Home',
    title: 'AlgorOhm Robotics — Neural Compute × Physical Actuation',
    description:
      'Embodied Physical AI systems fusing 4.0 kHz edge neural compute with 0.078 mΩ SiC QDD actuators for industrial humanoids, AMRs, and cobots.',
    noscriptHeading:
      'AlgorOhm Robotics — Where Algorithmic Intelligence Meets Physical Resistance',
    noscriptSummary:
      'AlgorOhm Robotics Inc. engineers vertically integrated embodied AI systems fusing deterministic 4.0 kHz visuomotor policies (AlgorOS 4.2) with sub-milliohm Silicon-Carbide QDD actuators.',
  },
  platforms: {
    id: 'platforms',
    path: '/platforms',
    breadcrumbName: 'Platforms & Spec Inspector',
    title: 'Autonomous Robot Platforms & Spec Inspector | AlgorOhm',
    description:
      'Compare Ohm-X1 Humanoid, Vortex-AMR 400, Kinetix-7 Arm, and Strider-Q8 Quadruped specs and run live payload and thermal runtime simulations.',
    noscriptHeading: 'Production-Grade Autonomous Robotic Platforms & Spec Inspector',
    noscriptSummary:
      'Explore Ohm-X1 Humanoid (42 DOF, 380 Nm), Vortex-AMR 400 (1,500 kg payload), Kinetix-7 Axis Arm (±0.015 mm repeatability), and Strider-Q8 Quadruped (IP68).',
  },
  architecture: {
    id: 'architecture',
    path: '/architecture',
    breadcrumbName: 'Algor × Ohm Architecture',
    title: 'Algor™ Neural OS × Ohm™ Actuation Stack | AlgorOhm Robotics',
    description:
      'Explore AlgorOS 4.2 deterministic 4.0 kHz VLA + WB-MPC software paired with 0.078 mΩ Silicon-Carbide QDD Halbach stators and zero-backlash drives.',
    noscriptHeading: 'The Algor™ Neural OS × Ohm™ Electromechanical Stack',
    noscriptSummary:
      'Vertically integrated robotics architecture pairing 550 TOPS FP8 edge compute and 4.0 kHz WB-MPC (< 1.2 μs jitter) with 100 kHz SiC QDD actuators (98.4% peak efficiency).',
  },
  deployments: {
    id: 'deployments',
    path: '/deployments',
    breadcrumbName: 'Deployments & Fleet ROI',
    title: 'Field Deployments & Fleet ROI Simulator | AlgorOhm Robotics',
    description:
      'Inspect cleanroom fab and EV assembly deployments and model multi-shift fleet CAPEX payback, throughput gains, and 5-year OPEX savings.',
    noscriptHeading: 'Field Deployments & Enterprise Fleet Payback Simulator',
    noscriptSummary:
      'Verified industrial deployments across ISO Class 3 semiconductor cleanrooms and EV chassis lines with 99.998% fleet availability and 3.5–11 month payback.',
  },
  research: {
    id: 'research',
    path: '/research',
    breadcrumbName: 'Research Monographs',
    title: 'Technical Monographs & Robotics Whitepapers | AlgorOhm',
    description:
      'Peer-reviewed monographs on 100Hz VLA to 4kHz impedance control, sub-milliohm QDD stators, and zero-deadlock VDA 5050 swarm routing.',
    noscriptHeading: 'AlgorOhm Lab Technical Monographs & Whitepapers',
    noscriptSummary:
      'Publications from AlgorOhm Zurich, Boston, and San Francisco R&D labs on visuomotor transformers, Litz-wire SiC stators, and decentralized Wi-Fi 7 TSN fleets.',
  },
};
