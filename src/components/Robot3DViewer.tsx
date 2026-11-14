import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  Box,
  ChevronDown,
  ChevronUp,
  Compass,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Sliders,
} from 'lucide-react';

export type ViewerModelId = 'kinetix-7-arm' | 'ohm-x1';

export interface JointTelemetrySpec {
  id: string;
  shortLabel: string;
  name: string;
  actuator: string;
  peakTorque: string;
  maxSpeed: string;
  statorResistance: string;
  encoder: string;
  defaultAngleDeg: number;
  minDeg: number;
  maxDeg: number;
  rotationAxis: 'X' | 'Y' | 'Z';
}

const KINETIX_JOINTS: JointTelemetrySpec[] = [
  {
    id: 'j1',
    shortLabel: 'J1 Base',
    name: 'J1 Base Azimuth Turret',
    actuator: 'Ohm-Harmonic-110 SiC',
    peakTorque: '240 Nm',
    maxSpeed: '3.8 rad/s',
    statorResistance: '0.078 mΩ',
    encoder: '24-Bit BiSS-C Dual Optical',
    defaultAngleDeg: 25,
    minDeg: -160,
    maxDeg: 160,
    rotationAxis: 'Y',
  },
  {
    id: 'j2',
    shortLabel: 'J2 Shoulder',
    name: 'J2 Shoulder Pitch Drive',
    actuator: 'Ohm-Harmonic-110 SiC',
    peakTorque: '240 Nm',
    maxSpeed: '3.8 rad/s',
    statorResistance: '0.078 mΩ',
    encoder: '24-Bit BiSS-C + Strain Ring',
    defaultAngleDeg: -22,
    minDeg: -95,
    maxDeg: 95,
    rotationAxis: 'Z',
  },
  {
    id: 'j3',
    shortLabel: 'J3 Elbow',
    name: 'J3 Elbow Flexion Stage',
    actuator: 'Ohm-Harmonic-85 SiC',
    peakTorque: '130 Nm',
    maxSpeed: '5.2 rad/s',
    statorResistance: '0.092 mΩ',
    encoder: '24-Bit BiSS-C Dual Optical',
    defaultAngleDeg: 48,
    minDeg: -120,
    maxDeg: 120,
    rotationAxis: 'Z',
  },
  {
    id: 'j4',
    shortLabel: 'J4 Forearm',
    name: 'J4 Forearm Axial Roll',
    actuator: 'Ohm-Harmonic-85 SiC',
    peakTorque: '130 Nm',
    maxSpeed: '5.2 rad/s',
    statorResistance: '0.092 mΩ',
    encoder: '24-Bit BiSS-C Dual Optical',
    defaultAngleDeg: -15,
    minDeg: -160,
    maxDeg: 160,
    rotationAxis: 'Y',
  },
  {
    id: 'j5',
    shortLabel: 'J5 Wrist',
    name: 'J5/J6 Spherical Wrist Pitch',
    actuator: 'Ohm-Frameless-52 Slotless',
    peakTorque: '38 Nm',
    maxSpeed: '9.4 rad/s',
    statorResistance: '0.140 mΩ',
    encoder: '22-Bit Hollow-Bore Optical',
    defaultAngleDeg: 32,
    minDeg: -110,
    maxDeg: 110,
    rotationAxis: 'Z',
  },
  {
    id: 'j6',
    shortLabel: 'J7 Flange',
    name: 'J7 ISO-9409 Tool & Tactile Gripper',
    actuator: 'Ohm-Micro-24 Coreless + 6D Cell',
    peakTorque: '18 Nm (0.05 N Sensitivity)',
    maxSpeed: '14.0 rad/s',
    statorResistance: '0.185 mΩ',
    encoder: '1,024-Taxel Capacitive Array',
    defaultAngleDeg: 20,
    minDeg: -90,
    maxDeg: 90,
    rotationAxis: 'Y',
  },
];

const OHM_X1_JOINTS: JointTelemetrySpec[] = [
  {
    id: 'j1',
    shortLabel: 'Torso Yaw',
    name: 'Lumbar Pelvis-Torso 3-DOF Yaw/Pitch',
    actuator: 'Ohm-QDD-140 High-Flux',
    peakTorque: '380 Nm',
    maxSpeed: '18.0 rad/s',
    statorResistance: '0.078 mΩ',
    encoder: '24-Bit BiSS-C + IMU Fusion',
    defaultAngleDeg: 12,
    minDeg: -65,
    maxDeg: 65,
    rotationAxis: 'Y',
  },
  {
    id: 'j2',
    shortLabel: 'R-Shoulder',
    name: 'Right Shoulder Pitch / Roll QDD',
    actuator: 'Ohm-QDD-90 Hollow-Shaft',
    peakTorque: '145 Nm',
    maxSpeed: '28.0 rad/s',
    statorResistance: '0.086 mΩ',
    encoder: '24-Bit Dual Optical Ring',
    defaultAngleDeg: -35,
    minDeg: -120,
    maxDeg: 120,
    rotationAxis: 'X',
  },
  {
    id: 'j3',
    shortLabel: 'R-Elbow',
    name: 'Right Elbow Flexion QDD + Hand',
    actuator: 'Ohm-QDD-90 + Ohm-Micro-24',
    peakTorque: '145 Nm / 18 Nm Wrist',
    maxSpeed: '28.0 rad/s',
    statorResistance: '0.086 mΩ',
    encoder: '24-Bit + 1,024-Taxel Hand',
    defaultAngleDeg: 52,
    minDeg: -110,
    maxDeg: 110,
    rotationAxis: 'X',
  },
  {
    id: 'j4',
    shortLabel: 'L-Shoulder',
    name: 'Left Shoulder Pitch / Roll QDD',
    actuator: 'Ohm-QDD-90 Hollow-Shaft',
    peakTorque: '145 Nm',
    maxSpeed: '28.0 rad/s',
    statorResistance: '0.086 mΩ',
    encoder: '24-Bit Dual Optical Ring',
    defaultAngleDeg: 24,
    minDeg: -120,
    maxDeg: 120,
    rotationAxis: 'X',
  },
  {
    id: 'j5',
    shortLabel: 'Hip QDD',
    name: 'Bipedal Hip Abduction / Pitch Stage',
    actuator: 'Ohm-QDD-140 Liquid-Cooled',
    peakTorque: '380 Nm',
    maxSpeed: '18.0 rad/s',
    statorResistance: '0.078 mΩ',
    encoder: '24-Bit Redundant Safety Encoder',
    defaultAngleDeg: -14,
    minDeg: -55,
    maxDeg: 55,
    rotationAxis: 'X',
  },
  {
    id: 'j6',
    shortLabel: 'Knee QDD',
    name: 'Bipedal Knee Flexion Regenerative QDD',
    actuator: 'Ohm-QDD-140 Liquid-Cooled',
    peakTorque: '360 Nm',
    maxSpeed: '21.0 rad/s',
    statorResistance: '0.078 mΩ',
    encoder: '24-Bit BiSS-C Output Ring',
    defaultAngleDeg: 22,
    minDeg: -65,
    maxDeg: 65,
    rotationAxis: 'X',
  },
];

// Detect software WebGL once at module load per Three.js skill directive
const IS_SOFTWARE_GL = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
})();

/**
 * Initializes RoomEnvironment via PMREMGenerator so metallic PBR surfaces
 * (titanium, anodized aluminum, copper Halbach stators) reflect realistic studio light.
 */
const StudioEnvironmentSetup: React.FC = () => {
  const { gl, scene } = useThree();

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.12;

    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.fog = new THREE.FogExp2('#070A12', 0.065);
    pmremGenerator.dispose();

    return () => {
      envTexture.dispose();
    };
  }, [gl, scene]);

  return null;
};

/**
 * Reusable 3D Coordinate Frame Triad (X: Red #ef4444, Y: Emerald #10b981, Z: Cyan #38bdf8)
 * Smoothly scales in when `visible` is true (on robot hover, joint hover, or pinned mode).
 */
