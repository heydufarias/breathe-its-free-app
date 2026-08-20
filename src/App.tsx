import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CycleSelector } from "./components/CycleSelector";
import { Fade } from "./components/Fade";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { MainButton } from "./components/MainButton";
import { ModeSelector } from "./components/ModeSelector";
import { breathingPatterns, preparePhase } from "./lib/breathingPatterns";
import type { BreathMode, SessionStage } from "./lib/types";
import { cn } from "./lib/utils";
import { layoutVariants, solidBgVariants } from "./lib/variants";

function App() {
  const { t } = useTranslation();

  // currentMode: Selected breathing mode (relax, focus, sleep)
  // cycles: Total cycles configured for the session
  // showInfo: Controls info modal visibility
  // sessionStage: Global session state (idle, prepare, active, done)
  // currentCycle: Current active cycle iteration
  // phaseIndex: Current step index within the active pattern
  // secondsLeft: Seconds remaining for the current phase
  // isSessionActive: True if a session is currently running
  // activePhases: Array of breathing phases for the selected mode
  // currentPhase: Current phase object (label and duration)

  const [currentMode, setCurrentMode] = useState<BreathMode>(() => {
    return (localStorage.getItem("breathMode") as BreathMode) || "relax";
  });
  const [cycles, setCycles] = useState<number>(3);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [sessionStage, setSessionStage] = useState<SessionStage>("idle");

  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const isSessionActive = sessionStage !== "idle";
  const activePhases = breathingPatterns[currentMode];
  const currentPhase = sessionStage === "prepare" ? preparePhase : activePhases[phaseIndex];

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

  function onStartButtonClick() {
    setCurrentCycle(1);
    setPhaseIndex(0);
    setSecondsLeft(preparePhase.seconds);
    setSessionStage("prepare");
  }

  function onFinishButtonClick() {
    setSessionStage("idle");
    setCurrentCycle(1);
    setPhaseIndex(0);
    setSecondsLeft(0);
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

      <main className="relative flex-1 tracking-tight">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "relative flex items-center justify-center w-[55vmin] max-w-80 rounded-full aspect-square",
              solidBgVariants({ mode: currentMode })
            )}
          >
            {(sessionStage === "prepare" || sessionStage === "active") && currentPhase && (
              <div className="flex flex-col items-center text-white">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${sessionStage}-${phaseIndex}-${currentPhase.label}`}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeIn",
                    }}
                    className="text-[4.5rem] tracking-[-0.2rem] leading-8"
                  >
                    {t(`session.phases.${currentPhase.label}`)}
                  </motion.span>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={secondsLeft}
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.38,
                      ease: "easeIn",
                    }}
                    className="text-[5rem]"
                  >
                    {secondsLeft}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}

            {sessionStage === "done" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="text-[3rem] tracking-tighter leading-7 text-white text-center"
              >
                {t(`session.done.${currentMode}`)}
              </motion.span>
            )}
          </motion.div>
        </div>

        <Fade visible={!isSessionActive} duration={0.5}>
          <div className="absolute top-28 left-1/2 flex flex-col w-full max-w-122 items-center px-5 sm:px-0 -translate-x-1/2 z-10">
            <div className="flex text-3xl">
              {t("Select mode")}
            </div>

            <ModeSelector
              currentMode={currentMode}
              onModeChange={setCurrentMode}
            />
          </div>
        </Fade>

        <Fade visible={isSessionActive} duration={2}>
          <div className="absolute top-36 left-1/2 flex flex-col w-full max-w-122 items-center px-5 sm:px-0 -translate-x-1/2 z-10">
            <div className="flex text-5xl tracking-tight">
              {t("Let's start.")}
            </div>
          </div>
        </Fade>

        <div className="absolute bottom-16 left-1/2 flex w-full max-w-122 items-end px-5 sm:px-0 gap-2 -translate-x-1/2 z-10">
          <MainButton
            currentMode={currentMode}
            onStart={onStartButtonClick}
            onFinish={onFinishButtonClick}
            isSessionActive={isSessionActive}
          />

          <CycleSelector
            currentMode={currentMode}
            cycles={cycles}
            onDecrease={decreaseCycle}
            onIncrease={increaseCycle}
            isSessionActive={isSessionActive}
            currentCycle={currentCycle}
          />
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {showInfo && <Info onClose={onInfoClose} />}
      </AnimatePresence>
    </div>
  );
}

export default App;