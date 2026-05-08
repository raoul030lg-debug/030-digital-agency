"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";

const ACCENT = "#b8935a";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handle = () => setIsMobile(mq.matches);
    handle();
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);
  return isMobile;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type BuildingType = "A" | "B" | "C" | "D" | "E";
type Layer = "fore" | "mid" | "back";

type Building = {
  id: number;
  type: BuildingType;
  layer: Layer;
  position: [number, number]; // x, z
  width: number;
  depth: number;
  height: number;
  rotation: number;
  penthouseSide: 1 | -1;
  hasLimePulse: boolean;
  pulseSide: 1 | -1;
  pulsePhase: number;
};

function generateSkyline(): Building[] {
  const rng = mulberry32(42);
  const buildings: Building[] = [];
  const layers: Array<{
    name: Layer;
    zMin: number;
    zMax: number;
    count: number;
    xSpread: number;
    hMin: number;
    hMax: number;
  }> = [
    { name: "back", zMin: -7, zMax: -4, count: 5, xSpread: 8.4, hMin: 1.4, hMax: 3.6 },
    { name: "mid", zMin: -3, zMax: -1, count: 7, xSpread: 7.4, hMin: 1.8, hMax: 6.4 },
    { name: "fore", zMin: 0, zMax: 2, count: 6, xSpread: 6.6, hMin: 1.6, hMax: 5.2 },
  ];

  let id = 0;
  for (const layer of layers) {
    for (let i = 0; i < layer.count; i++) {
      const t = layer.count > 1 ? i / (layer.count - 1) : 0.5;
      const x = (t - 0.5) * layer.xSpread + (rng() - 0.5) * 0.7;
      const z = layer.zMin + rng() * (layer.zMax - layer.zMin);

      const r = rng();
      let type: BuildingType;
      if (r < 0.1) type = "E";
      else if (r < 0.27) type = "C";
      else if (r < 0.45) type = "D";
      else if (r < 0.7) type = "B";
      else type = "A";

      // Background layer: avoid tall thin glass towers (would look out of place)
      if (layer.name === "back" && type === "E") type = "A";

      let w: number, d: number, h: number;
      if (type === "E") {
        w = 0.36 + rng() * 0.18;
        d = w * (0.85 + rng() * 0.35);
        h = layer.hMax * (0.92 + rng() * 0.2);
      } else if (type === "C") {
        w = 0.5 + rng() * 0.55;
        d = 0.5 + rng() * 0.55;
        h = layer.hMin + 0.6 + rng() * (layer.hMax - layer.hMin - 0.6);
      } else {
        w = 0.5 + rng() * 0.75;
        d = 0.5 + rng() * 0.75;
        h = layer.hMin + Math.pow(rng(), 1.25) * (layer.hMax - layer.hMin);
      }

      buildings.push({
        id: id++,
        type,
        layer: layer.name,
        position: [x, z],
        width: w,
        depth: d,
        height: h,
        rotation: (rng() - 0.5) * 0.18,
        penthouseSide: rng() > 0.5 ? 1 : -1,
        hasLimePulse: false,
        pulseSide: rng() > 0.5 ? 1 : -1,
        pulsePhase: rng() * Math.PI * 2,
      });
    }
  }

  // Flag exactly two foreground/midground buildings for lime pulse
  const candidates = buildings.filter(
    (b) => (b.layer === "fore" || b.layer === "mid") && b.height > 2.4,
  );
  const pulseIndexes = [
    Math.floor(rng() * candidates.length),
    Math.floor(rng() * candidates.length),
  ];
  if (pulseIndexes[0] === pulseIndexes[1] && candidates.length > 1) {
    pulseIndexes[1] = (pulseIndexes[0] + 1) % candidates.length;
  }
  pulseIndexes.forEach((idx) => {
    if (candidates[idx]) candidates[idx].hasLimePulse = true;
  });

  return buildings;
}

const BUILDINGS = generateSkyline();

function BuildingsGroup({
  materials,
  castShadows,
}: {
  materials: Record<Layer, THREE.Material>;
  castShadows: boolean;
}) {
  return (
    <group>
      {BUILDINGS.map((b) => (
        <BuildingItem
          key={b.id}
          building={b}
          material={materials[b.layer]}
          castShadow={castShadows}
        />
      ))}
    </group>
  );
}

