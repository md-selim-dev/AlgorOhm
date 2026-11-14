import {
  ArchitectureStackMap,
  FieldGalleryItem,
  PlatformCategory,
  RobotPlatform,
  RoiIndustryId,
  RoiIndustryPreset,
  Whitepaper,
} from '../types/robotics';

export const PLATFORM_CATEGORIES: PlatformCategory[] = [
  'All',
  'Bipedal & Humanoid',
  'Autonomous Mobile Robots (AMR)',
  'Precision Manipulators',
  'All-Terrain Quadrupeds',
];

export const ROBOT_PLATFORMS: RobotPlatform[] = [
  {
    id: 'ohm-x1',
    name: 'Ohm-X1 Humanoid',
    codename: 'GEN-4 BIPEDAL GENERALIST',
    category: 'Bipedal & Humanoid',
    tagline: 'Whole-body dynamic balance meets tactile dexterous manipulation.',
    availability: 'Production Ready',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85',
    secondaryImage:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    description:
      'Engineered for unstructured industrial floors and high-mix logistics, Ohm-X1 pairs our 275 TOPS Algor-Core neural compute module with custom liquid-cooled Quasi-Direct Drive (QDD) Ohm actuators for human-safe force compliance.',
    algorRole:
      'Zero-shot visuomotor policy execution, 360° semantic occupancy mapping, and 1kHz whole-body MPC.',
    ohmRole:
      'Hollow-shaft harmonic & QDD proprioceptive actuators with 0.08 mΩ phase resistance and regenerative braking.',
    specs: {
      dof: '42 Degrees of Freedom',
      peakTorque: '380 Nm (Hip / Knee QDD)',
      computePower: '550 TOPS Dual Algor-NPU',
      payload: '35 kg Continuous Bi-Manual',
      maxPayloadKg: 35,
      baseRuntimeHours: 6.8,
      basePowerWatts: 420,
      batteryRuntime: '6.5 hrs Hot-Swappable SiC Pack',
      repeatability: '±0.08 mm Visual-Tactile',
      operatingTemp: '-15°C to +52°C',
      weight: '64 kg (Carbon-Ti Monocoque)',
      protectionRating: 'IP66 Sealed Joints',
      commsProtocol: 'EtherCAT 10G + Wi-Fi 7 TSN',
    },
    highlights: [
      '12-DOF tendon-driven anthropomorphic hands with 1,024-taxel capacitive fingertip arrays',
      'Sub-millisecond backdrivable impedance control for safe human-robot collaboration',
      'Autonomous battery hot-swap dock transition in under 22 seconds',
    ],
    actuatorBreakdown: [
      {
        joint: 'Hip Pitch / Roll',
        actuator: 'Ohm-QDD-140 High-Flux',
        torque: '380 Nm',
        speed: '18 rad/s',
      },
      {
        joint: 'Knee Flexion',
        actuator: 'Ohm-QDD-140 Liquid',
        torque: '360 Nm',
        speed: '21 rad/s',
      },
      {
        joint: 'Shoulder / Elbow',
        actuator: 'Ohm-QDD-90 Hollow',
        torque: '145 Nm',
        speed: '28 rad/s',
      },
      {
        joint: 'Dexterous Wrist / Hand',
        actuator: 'Ohm-Micro-24 Coreless',
        torque: '18 Nm',
        speed: '45 rad/s',
      },
    ],
    cvBoundingBox: 'OBJ_CLASS: HUMANOID_BIPED_X1',
    cvConfidence: '99.8%',
    cvKeypoints: [
      { x: 52, y: 24, label: 'OPTIC_HEAD_STEREO' },
      { x: 45, y: 48, label: 'TORSO_NPU_BUS' },
      { x: 64, y: 58, label: 'MANIP_WRIST_R' },
    ],
  },
  {
    id: 'vortex-amr-400',
    name: 'Vortex-AMR 400',
    codename: 'OMNI-VECTOR HEAVY TRANSPORTER',
    category: 'Autonomous Mobile Robots (AMR)',
    tagline: 'Swarm-ready autonomous logistics with active suspension and zero-slip traction.',
    availability: 'Production Ready',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85',
    secondaryImage:
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=900&q=80',
    description:
      'Built for 24/7 lights-out gigafactories and cleanroom semiconductor fabs, Vortex-AMR 400 navigates dynamic obstacles without magnetic tape or QR fiducials using multi-modal 4D LiDAR + thermal SLAM.',
    algorRole:
      'Decentralized multi-agent fleet consensus, dynamic deadlock avoidance, and predictive trajectory planning.',
    ohmRole:
      'In-wheel axial-flux direct-drive traction pods with 96.4% inverter efficiency and ultra-low ripple.',
    specs: {
      dof: '4 Independent Steer-Drive Pods',
      peakTorque: '620 Nm Total Wheel Traction',
      computePower: '275 TOPS Algor-Edge SOM',
      payload: '1,500 kg Dynamic Deck Load',
      maxPayloadKg: 1500,
      baseRuntimeHours: 14.5,
      basePowerWatts: 580,
      batteryRuntime: '14 hrs + 8-min UltraCap Charge',
      repeatability: '±0.5 mm Laser Docking',
      operatingTemp: '-20°C to +55°C',
      weight: '210 kg Low-CG Chassis',
      protectionRating: 'IP67 / ISO Class 4 Cleanroom',
      commsProtocol: '5G Private URLLC + VDA 5050',
    },
    highlights: [
      'Omnidirectional crabbing, zero-radius pivot, and active hydraulic-electromagnetic load leveling',
      'Native VDA 5050 & ROS 2 Humble/Jazzy fleet orchestration out of the box',
      'Dual redundant 360° safety LiDAR curtains certified to ISO 3691-4 PLd',
    ],
    actuatorBreakdown: [
      {
        joint: 'Traction Drive (x4)',
        actuator: 'Ohm-Axial-180 In-Wheel',
        torque: '155 Nm/wheel',
        speed: '3.2 m/s',
      },
      {
        joint: 'Azimuth Steer (x4)',
        actuator: 'Ohm-Servo-75 Zero-Backlash',
        torque: '85 Nm',
        speed: '12 rad/s',
      },
      {
        joint: 'Active Lift Deck',
        actuator: 'Ohm-Linear-BallScrew',
        torque: '22 kN Lift',
        speed: '120 mm/s',
      },
    ],
    cvBoundingBox: 'OBJ_CLASS: AMR_OMNI_VORTEX',
    cvConfidence: '99.4%',
    cvKeypoints: [
      { x: 35, y: 40, label: 'LIDAR_DOME_360' },
      { x: 58, y: 65, label: 'AXIAL_DRIVE_POD' },
      { x: 70, y: 30, label: 'PAYLOAD_DECK_SENSOR' },
    ],
  },
  {
    id: 'kinetix-7-arm',
    name: 'Kinetix-7 Axis Arm',
    codename: 'SUB-MICRON COBOT MANIPULATOR',
    category: 'Precision Manipulators',
    tagline: '7-DOF redundant kinematics with integrated joint-torque sensing at 4 kHz.',
    availability: 'Production Ready',
    image:
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=85',
    secondaryImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    description:
      'Kinetix-7 bridges the gap between rigid industrial robot arms and delicate surgical-grade manipulators. Every joint embeds dual optical encoders and strain-wave torque rings controlled by our deterministic AlgorRT kernel.',
    algorRole:
      'Real-time singularity-free inverse kinematics, adaptive vibration suppression, and contact-rich assembly.',
    ohmRole:
      'Slotless frameless torque motors with silicon-carbide (SiC) FET drives and <0.01% torque cogging.',
    specs: {
      dof: '7 Revolute + 1 Tool Bus',
      peakTorque: '240 Nm Base / 38 Nm Wrist',
      computePower: '140 TOPS Integrated Controller',
      payload: '18 kg @ Full 1,350 mm Reach',
      maxPayloadKg: 18,
      baseRuntimeHours: 24.0,
      basePowerWatts: 310,
      batteryRuntime: '48V DC Bus / AC Regenerative',
      repeatability: '±0.015 mm ISO 9283',
      operatingTemp: '0°C to +50°C',
      weight: '26.5 kg Forged Magnesium',
      protectionRating: 'IP65 Washdown Ready',
      commsProtocol: 'EtherCAT 4kHz + Profinet IRT',
    },
    highlights: [
      '0.05 N force sensitivity across all 7 axes—capable of threading M2 fasteners blind',
      'Internal hollow-bore routing for GigE Vision cameras, pneumatic lines, and 10A tool power',
      'Drag-to-teach zero-gravity mode with automatic dynamic payload mass calibration',
    ],
    actuatorBreakdown: [
      {
        joint: 'J1 / J2 Base Shoulder',
        actuator: 'Ohm-Harmonic-110 SiC',
        torque: '240 Nm',
        speed: '3.8 rad/s',
      },
      {
        joint: 'J3 / J4 Elbow',
        actuator: 'Ohm-Harmonic-85 SiC',
        torque: '130 Nm',
        speed: '5.2 rad/s',
      },
      {
        joint: 'J5 / J6 / J7 Spherical Wrist',
        actuator: 'Ohm-Frameless-52',
        torque: '38 Nm',
        speed: '9.4 rad/s',
      },
    ],
    cvBoundingBox: 'OBJ_CLASS: MANIPULATOR_7DOF',
    cvConfidence: '99.9%',
    cvKeypoints: [
      { x: 28, y: 68, label: 'BASE_TORQUE_CELL' },
      { x: 52, y: 42, label: 'ELBOW_HARMONIC_J4' },
      { x: 76, y: 28, label: 'FLANGE_ISO_9409' },
    ],
  },
  {
    id: 'strider-q8',
    name: 'Strider-Q8 Quadruped',
    codename: 'ALL-TERRAIN AUTONOMOUS SCOUT',
    category: 'All-Terrain Quadrupeds',
    tagline: 'Extreme terrain mobility for offshore energy, mining, and defense inspection.',
    availability: 'Enterprise Pilot',
    image:
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=85',
    secondaryImage:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    description:
      'Designed to traverse 45° industrial stairwells, rubble, and wet steel grating, Strider-Q8 runs reinforcement-learned locomotion policies directly on raw proprioceptive motor currents—surviving blind slips in complete darkness.',
    algorRole:
      'Proprioceptive blind-locomotion RL policy, acoustic anomaly detection, and thermal leak localization.',
    ohmRole:
      'Impact-tolerant cycloidal QDD leg actuators sustaining 65G shock loads without gearbox tooth shear.',
    specs: {
      dof: '12 Leg Actuators + 6-DOF Arm Mount',
      peakTorque: '310 Nm Peak Knee Burst',
      computePower: '400 TOPS Ruggedized Algor-Box',
      payload: '45 kg Inspection / Manipulation Pack',
      maxPayloadKg: 45,
      baseRuntimeHours: 4.8,
      basePowerWatts: 490,
      batteryRuntime: '4.5 hrs Continuous Stair Climb',
      repeatability: '±2.0 mm Foot Placement',
      operatingTemp: '-30°C to +60°C',
      weight: '52 kg Sealed Titanium Frame',
      protectionRating: 'IP68 Submersible (1.5m)',
      commsProtocol: 'Mesh COFDM Radio + Satcom Ready',
    },
    highlights: [
      'Self-righting from any inverted posture on loose gravel or 40° inclines',
      'Integrated pan-tilt radiometric thermal, optical gas imaging (OGI), and acoustic array',
      'Zero-maintenance sealed cycloidal drive train rated for 18,000 operational hours',
    ],
    actuatorBreakdown: [
      {
        joint: 'Hip Abduction (x4)',
        actuator: 'Ohm-Cycloid-105',
        torque: '210 Nm',
        speed: '24 rad/s',
      },
      {
        joint: 'Hip Flexion (x4)',
        actuator: 'Ohm-Cycloid-105',
        torque: '210 Nm',
        speed: '24 rad/s',
      },
      {
        joint: 'Knee Pitch (x4)',
        actuator: 'Ohm-Cycloid-125 Boost',
        torque: '310 Nm',
        speed: '19 rad/s',
      },
    ],
    cvBoundingBox: 'OBJ_CLASS: QUADRUPED_STRIDER_Q8',
    cvConfidence: '99.2%',
    cvKeypoints: [
      { x: 40, y: 36, label: 'THERMAL_OGI_PAYLOAD' },
      { x: 55, y: 55, label: 'CYCLOID_HIP_JOINT' },
      { x: 68, y: 78, label: 'FORCE_FOOT_PAD' },
    ],
  },
];

