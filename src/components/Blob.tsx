import { useSpring } from "@react-spring/three";
import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { modeStyles } from "../lib/consts";
import { state } from "../state/state";
import { MagicalMaterialImpl } from "./MagicalMaterial";

const IDLE_SCALE = 3.1;
const IDLE_WOBBLE = 0.15;
const SMALL_SCALE = 2.8;
const LARGE_SCALE = 4.0;
const MATERIAL_OPACITY = 0.6;

export function Blob() {
  const currentMode = state.use((value) => value.currentMode);
  const sessionStage = state.use((value) => value.sessionStage);
  const currentPhase = state.use((value) => value.currentPhase);

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef(
    new MagicalMaterialImpl({
      roughness: 0.19,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4,
      metalness: 0,
      transparent: true,
      opacity: 0,
    })
  );

  const [targetScale, setTargetScale] = useState(IDLE_SCALE);
  const [duration, setDuration] = useState(4000);
  const [rotYTarget, setRotYTarget] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setRotYTarget((prev) => prev + Math.PI * 2);
  }, [currentMode]);

  useEffect(() => {
    if (sessionStage === "idle" || sessionStage === "done") {
      setDuration(4000);
      setTargetScale(IDLE_SCALE);

      let isGrown = false;
      const interval = setInterval(() => {
        isGrown = !isGrown;
        setTargetScale(isGrown ? IDLE_SCALE + IDLE_WOBBLE : IDLE_SCALE);
      }, 4000);

      return () => clearInterval(interval);
    }

    const phaseSeconds = currentPhase ? currentPhase.seconds * 1000 : 3000;
    setDuration(phaseSeconds);

    if (sessionStage === "prepare") {
      setTargetScale(SMALL_SCALE);
    } else if (sessionStage === "active" && currentPhase) {
      setTargetScale(currentPhase.label === "inhale" ? LARGE_SCALE : SMALL_SCALE);
    }
  }, [sessionStage, currentPhase]);

  const color = new THREE.Color(modeStyles[currentMode].hex);
  const { r, g, b, rotY, scale, opacity } = useSpring({
    from: { opacity: 0 },
    r: color.r,
    g: color.g,
    b: color.b,
    rotY: rotYTarget,
    scale: targetScale,
    opacity: MATERIAL_OPACITY,
    config: (key) => {
      if (key === "scale") {
        return { duration, easing: (t) => (1 - Math.cos(t * Math.PI)) / 2 };
      }
      if (key === "opacity") {
        return { duration: 1000, easing: (t) => t };
      }
      return { tension: 45, friction: 22 };
    },
  });

  useFrame((_, delta) => {
    const mat = materialRef.current;
    mat.time += delta * mat.speed;
    mat.surfaceTime += delta * mat.surfaceSpeed;
    mat.color.setRGB(r.get(), g.get(), b.get());
    mat.opacity = opacity.get();

    if (meshRef.current) {
      meshRef.current.rotation.y = rotY.get();
      meshRef.current.scale.setScalar(scale.get());
    }
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