interface CoordinateAxesTriadProps {
  visible: boolean;
  axisLength?: number;
  thickness?: number;
  showLabels?: boolean;
  frameLabel?: string;
}

const CoordinateAxesTriad: React.FC<CoordinateAxesTriadProps> = ({
  visible,
  axisLength = 0.55,
  thickness = 0.014,
  showLabels = false,
  frameLabel,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef<number>(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const targetScale = visible ? 1 : 0;
    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, targetScale, 10, dt);
    if (groupRef.current) {
      const s = Math.max(0.0001, scaleRef.current);
      groupRef.current.scale.setScalar(s);
      groupRef.current.visible = scaleRef.current > 0.01;
    }
  });

  const headLength = axisLength * 0.18;
  const headRadius = thickness * 2.4;
  const shaftLen = axisLength - headLength;

  return (
    <group ref={groupRef}>
      {/* Origin Reference Sphere */}
      <mesh>
        <sphereGeometry args={[thickness * 1.9, 16, 16]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#38bdf8"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* +X Axis (Red) */}
      <group rotation={[0, 0, -Math.PI / 2]}>
        <mesh position={[0, shaftLen * 0.5, 0]}>
          <cylinderGeometry args={[thickness, thickness, shaftLen, 12]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.2}
          />
        </mesh>
        <mesh position={[0, shaftLen + headLength * 0.5, 0]}>
          <coneGeometry args={[headRadius, headLength, 14]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.4}
          />
        </mesh>
      </group>

      {/* +Y Axis (Emerald Green) */}
      <group>
        <mesh position={[0, shaftLen * 0.5, 0]}>
          <cylinderGeometry args={[thickness, thickness, shaftLen, 12]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.2}
          />
        </mesh>
        <mesh position={[0, shaftLen + headLength * 0.5, 0]}>
          <coneGeometry args={[headRadius, headLength, 14]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.4}
          />
        </mesh>
      </group>

      {/* +Z Axis (Cyan/Blue) */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, shaftLen * 0.5, 0]}>
          <cylinderGeometry args={[thickness, thickness, shaftLen, 12]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.2}
          />
        </mesh>
        <mesh position={[0, shaftLen + headLength * 0.5, 0]}>
          <coneGeometry args={[headRadius, headLength, 14]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={1.4}
          />
        </mesh>
      </group>

      {/* Floating X / Y / Z Labels when visible */}
      {showLabels && visible && (
        <>
          <Html
            position={[axisLength + 0.08, 0, 0]}
            center
            distanceFactor={6}
            style={{ pointerEvents: 'none' }}
          >
            <span className="px-1.5 py-0.5 rounded bg-[#090D18] border border-red-500/60 text-[10px] font-mono font-bold text-red-400 whitespace-nowrap shadow">
              +X
            </span>
          </Html>
          <Html
            position={[0, axisLength + 0.08, 0]}
            center
            distanceFactor={6}
            style={{ pointerEvents: 'none' }}
          >
            <span className="px-1.5 py-0.5 rounded bg-[#090D18] border border-emerald-500/60 text-[10px] font-mono font-bold text-emerald-400 whitespace-nowrap shadow">
              +Y
            </span>
          </Html>
          <Html
            position={[0, 0, axisLength + 0.08]}
            center
            distanceFactor={6}
            style={{ pointerEvents: 'none' }}
          >
            <span className="px-1.5 py-0.5 rounded bg-[#090D18] border border-sky-500/60 text-[10px] font-mono font-bold text-sky-300 whitespace-nowrap shadow">
              +Z {frameLabel ? `(${frameLabel})` : ''}
            </span>
          </Html>
        </>
      )}
    </group>
  );
};

/**
 * Dynamic 3D Joint Limit Protractor Visualizer:
 * Renders the allowable angular envelope [minDeg, maxDeg] around a joint's stator axis,
 * hard-stop boundary ticks at minDeg and maxDeg, a 0° neutral tick, and a live pointer ray
 * showing the instantaneous joint angle inside the travel envelope.
 */
interface JointLimitVisualizerProps {
  visible: boolean;
  isHighlighted: boolean;
  radius: number;
  minDeg: number;
  maxDeg: number;
  currentAngleDeg: number;
  shortLabel: string;
  rotationAxis: 'X' | 'Y' | 'Z';
  showBadge: boolean;
}