export const FIELD_GALLERY: FieldGalleryItem[] = [
  {
    id: 'fg-1',
    title: 'Sub-Millimeter Wafer Pod Handling',
    location: 'Dresden Semiconductor Fab #4',
    environment: 'ISO Class 3 Cleanroom',
    robotUnit: 'Kinetix-7 + Vortex-AMR 400',
    telemetryTag: 'VIBRATION_FLOOR < 0.04G',
    metricBadge: '99.994% Pick Yield',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
    caption:
      'Coupled mobile manipulation transferring 300mm FOUP wafer carriers with real-time active vibration damping across raised perforated cleanroom floors.',
  },
  {
    id: 'fg-2',
    title: 'High-Flux QDD Stator Thermal Torture Bench',
    location: 'AlgorOhm Zurich Electromechanical Lab',
    environment: '2,400W Continuous Thermal Load',
    robotUnit: 'Ohm-QDD-140 Series',
    telemetryTag: 'PHASE_R: 0.078 mΩ @ 110°C',
    metricBadge: '+41% Torque Density',
    image:
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=85',
    caption:
      'Closed-loop dynamometer characterization verifying zero demagnetization under 380 Nm peak burst loads with silicon-carbide (SiC) 100kHz PWM switching.',
  },
  {
    id: 'fg-3',
    title: 'Multi-Agent Lights-Out Body-in-White Cell',
    location: 'Stuttgart EV Chassis Plant',
    environment: 'High-EMI Spot Welding Line',
    robotUnit: '6x Kinetix-7 + 14x Vortex-AMR',
    telemetryTag: 'TSN_SYNC_JITTER: 140 ns',
    metricBadge: '-34% Cycle Time',
    image:
      'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1200&q=85',
    caption:
      'Deterministic Time-Sensitive Networking (TSN) coordinates 20 autonomous units in a shared workspace without physical safety caging.',
  },
  {
    id: 'fg-4',
    title: 'Visuomotor Policy Sim-to-Real Transfer',
    location: 'AlgorOhm Boston Embodied AI Center',
    environment: '4,096 Parallel Isaac/Mujoco Envs',
    robotUnit: 'Ohm-X1 Bipedal Fleet',
    telemetryTag: 'POLICY_LATENCY: 0.82 ms',
    metricBadge: 'Zero-Shot Generalization',
    image:
      'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=1200&q=85',
    caption:
      'Domain-randomized reinforcement learning policies compiled directly to FP8 tensor cores on the onboard Algor-NPU without cloud tether.',
  },
];