function BuildingItem({
  building: b,
  material,
  castShadow,
}: {
  building: Building;
  material: THREE.Material;
  castShadow: boolean;
}) {
  const [x, z] = b.position;

  return (
    <group position={[x, 0, z]} rotation={[0, b.rotation, 0]}>
      {b.type === "D" ? (
        <>
          <mesh
            position={[0, (b.height * 0.62) / 2, 0]}
            material={material}
            castShadow={castShadow}
            receiveShadow={castShadow}
          >
            <boxGeometry args={[b.width, b.height * 0.62, b.depth]} />
          </mesh>
          <mesh
            position={[0, b.height * 0.62 + (b.height * 0.38) / 2, 0]}
            material={material}
            castShadow={castShadow}
          >
            <boxGeometry args={[b.width * 0.72, b.height * 0.38, b.depth * 0.72]} />
          </mesh>
        </>
      ) : (
        <mesh
          position={[0, b.height / 2, 0]}
          material={material}
          castShadow={castShadow}
          receiveShadow={castShadow}
        >
          <boxGeometry args={[b.width, b.height, b.depth]} />
        </mesh>
      )}

      {b.type === "B" && (
        <mesh
          position={[b.penthouseSide * b.width * 0.18, b.height + 0.18, 0]}
          material={material}
          castShadow={castShadow}
        >
          <boxGeometry args={[b.width * 0.46, 0.36, b.depth * 0.55]} />
        </mesh>
      )}

      {b.type === "C" && (
        <>
          <mesh position={[0, b.height + 0.4, 0]} material={material}>
            <cylinderGeometry args={[0.035, 0.06, 0.78, 8]} />
          </mesh>
          <mesh position={[0, b.height + 0.86, 0]} material={material}>
            <coneGeometry args={[0.022, 0.22, 6]} />
          </mesh>
        </>
      )}

      {/* Type E: glass tower with subtle lime accent stripe */}
      {b.type === "E" && (
        <mesh
          position={[
            (b.width / 2 + 0.001) * (b.penthouseSide === 1 ? 1 : -1),
            b.height * 0.55,
            0,
          ]}
          rotation={[0, b.penthouseSide === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.018, b.height * 0.5]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.18} toneMapped={false} />
        </mesh>
      )}

      {b.hasLimePulse && (
        <LimePulse
          position={[
            (b.width / 2 + 0.002) * b.pulseSide,
            b.height * 0.62,
            0,
          ]}
          side={b.pulseSide}
          phase={b.pulsePhase}
        />
      )}
    </group>
  );
}

function LimePulse({
  position,
  side,
  phase,
}: {
  position: [number, number, number];
  side: 1 | -1;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // 4-second cycle, 0 → 0.6 → 0
    const o = (Math.sin(t * ((Math.PI * 2) / 4) + phase) * 0.5 + 0.5) * 0.6;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = o;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={[0, (side * Math.PI) / 2, 0]}
    >
      <planeGeometry args={[0.07, 0.07]} />
      <meshBasicMaterial color={ACCENT} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

function Fernsehturm({
  material,
  castShadow,
}: {
  material: THREE.Material;
  castShadow: boolean;
}) {
  return (
    <group position={[1.4, 0, -0.5]}>
      <mesh position={[0, 1.6, 0]} material={material} castShadow={castShadow}>
        <cylinderGeometry args={[0.05, 0.07, 3.2, 14]} />
      </mesh>
      <mesh position={[0, 3.45, 0]} material={material} castShadow={castShadow}>
        <sphereGeometry args={[0.24, 24, 18]} />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <sphereGeometry args={[0.255, 24, 18]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.05}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 3.92, 0]} material={material}>
        <coneGeometry args={[0.028, 0.5, 8]} />
      </mesh>
    </group>
  );
}

function GradientBackdrop() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTop: { value: new THREE.Color("#fcfcfa") },
        uBottom: { value: new THREE.Color("#f4f0e5") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTop;
        uniform vec3 uBottom;
        varying vec2 vUv;
        void main() {
          float y = smoothstep(0.0, 1.0, vUv.y);
          vec3 col = mix(uBottom, uTop, y);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <mesh ref={mesh} position={[0, 4, -11]} material={material}>
      <planeGeometry args={[44, 22]} />
    </mesh>
  );
}

