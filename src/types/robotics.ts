export type PlatformCategory =
  | 'All'
  | 'Bipedal & Humanoid'
  | 'Autonomous Mobile Robots (AMR)'
  | 'Precision Manipulators'
  | 'All-Terrain Quadrupeds';

export type AvailabilityStatus = 'Production Ready' | 'Enterprise Pilot';

export interface ActuatorGroup {
  joint: string;
  actuator: string;
  torque: string;
  speed: string;
}

export interface RobotPlatformSpecs {
  dof: string;
  peakTorque: string;
  computePower: string;
  payload: string;
  maxPayloadKg: number;
  baseRuntimeHours: number;
  basePowerWatts: number;
  batteryRuntime: string;
  repeatability: string;
  operatingTemp: string;
  weight: string;
  protectionRating: string;
  commsProtocol: string;
}

export interface CvKeypoint {
  x: number;
  y: number;
  label: string;
}

export interface RobotPlatform {
  id: string;
  name: string;
  codename: string;
  category: Exclude<PlatformCategory, 'All'>;
  tagline: string;
  availability: AvailabilityStatus;
  image: string;
  secondaryImage: string;
  description: string;
  algorRole: string;
  ohmRole: string;
  specs: RobotPlatformSpecs;
  highlights: string[];
  actuatorBreakdown: ActuatorGroup[];
  cvBoundingBox: string;
  cvConfidence: string;
  cvKeypoints: CvKeypoint[];
}

export interface FieldGalleryItem {
  id: string;
  title: string;
  location: string;
  environment: string;
  robotUnit: string;
  telemetryTag: string;
  metricBadge: string;
  image: string;
  caption: string;
}

export type ArchitectureTabId = 'algor' | 'ohm';

export interface ArchitectureMetric {
  label: string;
  value: string;
}

export interface ArchitectureModule {
  code: string;
  name: string;
  latencyOrSpec: string;
  summary: string;
  techTags: string[];
}

export interface ArchitectureLayer {
  title: string;
  subtitle: string;
  badge: string;
  accent: 'cyan' | 'amber';
  heroImage: string;
  heroCaption: string;
  description: string;
  metrics: ArchitectureMetric[];
  modules: ArchitectureModule[];
}

export type ArchitectureStackMap = Record<ArchitectureTabId, ArchitectureLayer>;

export interface Whitepaper {
  id: string;
  date: string;
  category: string;
  title: string;
  authors: string;
  readTime: string;
  abstract: string;
  keyFindings: string[];
  benchmarkDelta: string;
}

export type RoiIndustryId = 'semiconductor' | 'aerospace' | 'logistics' | 'energy';

export interface RoiIndustryPreset {
  label: string;
  recommendedRobot: string;
  laborHourlyUsd: number;
  scrapReductionFactor: number;
  unitCapexUsd: number;
  throughputBoostPct: number;
}

export type SimMode = 'kinematic' | 'lidar' | 'neural';

export interface TelemetryState {
  j1Angle: number;
  j2Angle: number;
  j3Angle: number;
  shoulderTorque: number;
  elbowTorque: number;
  busCurrent: number;
  busImpedance: number;
  loopLatency: number;
}

export interface PilotFormState {
  name: string;
  email: string;
  company: string;
  platform: string;
  environment: string;
  notes: string;
}

export type WebsitePageId =
  | 'home'
  | 'platforms'
  | 'architecture'
  | 'deployments'
  | 'research';