export const ARCHITECTURE_STACK: ArchitectureStackMap = {
  algor: {
    title: 'Algor™ Neural Stack',
    subtitle: 'DETERMINISTIC EMBODIED INTELLIGENCE',
    badge: 'SOFTWARE & SILICON COMPILER',
    accent: 'cyan',
    heroImage:
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1000&q=80',
    heroCaption:
      'Real-time voxel occupancy & contact-force trajectory graph executing on dual Algor-NPU silicon.',
    description:
      'Traditional robotics stacks fracture between high-level Python AI models and low-level C++ PLC loops. AlgorOS unifies vision-language-action (VLA) foundation models and 4 kHz whole-body model predictive control into a single zero-copy memory graph.',
    metrics: [
      { label: 'Control Loop Frequency', value: '4.0 kHz' },
      { label: 'Worst-Case RTOS Jitter', value: '< 1.2 μs' },
      { label: 'Onboard Transformer Compute', value: '550 TOPS' },
      { label: 'Sim-to-Real Fidelity Correlation', value: '99.1%' },
    ],
    modules: [
      {
        code: 'ALG-01',
        name: 'AlgorVLA™ Foundation Policy Engine',
        latencyOrSpec: '8.4 ms End-to-End',
        summary:
          'Multimodal transformer ingesting stereo RGB-D, 4D LiDAR point clouds, and 1,024-taxel tactile streams to output continuous joint-space impedance targets.',
        techTags: ['FP8 TensorRT-RTOS', 'Zero-Shot Manipulation', '3D Gaussian Splat SLAM'],
      },
      {
        code: 'ALG-02',
        name: 'Whole-Body Model Predictive Control (WB-MPC)',
        latencyOrSpec: '1.0 kHz Solver',
        summary:
          'Receding-horizon quadratic programming solver resolving centroidal momentum, friction-cone constraints, and self-collision avoidance across 42 DOFs.',
        techTags: ['Riccati Differential Solver', 'Centroidal Dynamics', 'Compliant Contact'],
      },
      {
        code: 'ALG-03',
        name: 'SwarmMesh™ Decentralized Consensus',
        latencyOrSpec: '< 3 ms Fleet Sync',
        summary:
          'Peer-to-peer spatial task allocation and conflict-based search (CBS) routing for up to 250 heterogeneous robots without a single point of server failure.',
        techTags: ['VDA 5050 Native', 'DDS / ROS 2 Iron', 'Time-Sensitive Networking'],
      },
      {
        code: 'ALG-04',
        name: 'DigitalTwinForge™ Physics Compiler',
        latencyOrSpec: '10,000x Real-Time',
        summary:
          'Differentiable multiphysics simulator modeling actuator winding temperature, harmonic gear hysteresis, and floor friction for overnight policy fine-tuning.',
        techTags: ['Differentiable Kinematics', 'Automated System ID', 'OTA Policy Rollback'],
      },
    ],
  },
  ohm: {
    title: 'Ohm™ Hardware Core',
    subtitle: 'ULTRA-LOW IMPEDANCE PHYSICAL ACTUATION',
    badge: 'ELECTROMECHANICAL & POWER ELECTRONICS',
    accent: 'amber',
    heroImage:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    heroCaption:
      'Custom Silicon-Carbide (SiC) 100kHz field-oriented control inverter integrated directly into the actuator stator housing.',
    description:
      'Software intelligence is useless if trapped behind high-friction gearboxes and laggy motor drivers. Our Ohm™ hardware division engineers every copper winding, silicon-carbide FET inverter, and titanium cycloidal gear from first principles.',
    metrics: [
      { label: 'Stator Phase Resistance', value: '0.078 mΩ' },
      { label: 'Inverter Peak Efficiency', value: '98.4%' },
      { label: 'Actuator Torque Density', value: '142 Nm/kg' },
      { label: 'Torque Sensing Bandwidth', value: '4.0 kHz' },
    ],
    modules: [
      {
        code: 'OHM-01',
        name: 'Quasi-Direct Drive (QDD) Halbach Stators',
        latencyOrSpec: '142 Nm/kg Density',
        summary:
          'Segmented compressed-coil copper windings with N54SH curved Halbach magnet arrays maximize air-gap magnetic flux while slashing Joule heating ($I^2R$ losses).',
        techTags: ['0.08 mΩ Winding', 'Liquid Stator Jacket', 'Zero-Cogging Geometry'],
      },
      {
        code: 'OHM-02',
        name: '100 kHz Silicon-Carbide (SiC) FOC Drives',
        latencyOrSpec: '98.4% Efficiency',
        summary:
          'Integrated 48V–96V SiC MOSFET field-oriented controllers executing current-loop PID at 100 kHz for transparent backdrivability and virtual spring-damper behavior.',
        techTags: ['SiC Power Stage', 'Regenerative Braking', 'BiSS-C 24-Bit Dual Encoder'],
      },
      {
        code: 'OHM-03',
        name: 'Proprioceptive Strain-Wave & Cycloidal Gearing',
        latencyOrSpec: '< 0.5 arcmin Backlash',
        summary:
          'Custom titanium-nitride coated gearing with monolithic optical torque transducers built directly into the flexspline for true joint-level force control.',
        techTags: ['65G Shock Rated', '18,000 Hr L10 Life', 'Integrated Torque Cell'],
      },
      {
        code: 'OHM-04',
        name: 'Solid-State SiC Energy & Hot-Swap Architecture',
        latencyOrSpec: '6C Burst Discharge',
        summary:
          'High-silicon-anode cell modules with active cell-to-pack thermal management and arc-free blind-mate docking connectors for continuous 24/7 fleet uptime.',
        techTags: ['UL 2580 Certified', '22s Autonomous Swap', 'Bidirectional DC Bus'],
      },
    ],
  },
};