function Particles({
  count,
  reduced,
  isMobile,
}: {
  count: number;
  reduced: boolean;
  isMobile: boolean;
}) {
  const ref = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const xJitter = new Float32Array(count);
    const rng = mulberry32(101);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rng() - 0.5) * 14;
      positions[i * 3 + 1] = 0.4 + rng() * 5.5;
      positions[i * 3 + 2] = (rng() - 0.5) * 8 - 1.5;
      speeds[i] = 0.04 + rng() * 0.08;
      phases[i] = rng() * Math.PI * 2;
      xJitter[i] = 0.4 + rng() * 0.6;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry, speeds, phases, xJitter };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#ffffff",
        size: 0.045,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        fog: true,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      data.geometry.dispose();
      material.dispose();
    };
  }, [data.geometry, material]);

  useFrame((state, delta) => {
    if (reduced || !ref.current) return;
    const t = state.clock.elapsedTime;
    const attr = ref.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      // gentle X swing
      arr[i * 3] += Math.sin(t * 0.25 + data.phases[i]) * data.xJitter[i] * dt * 0.08;
      // upward Y drift
      arr[i * 3 + 1] += data.speeds[i] * dt * 0.4;
      // wrap
      if (arr[i * 3 + 1] > 6.2) {
        arr[i * 3 + 1] = 0.2;
        arr[i * 3] = (Math.sin(t + i) * 0.5) * 14;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <points
      ref={ref}
      geometry={data.geometry}
      material={material}
      frustumCulled={false}
    />
  );
}

function Lights({ shadows }: { shadows: boolean }) {
  return (
    <>
      <ambientLight intensity={0.42} color="#fffaf0" />
      <hemisphereLight args={["#fff7e8", "#dfd8c4", 0.55]} />
      <directionalLight
        position={[6, 10, 4]}
        intensity={1.25}
        color="#fff5e0"
        castShadow={shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={28}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-6}
        shadow-bias={0}
        shadow-normalBias={0.02}
        shadow-radius={6}
        shadow-blurSamples={12}
      />
      <directionalLight
        position={[-5, 4, -3]}
        intensity={0.32}
        color="#e8efff"
      />
      <pointLight
        position={[3.5, 4, 2.5]}
        intensity={0.28}
        distance={8}
        decay={2}
        color={ACCENT}
      />
    </>
  );
}

type CameraTarget = {
  yaw: number;
  pitch: number;
  yDrift: number;
  yawTarget: number;
  pitchTarget: number;
  lastInteraction: number;
};

function CameraController({
  state,
  reduced,
}: {
  state: RefObject<CameraTarget>;
  reduced: boolean;
}) {
  const { camera } = useThree();
  const radius = 6.8;
  const baseYaw = 0.67;
  const basePitch = 0.26;
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.9, 0), []);

  useFrame((_, delta) => {
    const s = state.current;
    if (!s) return;
    const now = performance.now();
    const idle = now - s.lastInteraction > 3000;

    let yawTarget = s.yawTarget;
    let pitchTarget = s.pitchTarget;
    let yDriftTarget = 0;

    if (idle && !reduced) {
      const t = (now - s.lastInteraction - 3000) / 1000;
      // Lissajous: two sin with different frequencies, plus subtle Y-drift
      yawTarget = Math.sin(t * 0.18) * 0.08 + Math.sin(t * 0.27) * 0.025;
      pitchTarget = Math.sin(t * 0.21) * 0.045;
      yDriftTarget = Math.sin(t * 0.13) * 0.28;
    }

    // Smoother damping (lower factor = slower, more cinematic)
    const k = 1 - Math.exp(-delta * 2.6);
    s.yaw += (yawTarget - s.yaw) * k;
    s.pitch += (pitchTarget - s.pitch) * k;
    s.yDrift += (yDriftTarget - s.yDrift) * k;

    const phi = clamp(Math.PI / 2 - basePitch - s.pitch, 0.1, Math.PI - 0.1);
    const theta = baseYaw + s.yaw;

    camera.position.set(
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi) + s.yDrift,
      radius * Math.sin(phi) * Math.cos(theta),
    );
    camera.lookAt(lookTarget);
  });

  return null;
}

