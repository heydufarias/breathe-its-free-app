import { useSpring } from "@react-spring/three";
import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { BreathPhase } from "../lib/breathingPatterns";
import type { SessionStage } from "../lib/types";
import { MagicalMaterialImpl } from "./MagicalMaterial";

const IDLE_SCALE = 3.1;
const IDLE_WOBBLE = 0.15;
const SMALL_SCALE = 2.8;
const LARGE_SCALE = 4.0;

interface BlobProps {
  color: string;
  rotYTarget: number;
  sessionStage: SessionStage;
  currentPhase?: BreathPhase;
}

export function Blob({ color, rotYTarget, sessionStage, currentPhase }: BlobProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef(
    new MagicalMaterialImpl({
      roughness: 0.19,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4,
      metalness: 0,
      transparent: true,
      opacity: 0.6,
    })
  );

  const [targetScale, setTargetScale] = useState(IDLE_SCALE);
  const [duration, setDuration] = useState(4000);

  useEffect(() => {
    if (sessionStage === "idle" || sessionStage === "done") {
      setDuration(4000);
      let grown = false;

      const interval = setInterval(() => {
        grown = !grown;
        setTargetScale(grown ? IDLE_SCALE + IDLE_WOBBLE : IDLE_SCALE);
      }, 4000);

      setTargetScale(IDLE_SCALE);

      return () => clearInterval(interval);
    }

    if (sessionStage === "prepare") {
      setTargetScale(SMALL_SCALE);
      setDuration(currentPhase ? currentPhase.seconds * 1000 : 3000);
      return;
    }

    if (sessionStage === "active" && currentPhase) {
      setDuration(currentPhase.seconds * 1000);

      if (currentPhase.label === "inhale") {
        setTargetScale(LARGE_SCALE);
      } else if (currentPhase.label === "exhale") {
        setTargetScale(SMALL_SCALE);
      }
    }
  }, [sessionStage, currentPhase]);

  const c = new THREE.Color(color);
  const { r, g, b, rotY, scale } = useSpring({
    r: c.r,
    g: c.g,
    b: c.b,
    rotY: rotYTarget,
    scale: targetScale,
    config: (key) => {
      if (key === "scale") {
        return {
          duration,
          easing: (t) => (1 - Math.cos(t * Math.PI)) / 2,
        };
      }
      return { tension: 45, friction: 22 };
    },
  });

  useFrame((_, delta) => {
    const mat = materialRef.current;
    mat.time += delta * mat.speed;
    mat.surfaceTime += delta * mat.surfaceSpeed;
    mat.color.setRGB(r.get(), g.get(), b.get());

    if (!meshRef.current) return;
    meshRef.current.rotation.y = rotY.get();
    meshRef.current.scale.setScalar(scale.get());
  });

  return (
    <>
      <Environment preset="studio" background={false} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 256, 256]} />
        <primitive object={materialRef.current} attach="material" />
      </mesh>
    </>
  );
}