export const WHITEPAPERS: Whitepaper[] = [
  {
    id: 'wp-1',
    date: 'MARCH 2026 • TECHNICAL MONOGRAPH TR-2026-04',
    category: 'Embodied VLA & Control',
    title:
      'Bridging 100Hz Vision-Language-Action Transformers with 4kHz Whole-Body Impedance Control',
    authors: 'Dr. Elena Rostova, K. Takahashi, M. Vance — AlgorOhm Zurich & Boston Labs',
    readTime: '14 min read',
    abstract:
      'We present a hierarchical latent-space action representation that allows foundation visuomotor transformers to output time-varying Cartesian stiffness ellipsoids rather than brittle position waypoints, achieving 99.4% insertion success on sub-millimeter industrial connectors under ±8 mm fixture perturbation.',
    keyFindings: [
      'Reduces contact impact force spikes by 78% compared to standard diffusion policy baselines.',
      'Executes in 6.2 ms on a single onboard Algor-NPU using int4/fp8 mixed-precision quantization.',
      'Validated across 14,000 continuous hours of blind electrical harness assembly on Ohm-X1 and Kinetix-7.',
    ],
    benchmarkDelta: '-78% Peak Contact Impulse',
  },
  {
    id: 'wp-2',
    date: 'JANUARY 2026 • HARDWARE ARCHITECTURE PAPER TR-2026-02',
    category: 'Power Electronics & Actuation',
    title:
      'Sub-Milliohm Stator Design: Eliminating Thermal Throttling in High-Torque Bipedal Locomotion',
    authors: 'H. Lindqvist, S. Chen, R. Al-Mansoor — AlgorOhm Electromechanical Division',
    readTime: '11 min read',
    abstract:
      'High-degree-of-freedom humanoids suffer from severe Joule heating ($P = I^2R$) during quasi-static crouching and heavy payload carrying. By combining Litz-wire rectangular compressed windings with 100 kHz Silicon-Carbide (SiC) inverters, we cut stator phase resistance by 62%.',
    keyFindings: [
      'Sustains 240 Nm continuous knee torque at 38°C ambient without external chiller hoses.',
      'Recovers 31.4% of descending stair potential energy via bidirectional regenerative bus.',
      'Zero measurable neodymium magnet flux degradation after 2.5 million load cycles.',
    ],
    benchmarkDelta: '+41% Continuous Torque/kg',
  },
  {
    id: 'wp-3',
    date: 'NOVEMBER 2025 • SYSTEMS PAPER TR-2025-11',
    category: 'Swarm & Fleet Orchestration',
    title:
      'Zero-Deadlock Decentralized Conflict-Based Search for 200+ Heterogeneous AMRs over Wi-Fi 7 TSN',
    authors: 'A. Patel, L. Meyer — AlgorOhm Autonomous Mobility Group',
    readTime: '9 min read',
    abstract:
      'Centralized fleet managers become a single point of failure in dense gigafactory aisles. We introduce SwarmMesh, a distributed consensus protocol that guarantees collision-free trajectories even under 40% packet loss.',
    keyFindings: [
      'Maintains 99.998% fleet availability across 180 Vortex-AMR 400 units in a 450,000 sq ft facility.',
      'Seamless VDA 5050 interoperability with legacy AGVs and human-driven forklifts.',
      'Re-routes around blocked aisles in <18 milliseconds using shared 4D occupancy grids.',
    ],
    benchmarkDelta: '+29% Fleet Throughput',
  },
];