const JointLimitVisualizer: React.FC<JointLimitVisualizerProps> = ({
  visible,
  isHighlighted,
  radius,
  minDeg,
  maxDeg,
  currentAngleDeg,
  shortLabel,
  rotationAxis,
  showBadge,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const scaleRef = useRef<number>(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const target = visible ? 1 : 0;
    scaleRef.current = THREE.MathUtils.damp(scaleRef.current, target, 10, dt);
    if (groupRef.current) {
      const s = Math.max(0.0001, scaleRef.current);
      groupRef.current.scale.setScalar(s);
      groupRef.current.visible = scaleRef.current > 0.01;
    }
  });

  const minRad = THREE.MathUtils.degToRad(minDeg);
  const maxRad = THREE.MathUtils.degToRad(maxDeg);
  const spanRad = Math.max(0.05, maxRad - minRad);
  const currentRad = THREE.MathUtils.degToRad(
    THREE.MathUtils.clamp(currentAngleDeg, minDeg, maxDeg)
  );

  const innerR = radius * 1.18;
  const outerR = radius * 1.44;
  const midR = (innerR + outerR) * 0.5;

  // Compute positions for min hard-stop, max hard-stop, 0° reference, and current live angle
  // In the XZ plane (rotated -Math.PI/2 around X), polar angle theta maps to:
  // x = r * cos(theta), z = -r * sin(theta)
  const minPos: [number, number, number] = [
    Math.cos(minRad) * midR,
    0,
    -Math.sin(minRad) * midR,
  ];
  const maxPos: [number, number, number] = [
    Math.cos(maxRad) * midR,
    0,
    -Math.sin(maxRad) * midR,
  ];
  const curPos: [number, number, number] = [
    Math.cos(currentRad) * (outerR + 0.03),
    0,
    -Math.sin(currentRad) * (outerR + 0.03),
  ];

  return (
    <group ref={groupRef}>
      {/* Allowable Angular Sector [minDeg, maxDeg] */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerR, outerR, 40, 1, minRad, spanRad]} />
        <meshBasicMaterial
          color={isHighlighted ? '#22d3ee' : '#38bdf8'}
          transparent
          opacity={isHighlighted ? 0.34 : 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer Rim Arc Wireframe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[outerR - 0.012, outerR, 40, 1, minRad, spanRad]} />
        <meshBasicMaterial
          color={isHighlighted ? '#22d3ee' : '#0284c7'}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Min Limit Hard-Stop Marker (Red/Amber) */}
      <mesh position={minPos} rotation={[0, minRad, 0]}>
        <boxGeometry args={[outerR - innerR + 0.06, 0.025, 0.022]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={1.6}
        />
      </mesh>

      {/* Max Limit Hard-Stop Marker (Red/Amber) */}
      <mesh position={maxPos} rotation={[0, maxRad, 0]}>
        <boxGeometry args={[outerR - innerR + 0.06, 0.025, 0.022]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#f59e0b"
          emissiveIntensity={1.6}
        />
      </mesh>

      {/* 0° Neutral Calibration Tick */}
      <mesh position={[midR, 0, 0]}>
        <boxGeometry args={[outerR - innerR + 0.03, 0.015, 0.014]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>

      {/* Live Instantaneous Joint Angle Pointer & Tip Beacon */}
      <group rotation={[0, currentRad, 0]}>
        <mesh position={[midR * 0.85, 0.012, 0]}>
          <boxGeometry args={[outerR * 0.55, 0.02, 0.022]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.9}
          />
        </mesh>
      </group>
      <mesh position={curPos}>
        <sphereGeometry args={[0.03, 14, 14]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Floating 3D Technical Readout Pill for Hovered/Inspected Joint */}
      {showBadge && visible && (
        <Html
          position={[0, 0.24, outerR + 0.08]}
          center
          distanceFactor={5.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="px-2.5 py-1.5 rounded-lg bg-[#090D18] border border-cyan-400/70 shadow-xl text-[10px] font-mono whitespace-nowrap space-y-0.5">
            <div className="flex items-center justify-between gap-2 text-cyan-300 font-bold">
              <span>{shortLabel}</span>
              <span className="text-emerald-400">AXIS: {rotationAxis}</span>
            </div>
            <div className="text-slate-300">
              LIMITS:{' '}
              <span className="text-amber-300 font-semibold">
                [{minDeg}°, +{maxDeg}°]
              </span>{' '}
              • θ:{' '}
              <span className="text-white font-bold">
                {Math.round(currentAngleDeg)}°
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * Reusable Ohm™ QDD / Harmonic Actuator Joint Assembly (Multi-part composite group:
 * Outer Anodized Stator Housing + Exposed Copper Halbach Winding Ring + Glowing Telemetry Ring
 * + Dynamic Coordinate Axes Triad + Joint Limit Protractor Visualizer)
 */
interface ActuatorRingProps {
  jointId: string;
  selectedJointId: string;
  hoveredJointId: string | null;
  onSelectJoint: (id: string) => void;
  onHoverJoint: (id: string | null) => void;
  jointSpec: JointTelemetrySpec;
  currentAngleDeg: number;
  showTechnicalOverlays: boolean;
  radius?: number;
  length?: number;
  explodedOffset?: number;
  wireframe?: boolean;
  accentColor?: string;
}

const ActuatorAssembly: React.FC<ActuatorRingProps> = ({
  jointId,
  selectedJointId,
  hoveredJointId,
  onSelectJoint,
  onHoverJoint,
  jointSpec,
  currentAngleDeg,
  showTechnicalOverlays,
  radius = 0.28,
  length = 0.26,
  explodedOffset = 0,
  wireframe = false,
  accentColor = '#22d3ee',
}) => {
  const isSelected = selectedJointId === jointId;
  const isHovered = hoveredJointId === jointId;

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onSelectJoint(jointId);
  };

  // Show local joint coordinate triad & limit visualizer when the robot is hovered/pinned
  const showJointVisualizer =
    showTechnicalOverlays && (isHovered || isSelected || hoveredJointId === null);

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHoverJoint(jointId);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHoverJoint(null);
      }}
    >
      {/* 1. Primary Stator Housing Cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, length, 28]} />
        <meshPhysicalMaterial
          color={isSelected ? '#164e63' : isHovered ? '#1e293b' : '#0f172a'}
          metalness={0.85}
          roughness={0.24}
          clearcoat={0.6}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Exposed Copper Halbach Stator Winding Core (Separates in Exploded View) */}
      <mesh
        position={[0, explodedOffset * 0.22, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <torusGeometry args={[radius * 0.96, radius * 0.13, 14, 32]} />
        <meshStandardMaterial
          color="#d97706"
          metalness={0.94}
          roughness={0.18}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Titanium Harmonic Flexspline Cap (Separates Opposite Direction in Exploded View) */}
      <mesh position={[0, -length * 0.52 - explodedOffset * 0.18, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.88, radius * 0.92, length * 0.18, 24]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.92}
          roughness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* 4. BiSS-C Optical Encoder Telemetry Ring */}
      <mesh
        position={[0, length * 0.51 + explodedOffset * 0.15, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[radius * 1.03, 0.022, 12, 36]} />
        <meshStandardMaterial
          color={isSelected ? '#22d3ee' : isHovered ? '#38bdf8' : accentColor}
          emissive={isSelected ? '#22d3ee' : isHovered ? '#38bdf8' : accentColor}
          emissiveIntensity={isSelected ? 1.8 : isHovered ? 1.3 : 0.65}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* 5. Dynamic Local Coordinate Axes (X, Y, Z) on Hovered or Active Joint */}
      <CoordinateAxesTriad
        visible={showTechnicalOverlays && (isHovered || isSelected)}
        axisLength={radius * 1.65}
        thickness={0.011}
        showLabels={isHovered}
      />

      {/* 6. Dynamic Joint Limit Protractor Visualizer [minDeg, maxDeg] */}
      <JointLimitVisualizer
        visible={showJointVisualizer}
        isHighlighted={isHovered || isSelected}
        radius={radius}
        minDeg={jointSpec.minDeg}
        maxDeg={jointSpec.maxDeg}
        currentAngleDeg={currentAngleDeg}
        shortLabel={jointSpec.shortLabel}
        rotationAxis={jointSpec.rotationAxis}
        showBadge={isHovered || (isSelected && hoveredJointId === null)}
      />
    </group>
  );
};

interface RobotMeshSceneProps {
  modelId: ViewerModelId;
  selectedJointId: string;
  hoveredJointId: string | null;
  onSelectJoint: (id: string) => void;
  onHoverJoint: (id: string | null) => void;
  onModelHoverChange: (hovered: boolean) => void;
  showTechnicalOverlays: boolean;
  jointSpecsMap: Record<string, JointTelemetrySpec>;
  jointAnglesDeg: Record<string, number>;
  autoAnimate: boolean;
  explodedPct: number;
  wireframe: boolean;
}

/**
 * 3D Articulated Kinetix-7 Axis Arm (7-DOF Redundant Manipulator)
 */
const Kinetix7ArmModel: React.FC<RobotMeshSceneProps> = ({
  selectedJointId,
  hoveredJointId,
  onSelectJoint,
  onHoverJoint,
  onModelHoverChange,
  showTechnicalOverlays,
  jointSpecsMap,
  jointAnglesDeg,
  autoAnimate,
  explodedPct,
  wireframe,
}) => {
  const j1Ref = useRef<THREE.Group>(null);
  const j2Ref = useRef<THREE.Group>(null);
  const j3Ref = useRef<THREE.Group>(null);
  const j4Ref = useRef<THREE.Group>(null);
  const j5Ref = useRef<THREE.Group>(null);
  const j6Ref = useRef<THREE.Group>(null);
  const expRef = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    expRef.current = THREE.MathUtils.damp(expRef.current, explodedPct / 100, 6, dt);

    const degToRad = THREE.MathUtils.degToRad;
    const targetJ1 = autoAnimate
      ? degToRad(jointAnglesDeg.j1 + Math.sin(t * 0.9) * 38)
      : degToRad(jointAnglesDeg.j1);
    const targetJ2 = autoAnimate
      ? degToRad(jointAnglesDeg.j2 + Math.cos(t * 1.1) * 22)
      : degToRad(jointAnglesDeg.j2);
    const targetJ3 = autoAnimate
      ? degToRad(jointAnglesDeg.j3 + Math.sin(t * 1.3) * 28)
      : degToRad(jointAnglesDeg.j3);
    const targetJ4 = autoAnimate
      ? degToRad(jointAnglesDeg.j4 + Math.cos(t * 1.6) * 45)
      : degToRad(jointAnglesDeg.j4);
    const targetJ5 = autoAnimate
      ? degToRad(jointAnglesDeg.j5 + Math.sin(t * 1.8) * 35)
      : degToRad(jointAnglesDeg.j5);
    const targetJ6 = autoAnimate
      ? degToRad(jointAnglesDeg.j6 + Math.sin(t * 2.4) * 50)
      : degToRad(jointAnglesDeg.j6);

    if (j1Ref.current) {
      j1Ref.current.rotation.y = THREE.MathUtils.damp(
        j1Ref.current.rotation.y,
        targetJ1,
        7,
        dt
      );
    }
    if (j2Ref.current) {
      j2Ref.current.rotation.z = THREE.MathUtils.damp(
        j2Ref.current.rotation.z,
        targetJ2,
        7,
        dt
      );
    }
    if (j3Ref.current) {
      j3Ref.current.rotation.z = THREE.MathUtils.damp(
        j3Ref.current.rotation.z,
        targetJ3,
        7,
        dt
      );
    }
    if (j4Ref.current) {
      j4Ref.current.rotation.y = THREE.MathUtils.damp(
        j4Ref.current.rotation.y,
        targetJ4,
        7,
        dt
      );
    }
    if (j5Ref.current) {
      j5Ref.current.rotation.z = THREE.MathUtils.damp(
        j5Ref.current.rotation.z,
        targetJ5,
        7,
        dt
      );
    }
    if (j6Ref.current) {
      j6Ref.current.rotation.y = THREE.MathUtils.damp(
        j6Ref.current.rotation.y,
        targetJ6,
        7,
        dt
      );
    }
  });

  const exp = explodedPct / 100;

  return (
    <group
      position={[0, -1.35, 0]}
      onPointerOver={() => onModelHoverChange(true)}
      onPointerOut={() => onModelHoverChange(false)}
    >
      {/* World Base Coordinate Axes (X, Y, Z) at Pedestal Origin */}
      <group position={[-0.95, 0.05, 0.75]}>
        <CoordinateAxesTriad
          visible={showTechnicalOverlays}
          axisLength={0.62}
          thickness={0.015}
          showLabels
          frameLabel="BASE"
        />
      </group>

      {/* Base Mounting Flange & Pedestal (Grounded at y = 0) */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.72, 0.16, 36]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.85}
          roughness={0.3}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.52, 0.56, 36]} />
        <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} />
      </mesh>

      {/* J1 Base Azimuth Turret */}
      <group ref={j1Ref} position={[0, 0.34 + exp * 0.2, 0]}>
        <ActuatorAssembly
          jointId="j1"
          selectedJointId={selectedJointId}
          hoveredJointId={hoveredJointId}
          onSelectJoint={onSelectJoint}
          onHoverJoint={onHoverJoint}
          jointSpec={jointSpecsMap.j1}
          currentAngleDeg={jointAnglesDeg.j1}
          showTechnicalOverlays={showTechnicalOverlays}
          radius={0.42}
          length={0.36}
          explodedOffset={exp}
          wireframe={wireframe}
          accentColor="#f59e0b"
        />

        {/* Shoulder Yoke Riser */}
        <mesh position={[0, 0.38 + exp * 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.38, 0.42, 24]} />
          <meshPhysicalMaterial
            color="#cbd5e1"
            metalness={0.88}
            roughness={0.22}
            clearcoat={0.4}
            wireframe={wireframe}
          />
        </mesh>

        {/* J2 Shoulder Pitch Joint */}
        <group ref={j2Ref} position={[0, 0.62 + exp * 0.25, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <ActuatorAssembly
              jointId="j2"
              selectedJointId={selectedJointId}
              hoveredJointId={hoveredJointId}
              onSelectJoint={onSelectJoint}
              onHoverJoint={onHoverJoint}
              jointSpec={jointSpecsMap.j2}
              currentAngleDeg={jointAnglesDeg.j2}
              showTechnicalOverlays={showTechnicalOverlays}
              radius={0.34}
              length={0.38}
              explodedOffset={exp}
              wireframe={wireframe}
              accentColor="#22d3ee"
            />
          </group>

          {/* Upper Arm Forged Magnesium-Carbon Link */}
          <mesh position={[0, 0.55 + exp * 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.92, 24]} />
            <meshPhysicalMaterial
              color="#0f172a"
              metalness={0.65}
              roughness={0.42}
              clearcoat={0.5}
              wireframe={wireframe}
            />
          </mesh>
          {/* Twin Titanium Structural Ribs */}
          <mesh position={[0, 0.55 + exp * 0.2, 0.19]} castShadow>
            <boxGeometry args={[0.06, 0.76, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              metalness={0.9}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
          <mesh position={[0, 0.55 + exp * 0.2, -0.19]} castShadow>
            <boxGeometry args={[0.06, 0.76, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              metalness={0.9}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>

          {/* J3 Elbow Flexion Joint */}
          <group ref={j3Ref} position={[0, 1.08 + exp * 0.35, 0]}>
            <group rotation={[Math.PI / 2, 0, 0]}>
              <ActuatorAssembly
                jointId="j3"
                selectedJointId={selectedJointId}
                hoveredJointId={hoveredJointId}
                onSelectJoint={onSelectJoint}
                onHoverJoint={onHoverJoint}
                jointSpec={jointSpecsMap.j3}
                currentAngleDeg={jointAnglesDeg.j3}
                showTechnicalOverlays={showTechnicalOverlays}
                radius={0.27}
                length={0.32}
                explodedOffset={exp}
                wireframe={wireframe}
                accentColor="#f59e0b"
              />
            </group>

            {/* J4 Forearm Axial Roll Stage */}
            <group ref={j4Ref} position={[0, 0.28 + exp * 0.2, 0]}>
              <ActuatorAssembly
                jointId="j4"
                selectedJointId={selectedJointId}
                hoveredJointId={hoveredJointId}
                onSelectJoint={onSelectJoint}
                onHoverJoint={onHoverJoint}
                jointSpec={jointSpecsMap.j4}
                currentAngleDeg={jointAnglesDeg.j4}
                showTechnicalOverlays={showTechnicalOverlays}
                radius={0.21}
                length={0.24}
                explodedOffset={exp}
                wireframe={wireframe}
                accentColor="#22d3ee"
              />

              {/* Forearm Tube */}
              <mesh position={[0, 0.38 + exp * 0.15, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.14, 0.17, 0.56, 24]} />
                <meshPhysicalMaterial
                  color="#e2e8f0"
                  metalness={0.86}
                  roughness={0.24}
                  wireframe={wireframe}
                />
              </mesh>

              {/* J5/J6 Spherical Wrist Pitch */}
              <group ref={j5Ref} position={[0, 0.72 + exp * 0.25, 0]}>
                <group rotation={[Math.PI / 2, 0, 0]}>
                  <ActuatorAssembly
                    jointId="j5"
                    selectedJointId={selectedJointId}
                    hoveredJointId={hoveredJointId}
                    onSelectJoint={onSelectJoint}
                    onHoverJoint={onHoverJoint}
                    jointSpec={jointSpecsMap.j5}
                    currentAngleDeg={jointAnglesDeg.j5}
                    showTechnicalOverlays={showTechnicalOverlays}
                    radius={0.18}
                    length={0.24}
                    explodedOffset={exp}
                    wireframe={wireframe}
                    accentColor="#10b981"
                  />
                </group>

                {/* J7 ISO-9409 Tool Flange & Dexterous Parallel Gripper */}
                <group ref={j6Ref} position={[0, 0.24 + exp * 0.22, 0]}>
                  <ActuatorAssembly
                    jointId="j6"
                    selectedJointId={selectedJointId}
                    hoveredJointId={hoveredJointId}
                    onSelectJoint={onSelectJoint}
                    onHoverJoint={onHoverJoint}
                    jointSpec={jointSpecsMap.j6}
                    currentAngleDeg={jointAnglesDeg.j6}
                    showTechnicalOverlays={showTechnicalOverlays}
                    radius={0.15}
                    length={0.16}
                    explodedOffset={exp}
                    wireframe={wireframe}
                    accentColor="#22d3ee"
                  />

                  {/* Gripper Palm Base */}
                  <mesh position={[0, 0.13 + exp * 0.1, 0]} castShadow>
                    <boxGeometry args={[0.32, 0.07, 0.14]} />
                    <meshStandardMaterial
                      color="#1e293b"
                      metalness={0.85}
                      roughness={0.25}
                      wireframe={wireframe}
                    />
                  </mesh>

                  {/* Left & Right Capacitive Tactile Fingers */}
                  <mesh
                    position={[-0.1 - exp * 0.06, 0.26 + exp * 0.15, 0]}
                    castShadow
                  >
                    <boxGeometry args={[0.04, 0.22, 0.08]} />
                    <meshStandardMaterial
                      color="#94a3b8"
                      metalness={0.9}
                      roughness={0.18}
                      wireframe={wireframe}
                    />
                  </mesh>
                  <mesh
                    position={[0.1 + exp * 0.06, 0.26 + exp * 0.15, 0]}
                    castShadow
                  >
                    <boxGeometry args={[0.04, 0.22, 0.08]} />
                    <meshStandardMaterial
                      color="#94a3b8"
                      metalness={0.9}
                      roughness={0.18}
                      wireframe={wireframe}
                    />
                  </mesh>
                  {/* Optical Laser TCP Emitter + Tool Center Point (TCP) Coordinate Frame */}
                  <mesh position={[0, 0.18, 0]}>
                    <sphereGeometry args={[0.028, 16, 16]} />
                    <meshStandardMaterial
                      color="#22d3ee"
                      emissive="#22d3ee"
                      emissiveIntensity={2}
                    />
                  </mesh>
                  <group position={[0, 0.34, 0]}>
                    <CoordinateAxesTriad
                      visible={showTechnicalOverlays}
                      axisLength={0.32}
                      thickness={0.009}
                      showLabels
                      frameLabel="TCP"
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

/**
 * 3D Articulated Ohm-X1 Humanoid (42-DOF Bipedal Generalist)
 */
const OhmX1HumanoidModel: React.FC<RobotMeshSceneProps> = ({
  selectedJointId,
  hoveredJointId,
  onSelectJoint,
  onHoverJoint,
  onModelHoverChange,
  showTechnicalOverlays,
  jointSpecsMap,
  jointAnglesDeg,
  autoAnimate,
  explodedPct,
  wireframe,
}) => {
  const torsoRef = useRef<THREE.Group>(null);
  const rShoulderRef = useRef<THREE.Group>(null);
  const rElbowRef = useRef<THREE.Group>(null);
  const lShoulderRef = useRef<THREE.Group>(null);
  const lHipRef = useRef<THREE.Group>(null);
  const rHipRef = useRef<THREE.Group>(null);
  const lKneeRef = useRef<THREE.Group>(null);
  const rKneeRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const t = state.clock.elapsedTime;
    const degToRad = THREE.MathUtils.degToRad;

    const torsoYaw = autoAnimate
      ? degToRad(jointAnglesDeg.j1 + Math.sin(t * 0.8) * 16)
      : degToRad(jointAnglesDeg.j1);
    const rShPitch = autoAnimate
      ? degToRad(jointAnglesDeg.j2 + Math.sin(t * 1.3) * 28)
      : degToRad(jointAnglesDeg.j2);
    const rElPitch = autoAnimate
      ? degToRad(jointAnglesDeg.j3 + Math.cos(t * 1.5) * 24)
      : degToRad(jointAnglesDeg.j3);
    const lShPitch = autoAnimate
      ? degToRad(jointAnglesDeg.j4 - Math.sin(t * 1.3) * 25)
      : degToRad(jointAnglesDeg.j4);
    const hipPitch = autoAnimate
      ? degToRad(jointAnglesDeg.j5 + Math.sin(t * 1.1) * 10)
      : degToRad(jointAnglesDeg.j5);
    const kneePitch = autoAnimate
      ? degToRad(jointAnglesDeg.j6 + Math.abs(Math.sin(t * 1.1)) * 16)
      : degToRad(jointAnglesDeg.j6);

    if (torsoRef.current) {
      torsoRef.current.rotation.y = THREE.MathUtils.damp(
        torsoRef.current.rotation.y,
        torsoYaw,
        7,
        dt
      );
    }
    if (rShoulderRef.current) {
      rShoulderRef.current.rotation.x = THREE.MathUtils.damp(
        rShoulderRef.current.rotation.x,
        rShPitch,
        7,
        dt
      );
    }
    if (rElbowRef.current) {
      rElbowRef.current.rotation.x = THREE.MathUtils.damp(
        rElbowRef.current.rotation.x,
        -Math.abs(rElPitch),
        7,
        dt
      );
    }
    if (lShoulderRef.current) {
      lShoulderRef.current.rotation.x = THREE.MathUtils.damp(
        lShoulderRef.current.rotation.x,
        lShPitch,
        7,
        dt
      );
    }
    if (lHipRef.current) {
      lHipRef.current.rotation.x = THREE.MathUtils.damp(
        lHipRef.current.rotation.x,
        hipPitch,
        7,
        dt
      );
    }
    if (rHipRef.current) {
      rHipRef.current.rotation.x = THREE.MathUtils.damp(
        rHipRef.current.rotation.x,
        -hipPitch * 0.6,
        7,
        dt
      );
    }
    if (lKneeRef.current) {
      lKneeRef.current.rotation.x = THREE.MathUtils.damp(
        lKneeRef.current.rotation.x,
        kneePitch,
        7,
        dt
      );
    }
    if (rKneeRef.current) {
      rKneeRef.current.rotation.x = THREE.MathUtils.damp(
        rKneeRef.current.rotation.x,
        kneePitch * 0.7,
        7,
        dt
      );
    }
  });

  const exp = explodedPct / 100;

  return (
    <group
      position={[0, -1.35, 0]}
      onPointerOver={() => onModelHoverChange(true)}
      onPointerOut={() => onModelHoverChange(false)}
    >
      {/* World Base Coordinate Axes (X, Y, Z) at Calibration Platform Origin */}
      <group position={[-1.05, 0.05, 0.78]}>
        <CoordinateAxesTriad
          visible={showTechnicalOverlays}
          axisLength={0.62}
          thickness={0.015}
          showLabels
          frameLabel="WORLD"
        />
      </group>

      {/* Calibration Floor Platform Disc */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.85, 0.92, 0.08, 40]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.35}
          wireframe={wireframe}
        />
      </mesh>

      {/* Pelvis Block */}
      <group position={[0, 1.32, 0]}>
        {/* Center of Mass (CoM) Coordinate Triad */}
        <group position={[0, 0, 0.25]}>
          <CoordinateAxesTriad
            visible={showTechnicalOverlays}
            axisLength={0.36}
            thickness={0.01}
            showLabels
            frameLabel="CoM"
          />
        </group>

        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.24, 0.34]} />
          <meshPhysicalMaterial
            color="#1e293b"
            metalness={0.85}
            roughness={0.28}
            wireframe={wireframe}
          />
        </mesh>

        {/* J1 Lumbar Torso Yaw/Pitch Assembly */}
        <group ref={torsoRef} position={[0, 0.22 + exp * 0.2, 0]}>
          <ActuatorAssembly
            jointId="j1"
            selectedJointId={selectedJointId}
            hoveredJointId={hoveredJointId}
            onSelectJoint={onSelectJoint}
            onHoverJoint={onHoverJoint}
            jointSpec={jointSpecsMap.j1}
            currentAngleDeg={jointAnglesDeg.j1}
            showTechnicalOverlays={showTechnicalOverlays}
            radius={0.24}
            length={0.22}
            explodedOffset={exp}
            wireframe={wireframe}
            accentColor="#22d3ee"
          />

          {/* Carbon-Titanium Monocoque Chest & Dual Algor-NPU Core */}
          <group position={[0, 0.52 + exp * 0.18, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.68, 0.72, 0.38]} />
              <meshPhysicalMaterial
                color="#0f172a"
                metalness={0.78}
                roughness={0.26}
                clearcoat={0.6}
                wireframe={wireframe}
              />
            </mesh>
            {/* Front Chest Armor Bevel & Glowing Algor-NPU Core */}
            <mesh position={[0, 0.06, 0.2 + exp * 0.14]} castShadow>
              <boxGeometry args={[0.48, 0.46, 0.06]} />
              <meshPhysicalMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.2}
                wireframe={wireframe}
              />
            </mesh>
            <mesh position={[0, 0.08, 0.24 + exp * 0.18]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.03, 24]} />
              <meshStandardMaterial
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={1.6}
              />
            </mesh>

            {/* Stereo Optic Sensor Head */}
            <group position={[0, 0.56 + exp * 0.22, 0]}>
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.12, 0.16, 20]} />
                <meshStandardMaterial
                  color="#475569"
                  metalness={0.85}
                  roughness={0.25}
                  wireframe={wireframe}
                />
              </mesh>
              <mesh castShadow>
                <boxGeometry args={[0.32, 0.28, 0.32]} />
                <meshPhysicalMaterial
                  color="#e2e8f0"
                  metalness={0.88}
                  roughness={0.2}
                  clearcoat={0.5}
                  wireframe={wireframe}
                />
              </mesh>
              {/* Optical Visor Strip */}
              <mesh position={[0, 0.02, 0.165 + exp * 0.08]}>
                <boxGeometry args={[0.26, 0.09, 0.02]} />
                <meshStandardMaterial
                  color="#22d3ee"
                  emissive="#06b6d4"
                  emissiveIntensity={1.5}
                />
              </mesh>
            </group>

            {/* J2 Right Shoulder QDD-90 + Right Arm */}
            <group
              ref={rShoulderRef}
              position={[-0.46 - exp * 0.22, 0.22, 0]}
            >
              <group rotation={[0, 0, Math.PI / 2]}>
                <ActuatorAssembly
                  jointId="j2"
                  selectedJointId={selectedJointId}
                  hoveredJointId={hoveredJointId}
                  onSelectJoint={onSelectJoint}
                  onHoverJoint={onHoverJoint}
                  jointSpec={jointSpecsMap.j2}
                  currentAngleDeg={jointAnglesDeg.j2}
                  showTechnicalOverlays={showTechnicalOverlays}
                  radius={0.18}
                  length={0.22}
                  explodedOffset={exp}
                  wireframe={wireframe}
                  accentColor="#f59e0b"
                />
              </group>

              {/* Right Upper Arm */}
              <mesh position={[0, -0.28 - exp * 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.11, 0.42, 20]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.88}
                  roughness={0.24}
                  wireframe={wireframe}
                />
              </mesh>

              {/* J3 Right Elbow QDD + Forearm & Hand */}
              <group ref={rElbowRef} position={[0, -0.54 - exp * 0.2, 0]}>
                <group rotation={[0, 0, Math.PI / 2]}>
                  <ActuatorAssembly
                    jointId="j3"
                    selectedJointId={selectedJointId}
                    hoveredJointId={hoveredJointId}
                    onSelectJoint={onSelectJoint}
                    onHoverJoint={onHoverJoint}
                    jointSpec={jointSpecsMap.j3}
                    currentAngleDeg={jointAnglesDeg.j3}
                    showTechnicalOverlays={showTechnicalOverlays}
                    radius={0.15}
                    length={0.18}
                    explodedOffset={exp}
                    wireframe={wireframe}
                    accentColor="#22d3ee"
                  />
                </group>
                <mesh position={[0, -0.24 - exp * 0.1, 0]} castShadow>
                  <cylinderGeometry args={[0.085, 0.095, 0.36, 20]} />
                  <meshStandardMaterial
                    color="#0f172a"
                    metalness={0.75}
                    roughness={0.32}
                    wireframe={wireframe}
                  />
                </mesh>
                {/* Dexterous 12-DOF Hand */}
                <mesh position={[0, -0.46 - exp * 0.15, 0]} castShadow>
                  <boxGeometry args={[0.08, 0.16, 0.12]} />
                  <meshStandardMaterial
                    color="#38bdf8"
                    metalness={0.85}
                    roughness={0.2}
                    wireframe={wireframe}
                  />
                </mesh>
              </group>
            </group>

            {/* J4 Left Shoulder QDD-90 + Left Arm */}
            <group
              ref={lShoulderRef}
              position={[0.46 + exp * 0.22, 0.22, 0]}
            >
              <group rotation={[0, 0, Math.PI / 2]}>
                <ActuatorAssembly
                  jointId="j4"
                  selectedJointId={selectedJointId}
                  hoveredJointId={hoveredJointId}
                  onSelectJoint={onSelectJoint}
                  onHoverJoint={onHoverJoint}
                  jointSpec={jointSpecsMap.j4}
                  currentAngleDeg={jointAnglesDeg.j4}
                  showTechnicalOverlays={showTechnicalOverlays}
                  radius={0.18}
                  length={0.22}
                  explodedOffset={exp}
                  wireframe={wireframe}
                  accentColor="#f59e0b"
                />
              </group>
              <mesh position={[0, -0.28 - exp * 0.1, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.11, 0.42, 20]} />
                <meshStandardMaterial
                  color="#94a3b8"
                  metalness={0.88}
                  roughness={0.24}
                  wireframe={wireframe}
                />
              </mesh>
              <mesh position={[0, -0.62 - exp * 0.18, 0.06]} castShadow>
                <cylinderGeometry args={[0.085, 0.095, 0.38, 20]} />
                <meshStandardMaterial
                  color="#0f172a"
                  metalness={0.75}
                  roughness={0.32}
                  wireframe={wireframe}
                />
              </mesh>
            </group>
          </group>
        </group>

        {/* J5 Left & Right Bipedal Hip QDD-140 Actuators */}
        <group ref={lHipRef} position={[0.2 + exp * 0.12, -0.18, 0]}>
          <group rotation={[0, 0, Math.PI / 2]}>
            <ActuatorAssembly
              jointId="j5"
              selectedJointId={selectedJointId}
              hoveredJointId={hoveredJointId}
              onSelectJoint={onSelectJoint}
              onHoverJoint={onHoverJoint}
              jointSpec={jointSpecsMap.j5}
              currentAngleDeg={jointAnglesDeg.j5}
              showTechnicalOverlays={showTechnicalOverlays}
              radius={0.2}
              length={0.22}
              explodedOffset={exp}
              wireframe={wireframe}
              accentColor="#f59e0b"
            />
          </group>
          {/* Left Femur */}
          <mesh position={[0, -0.32, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.13, 0.48, 20]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.88}
              roughness={0.22}
              wireframe={wireframe}
            />
          </mesh>
          {/* J6 Left Knee QDD-140 */}
          <group ref={lKneeRef} position={[0, -0.58, 0]}>
            <group rotation={[0, 0, Math.PI / 2]}>
              <ActuatorAssembly
                jointId="j6"
                selectedJointId={selectedJointId}
                hoveredJointId={hoveredJointId}
                onSelectJoint={onSelectJoint}
                onHoverJoint={onHoverJoint}
                jointSpec={jointSpecsMap.j6}
                currentAngleDeg={jointAnglesDeg.j6}
                showTechnicalOverlays={showTechnicalOverlays}
                radius={0.18}
                length={0.2}
                explodedOffset={exp}
                wireframe={wireframe}
                accentColor="#10b981"
              />
            </group>
            {/* Left Tibia & Foot */}
            <mesh position={[0, -0.26, 0]} castShadow>
              <cylinderGeometry args={[0.095, 0.11, 0.42, 20]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.8}
                roughness={0.3}
                wireframe={wireframe}
              />
            </mesh>
            <mesh position={[0, -0.48, 0.06]} castShadow receiveShadow>
              <boxGeometry args={[0.18, 0.07, 0.34]} />
              <meshStandardMaterial
                color="#334155"
                metalness={0.85}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        </group>

        {/* Right Leg Assembly */}
        <group ref={rHipRef} position={[-0.2 - exp * 0.12, -0.18, 0]}>
          <group rotation={[0, 0, Math.PI / 2]}>
            <ActuatorAssembly
              jointId="j5"
              selectedJointId={selectedJointId}
              hoveredJointId={hoveredJointId}
              onSelectJoint={onSelectJoint}
              onHoverJoint={onHoverJoint}
              jointSpec={jointSpecsMap.j5}
              currentAngleDeg={jointAnglesDeg.j5}
              showTechnicalOverlays={showTechnicalOverlays}
              radius={0.2}
              length={0.22}
              explodedOffset={exp}
              wireframe={wireframe}
              accentColor="#f59e0b"
            />
          </group>
          <mesh position={[0, -0.32, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.13, 0.48, 20]} />
            <meshStandardMaterial
              color="#cbd5e1"
              metalness={0.88}
              roughness={0.22}
              wireframe={wireframe}
            />
          </mesh>
          <group ref={rKneeRef} position={[0, -0.58, 0]}>
            <group rotation={[0, 0, Math.PI / 2]}>
              <ActuatorAssembly
                jointId="j6"
                selectedJointId={selectedJointId}
                hoveredJointId={hoveredJointId}
                onSelectJoint={onSelectJoint}
                onHoverJoint={onHoverJoint}
                jointSpec={jointSpecsMap.j6}
                currentAngleDeg={jointAnglesDeg.j6}
                showTechnicalOverlays={showTechnicalOverlays}
                radius={0.18}
                length={0.2}
                explodedOffset={exp}
                wireframe={wireframe}
                accentColor="#10b981"
              />
            </group>
            <mesh position={[0, -0.26, 0]} castShadow>
              <cylinderGeometry args={[0.095, 0.11, 0.42, 20]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.8}
                roughness={0.3}
                wireframe={wireframe}
              />
            </mesh>
            <mesh position={[0, -0.48, 0.06]} castShadow receiveShadow>
              <boxGeometry args={[0.18, 0.07, 0.34]} />
              <meshStandardMaterial
                color="#334155"
                metalness={0.85}
                roughness={0.25}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