function Scene({
  reduced,
  isMobile,
  cameraState,
}: {
  reduced: boolean;
  isMobile: boolean;
  cameraState: RefObject<CameraTarget>;
}) {
  const shadows = !isMobile && !reduced;

  const materials = useMemo<Record<Layer, THREE.Material>>(
    () => ({
      fore: new THREE.MeshStandardMaterial({
        color: "#0c0c0c",
        roughness: 0.86,
        metalness: 0.0,
      }),
      mid: new THREE.MeshStandardMaterial({
        color: "#1f1f1f",
        roughness: 0.84,
        metalness: 0.0,
      }),
      back: new THREE.MeshStandardMaterial({
        color: "#2d2d2d",
        roughness: 0.92,
        metalness: 0.0,
      }),
    }),
    [],
  );

  const groundMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ece8dc",
        roughness: 0.96,
        metalness: 0.0,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
      groundMaterial.dispose();
    };
  }, [materials, groundMaterial]);

  const particleCount = isMobile ? 15 : 42;

  return (
    <>
      <fog attach="fog" args={["#fafaf7", 5, 24]} />

      <GradientBackdrop />

      <Lights shadows={shadows} />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        material={groundMaterial}
        receiveShadow={shadows}
      >
        <planeGeometry args={[40, 40]} />
      </mesh>

      <BuildingsGroup materials={materials} castShadows={shadows} />
      <Fernsehturm material={materials.fore} castShadow={shadows} />

      {!reduced && (
        <Particles count={particleCount} reduced={reduced} isMobile={isMobile} />
      )}

      <CameraController state={cameraState} reduced={reduced} />
    </>
  );
}

type HeroSkyline3DProps = {
  variant?: "card" | "ambient";
};

export default function HeroSkyline3D({
  variant = "card",
}: HeroSkyline3DProps) {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const ambient = variant === "ambient";

  const cameraState = useRef<CameraTarget>({
    yaw: 0,
    pitch: 0,
    yDrift: 0,
    yawTarget: 0,
    pitchTarget: 0,
    lastInteraction: 0,
  });

  const dragState = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startYaw: 0,
    startPitch: 0,
    pointerId: null as number | null,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current.active = true;
    dragState.current.startX = e.clientX;
    dragState.current.startY = e.clientY;
    dragState.current.startYaw = cameraState.current.yawTarget;
    dragState.current.startPitch = cameraState.current.pitchTarget;
    dragState.current.pointerId = e.pointerId;
    cameraState.current.lastInteraction = performance.now();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignored — some browsers dislike capture on synthetic events
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const yawMax = (45 * Math.PI) / 180;
    const pitchMax = (15 * Math.PI) / 180;
    const sensitivity = reduced ? 0.0025 : 0.005;
    cameraState.current.yawTarget = clamp(
      dragState.current.startYaw + dx * sensitivity,
      -yawMax,
      yawMax,
    );
    cameraState.current.pitchTarget = clamp(
      dragState.current.startPitch + dy * sensitivity,
      -pitchMax,
      pitchMax,
    );
    cameraState.current.lastInteraction = performance.now();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== null) {
      try {
        e.currentTarget.releasePointerCapture(dragState.current.pointerId);
      } catch {
        // ignored
      }
    }
    dragState.current.active = false;
    dragState.current.pointerId = null;
    cameraState.current.lastInteraction = performance.now();
  };

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: ambient ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: ambient ? 0.3 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={
        ambient
          ? "relative h-full w-full overflow-hidden"
          : "relative w-full overflow-hidden rounded-2xl border aspect-square lg:aspect-[4/5] bg-[linear-gradient(180deg,#fafaf7_0%,#f4f0e6_55%,#eee8d8_100%)]"
      }
      style={ambient ? undefined : { borderColor: "var(--color-border-subtle)" }}
    >
      <div
        role="img"
        aria-label="Interaktive 3D-Skyline von Berlin — ziehen zum Bewegen"
        className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Canvas
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          gl={{
            antialias: !isMobile,
            powerPreference: "high-performance",
            alpha: true,
          }}
          shadows={
            isMobile || reduced
              ? false
              : { type: THREE.VSMShadowMap, enabled: true }
          }
          camera={{ position: [4, 2, 5], fov: 50, near: 0.1, far: 100 }}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <Scene
              reduced={reduced}
              isMobile={isMobile}
              cameraState={cameraState}
            />
          </Suspense>
        </Canvas>
      </div>

      {!ambient && (
        <>
          <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-mono">
              Skyline
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
              ← drag · move →
            </span>
          </div>
        </>
      )}
    </motion.div>
  );
}