export const ROI_INDUSTRY_PRESETS: Record<RoiIndustryId, RoiIndustryPreset> = {
  semiconductor: {
    label: 'Semiconductor & Cleanroom Fab',
    recommendedRobot: 'Kinetix-7 + Vortex-AMR 400',
    laborHourlyUsd: 64,
    scrapReductionFactor: 1.45,
    unitCapexUsd: 68000,
    throughputBoostPct: 38,
  },
  aerospace: {
    label: 'Aerospace & EV Chassis Assembly',
    recommendedRobot: 'Ohm-X1 Humanoid + Kinetix-7',
    laborHourlyUsd: 58,
    scrapReductionFactor: 1.32,
    unitCapexUsd: 82000,
    throughputBoostPct: 34,
  },
  logistics: {
    label: 'High-Mix 3PL & E-Commerce Fulfillment',
    recommendedRobot: 'Ohm-X1 + Vortex-AMR 400 Swarm',
    laborHourlyUsd: 42,
    scrapReductionFactor: 1.15,
    unitCapexUsd: 54000,
    throughputBoostPct: 44,
  },
  energy: {
    label: 'Offshore Energy & Grid Inspection',
    recommendedRobot: 'Strider-Q8 Quadruped Fleet',
    laborHourlyUsd: 78,
    scrapReductionFactor: 1.6,
    unitCapexUsd: 74000,
    throughputBoostPct: 52,
  },
};