interface Robot3DViewerProps {
  initialModelId?: ViewerModelId;
  onSelectPlatformId?: (platformId: string) => void;
  compactHeight?: boolean;
}

export const Robot3DViewer: React.FC<Robot3DViewerProps> = ({
  initialModelId = 'kinetix-7-arm',
  onSelectPlatformId,
  compactHeight = false,
}) => {
  const angleSliderId = useId();
  const explodeSliderId = useId();

  const [modelId, setModelId] = useState<ViewerModelId>(initialModelId);
  const [selectedJointId, setSelectedJointId] = useState<string>('j1');
  const [hoveredJointId, setHoveredJointId] = useState<string | null>(null);
  const [isModelHovered, setIsModelHovered] = useState<boolean>(false);
  const [pinAxesAndLimits, setPinAxesAndLimits] = useState<boolean>(false);
  const [autoAnimate, setAutoAnimate] = useState<boolean>(true);
  const [explodedPct, setExplodedPct] = useState<number>(0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);

  // Sync with parent platform selection if it matches Kinetix-7 or Ohm-X1
  useEffect(() => {
    if (initialModelId === 'kinetix-7-arm' || initialModelId === 'ohm-x1') {
      setModelId(initialModelId);
    }
  }, [initialModelId]);

  const activeJoints = useMemo(
    () => (modelId === 'kinetix-7-arm' ? KINETIX_JOINTS : OHM_X1_JOINTS),
    [modelId]
  );

  const jointSpecsMap = useMemo(() => {
    const map: Record<string, JointTelemetrySpec> = {};
    activeJoints.forEach((j) => {
      map[j.id] = j;
    });
    return map;
  }, [activeJoints]);

  const [jointAnglesDeg, setJointAnglesDeg] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    KINETIX_JOINTS.forEach((j) => {
      map[j.id] = j.defaultAngleDeg;
    });
    return map;
  });

  // Reset joint angles to defaults when switching between Kinetix-7 and Ohm-X1
  const handleModelSwitch = (nextModel: ViewerModelId) => {
    setModelId(nextModel);
    const list = nextModel === 'kinetix-7-arm' ? KINETIX_JOINTS : OHM_X1_JOINTS;
    const nextAngles: Record<string, number> = {};
    list.forEach((j) => {
      nextAngles[j.id] = j.defaultAngleDeg;
    });
    setJointAnglesDeg(nextAngles);
    setSelectedJointId('j1');
    setHoveredJointId(null);
    if (onSelectPlatformId) {
      onSelectPlatformId(nextModel);
    }
  };

  // Display hovered joint telemetry in HUD when hovering, otherwise selected joint
  const inspectedJointSpec = useMemo(() => {
    const targetId = hoveredJointId || selectedJointId;
    return activeJoints.find((j) => j.id === targetId) || activeJoints[0];
  }, [activeJoints, hoveredJointId, selectedJointId]);

  const selectedJointSpec = useMemo(
    () => activeJoints.find((j) => j.id === selectedJointId) || activeJoints[0],
    [activeJoints, selectedJointId]
  );

  const currentJointAngle = jointAnglesDeg[selectedJointSpec.id] ?? 0;
  const inspectedJointAngle = jointAnglesDeg[inspectedJointSpec.id] ?? 0;

  // Normalize current angle to [0%, 100%] of the joint's mechanical travel range
  const limitRangePct = useMemo(() => {
    const span = inspectedJointSpec.maxDeg - inspectedJointSpec.minDeg;
    if (span <= 0) return 50;
    return Math.min(
      100,
      Math.max(0, ((inspectedJointAngle - inspectedJointSpec.minDeg) / span) * 100)
    );
  }, [inspectedJointSpec, inspectedJointAngle]);

  const showTechnicalOverlays = isModelHovered || hoveredJointId !== null || pinAxesAndLimits;

  const handleResetPoseAndCamera = () => {
    const nextAngles: Record<string, number> = {};
    activeJoints.forEach((j) => {
      nextAngles[j.id] = j.defaultAngleDeg;
    });
    setJointAnglesDeg(nextAngles);
    setExplodedPct(0);
    setWireframe(false);
    orbitControlsRef.current?.reset();
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-800 bg-[#070A12] overflow-hidden select-none ${
        compactHeight ? 'h-[480px] sm:h-[540px]' : 'h-[540px] sm:h-[620px]'
      }`}
    >
      {/* Top-Left Minimal Spec, Coordinate Axes Legend & Joint Limit Telemetry Badge */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 right-3.5 z-10 flex flex-wrap items-start justify-between gap-2">
        <div className="pointer-events-auto p-3 rounded-xl bg-[#090D18] border border-slate-800 space-y-1.5 max-w-xs sm:max-w-md">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-cyan-400">
            <div className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="uppercase tracking-wider font-semibold">
                {hoveredJointId ? 'HOVER INSPECTING // ' : '3D JOINT INSPECTOR // '}
                {modelId === 'kinetix-7-arm' ? 'KINETIX-7 ARM' : 'OHM-X1 HUMANOID'}
              </span>
            </div>
            {/* Coordinate Frame Legend Pills (X, Y, Z) */}
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-red-950/90 border border-red-500/40 text-red-400 font-bold">
                X
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 font-bold">
                Y
              </span>
              <span className="px-1.5 py-0.5 rounded bg-sky-950/90 border border-sky-500/40 text-sky-300 font-bold">
                Z
              </span>
            </div>
          </div>

          <div className="text-xs sm:text-sm font-bold text-white font-display flex items-center justify-between gap-2">
            <span className="truncate">{inspectedJointSpec.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 shrink-0">
              AXIS: {inspectedJointSpec.rotationAxis}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-mono tabular-nums text-slate-300">
            <span>
              Actuator: <strong className="text-cyan-300">{inspectedJointSpec.actuator}</strong>
            </span>
            <span>
              Torque: <strong className="text-amber-300">{inspectedJointSpec.peakTorque}</strong>
            </span>
            <span>
              R_φ:{' '}
              <strong className="text-emerald-400">{inspectedJointSpec.statorResistance}</strong>
            </span>
          </div>

          {/* Joint Limit Envelope Visualizer Bar */}
          <div className="pt-1 border-t border-slate-800/90 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono tabular-nums">
              <span className="text-amber-400">
                MIN: {inspectedJointSpec.minDeg}°
              </span>
              <span className="text-slate-300">
                TRAVEL ENVELOPE •{' '}
                <strong className="text-emerald-400">θ = {inspectedJointAngle}°</strong>
              </span>
              <span className="text-amber-400">
                MAX: +{inspectedJointSpec.maxDeg}°
              </span>
            </div>
            <div className="relative h-1.5 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              {/* 0° Center Tick */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-600" />
              {/* Current Angle Marker */}
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150"
                style={{ width: `${limitRangePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Model Switcher Pills in Top-Right */}
        <div
          role="group"
          aria-label="Select 3D robot model"
          className="pointer-events-auto inline-flex p-1 rounded-xl bg-[#090D18] border border-slate-800 gap-1"
        >
          <button
            type="button"
            onClick={() => handleModelSwitch('kinetix-7-arm')}
            aria-pressed={modelId === 'kinetix-7-arm'}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              modelId === 'kinetix-7-arm'
                ? 'bg-cyan-400 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Kinetix-7 Arm
          </button>
          <button
            type="button"
            onClick={() => handleModelSwitch('ohm-x1')}
            aria-pressed={modelId === 'ohm-x1'}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              modelId === 'ohm-x1'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Ohm-X1 Humanoid
          </button>
        </div>
      </div>

      {/* Dedicated React Three Fiber WebGL Viewport */}
      <Canvas
        shadows={!IS_SOFTWARE_GL}
        dpr={IS_SOFTWARE_GL ? 1 : [1, 2]}
        camera={{ position: [2.7, 1.35, 3.3], fov: 42, near: 0.1, far: 50 }}
        gl={{
          antialias: !IS_SOFTWARE_GL,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#070A12']} />
        <StudioEnvironmentSetup />

        {/* Balanced 3-Point Studio Lighting Rig + Warm/Cool Contrast */}
        <hemisphereLight args={['#38bdf8', '#090d16', 0.65]} />
        <directionalLight
          position={[4.5, 6.5, 4.0]}
          intensity={2.2}
          color="#fff7ed"
          castShadow={!IS_SOFTWARE_GL}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-4.0, 3.0, -3.5]} intensity={1.1} color="#22d3ee" />
        <pointLight position={[0, 2.5, -2.5]} intensity={0.9} color="#f59e0b" />

        {/* Ground Reference Grid & Contact Shadow Disc */}
        <gridHelper
          args={[8, 24, '#0891b2', '#1e293b']}
          position={[0, -1.35, 0]}
        />
        <mesh
          position={[0, -1.36, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <circleGeometry args={[2.6, 48]} />
          <meshStandardMaterial
            color="#050811"
            roughness={0.85}
            metalness={0.15}
            polygonOffset
            polygonOffsetFactor={1}
          />
        </mesh>

        {/* Active 3D Robot Assembly */}
        {modelId === 'kinetix-7-arm' ? (
          <Kinetix7ArmModel
            modelId={modelId}
            selectedJointId={selectedJointId}
            hoveredJointId={hoveredJointId}
            onSelectJoint={setSelectedJointId}
            onHoverJoint={setHoveredJointId}
            onModelHoverChange={setIsModelHovered}
            showTechnicalOverlays={showTechnicalOverlays}
            jointSpecsMap={jointSpecsMap}
            jointAnglesDeg={jointAnglesDeg}
            autoAnimate={autoAnimate}
            explodedPct={explodedPct}
            wireframe={wireframe}
          />
        ) : (
          <OhmX1HumanoidModel
            modelId={modelId}
            selectedJointId={selectedJointId}
            hoveredJointId={hoveredJointId}
            onSelectJoint={setSelectedJointId}
            onHoverJoint={setHoveredJointId}
            onModelHoverChange={setIsModelHovered}
            showTechnicalOverlays={showTechnicalOverlays}
            jointSpecsMap={jointSpecsMap}
            jointAnglesDeg={jointAnglesDeg}
            autoAnimate={autoAnimate}
            explodedPct={explodedPct}
            wireframe={wireframe}
          />
        )}

        <OrbitControls
          ref={orbitControlsRef}
          enableDamping={!IS_SOFTWARE_GL}
          dampingFactor={0.06}
          minDistance={1.7}
          maxDistance={6.5}
          maxPolarAngle={Math.PI * 0.52}
          target={[0, -0.1, 0]}
        />
      </Canvas>

      {/* Unified Collapsible Bottom Control Dock (Zero Viewport Center Occlusion) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-3xl">
        {/* Collapse / Expand Zen Mode Tab */}
        <div className="flex justify-center mb-1">
          <button
            type="button"
            onClick={() => setDockCollapsed((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#090D18] border border-b-0 border-slate-800 text-[11px] font-mono text-slate-300 hover:text-cyan-300 cursor-pointer"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>Show 3D Joint Controls (Hover Robot for XYZ Axes & Joint Limits)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>Hide Controls (Zen View)</span>
              </>
            )}
          </button>
        </div>

        {!dockCollapsed && (
          <div className="p-3 sm:p-4 rounded-2xl bg-[#090D18] border border-slate-800 shadow-2xl space-y-3">
            {/* Joint Selector Pills + Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                role="group"
                aria-label="Select mechanical joint to inspect"
                className="flex flex-wrap items-center gap-1.5"
              >
                {activeJoints.map((j) => {
                  const active = j.id === selectedJointId;
                  return (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => setSelectedJointId(j.id)}
                      onMouseEnter={() => setHoveredJointId(j.id)}
                      onMouseLeave={() => setHoveredJointId(null)}
                      aria-pressed={active}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                        active
                          ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-semibold'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {j.shortLabel}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPinAxesAndLimits((prev) => !prev)}
                  aria-pressed={pinAxesAndLimits}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono border cursor-pointer ${
                    pinAxesAndLimits || showTechnicalOverlays
                      ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Pin 3D Coordinate Axes (X, Y, Z) and Joint Limit Visualizers ON or auto-show on hover"
                >
                  <Compass className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                  <span>{pinAxesAndLimits ? 'XYZ & Limits: PINNED' : 'XYZ & Limits: HOVER'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAutoAnimate((prev) => !prev)}
                  aria-pressed={autoAnimate}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono border cursor-pointer ${
                    autoAnimate
                      ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {autoAnimate ? (
                    <Pause className="w-3 h-3 text-amber-400" aria-hidden="true" />
                  ) : (
                    <Play className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                  )}
                  <span>{autoAnimate ? 'Sweep: ON' : 'Manual Pose'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWireframe((prev) => !prev)}
                  aria-pressed={wireframe}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono border cursor-pointer ${
                    wireframe
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" aria-hidden="true" />
                  <span>X-Ray Mesh</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetPoseAndCamera}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 cursor-pointer"
                  title="Reset 3D camera and joint angles"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            {/* Sliders for Selected Joint Angle & Exploded Stator View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/90">
              <div>
                <div className="flex justify-between text-[11px] font-mono tabular-nums mb-1">
                  <label htmlFor={angleSliderId} className="text-slate-300 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                    <span>
                      {selectedJointSpec.shortLabel.toUpperCase()} ({selectedJointSpec.minDeg}° to +
                      {selectedJointSpec.maxDeg}°)
                    </span>
                  </label>
                  <span className="text-cyan-300 font-bold">{currentJointAngle}°</span>
                </div>
                <input
                  id={angleSliderId}
                  type="range"
                  min={selectedJointSpec.minDeg}
                  max={selectedJointSpec.maxDeg}
                  value={currentJointAngle}
                  onChange={(e) => {
                    setAutoAnimate(false);
                    const nextVal = Number(e.target.value);
                    setJointAnglesDeg((prev) => ({
                      ...prev,
                      [selectedJointSpec.id]: nextVal,
                    }));
                  }}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono tabular-nums mb-1">
                  <label htmlFor={explodeSliderId} className="text-slate-300">
                    EXPLODED STATOR VIEW (Ω)
                  </label>
                  <span className="text-amber-300 font-bold">{explodedPct}%</span>
                </div>
                <input
                  id={explodeSliderId}
                  type="range"
                  min={0}
                  max={100}
                  value={explodedPct}
                  onChange={(e) => setExplodedPct(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
