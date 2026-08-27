import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Blob } from "./components/Blob";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { Session } from "./components/Session";
import { breathingPatterns, preparePhase } from "./lib/breathingPatterns";
import type { BreathMode, SessionStage } from "./lib/types";
import { cn } from "./lib/utils";
import { layoutVariants } from "./lib/variants";
import { modeColor } from "./lib/consts";

function App() {
  const [currentMode, setCurrentMode] = useState<BreathMode>(() => {
    return (localStorage.getItem("breathMode") as BreathMode) || "relax";
  });
  const [cycles, setCycles] = useState<number>(3);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [sessionStage, setSessionStage] = useState<SessionStage>("idle");

  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const rotYRef = useRef(0);
  const [rotYTarget, setRotYTarget] = useState(0);

  const isSessionActive = sessionStage !== "idle";
  const activePhases = breathingPatterns[currentMode];
  const currentPhase =
    sessionStage === "prepare" ? preparePhase : activePhases[phaseIndex];

  useEffect(() => {
    localStorage.setItem("breathMode", currentMode);
  }, [currentMode]);

  useEffect(() => {
    if (!isSessionActive || !currentPhase) {
      return;
    }

    const timeout = setTimeout(() => {
      if (secondsLeft > 1) {
        setSecondsLeft((seconds) => seconds - 1);
        return;
      }

      if (sessionStage === "prepare") {
        setCurrentCycle(1);
        setPhaseIndex(0);
        setSecondsLeft(activePhases[0].seconds);
        setSessionStage("active");
        return;
      }

      const nextPhaseIndex = phaseIndex + 1;

      if (nextPhaseIndex < activePhases.length) {
        setPhaseIndex(nextPhaseIndex);
        setSecondsLeft(activePhases[nextPhaseIndex].seconds);
        return;
      }

      const nextCycle = currentCycle + 1;

      if (nextCycle <= cycles) {
        setCurrentCycle(nextCycle);
        setPhaseIndex(0);
        setSecondsLeft(activePhases[0].seconds);
        return;
      }

      setSessionStage("done");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [
    sessionStage,
    secondsLeft,
    phaseIndex,
    currentCycle,
    cycles,
    activePhases,
    currentPhase,
    isSessionActive,
  ]);

  useEffect(() => {
    if (sessionStage !== "done") {
      return;
    }

    const timeout = setTimeout(() => {
      setSessionStage("idle");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [sessionStage]);

  function onInfoButtonClick() {
    setShowInfo(true);
  }

  function onInfoClose() {
    setShowInfo(false);
  }

  function decreaseCycle() {
    if (cycles <= 3) {
      return;
    }
    setCycles((value) => value - 1);
  }

  function increaseCycle() {
    if (cycles >= 9) {
      return;
    }
    setCycles((value) => value + 1);
  }

  function onModeChange(mode: BreathMode) {
    setCurrentMode(mode);
    rotYRef.current += Math.PI * 2;
    setRotYTarget(rotYRef.current);
  }

  function onStartButtonClick() {
    setIsTransitioning(true);
    setCurrentCycle(1);
    setPhaseIndex(0);
    setSecondsLeft(preparePhase.seconds);
    setSessionStage("prepare");

    setTimeout(() => setIsTransitioning(false), 500);
  }

  function onFinishButtonClick() {
    setIsTransitioning(true);
    setSessionStage("idle");
    setCurrentCycle(1);
    setPhaseIndex(0);
    setSecondsLeft(0);

    setTimeout(() => setIsTransitioning(false), 500);
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-dvh w-screen overflow-hidden font-helvetica",
        layoutVariants({ mode: currentMode })
      )}
    >
      <Header
        showInfoButton={!isSessionActive}
        onInfoButtonClick={onInfoButtonClick}
      />

      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="relative w-[98vmin] max-w-[640px] aspect-square translate-y-8">
          <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 22], fov: 30 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[75, 75, 5]} intensity={0.8} />
            <directionalLight position={[-5, -5, 2]} intensity={1.8} />
            <Blob
              color={modeColor[currentMode]}
              rotYTarget={rotYTarget}
              sessionStage={sessionStage}
              currentPhase={currentPhase}
            />
          </Canvas>
        </div>
      </div>

      <Session
        currentMode={currentMode}
        onModeChange={onModeChange}
        cycles={cycles}
        currentCycle={currentCycle}
        onDecreaseCycle={decreaseCycle}
        onIncreaseCycle={increaseCycle}
        sessionStage={sessionStage}
        currentPhase={currentPhase}
        phaseIndex={phaseIndex}
        secondsLeft={secondsLeft}
        isTransitioning={isTransitioning}
        onStart={onStartButtonClick}
        onFinish={onFinishButtonClick}
      />

      <Footer />

      <AnimatePresence>
        {showInfo && <Info onClose={onInfoClose} />}
      </AnimatePresence>
    </div>
  );
}

export default App;