import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { CycleSelector } from "./components/CycleSelector";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { ModeSelector } from "./components/ModeSelector";
import { MainButton } from "./components/MainButton";
import { Fade } from "./components/Fade";
import type { BreathMode } from "./lib/types";
import { cn } from "./lib/utils";
import { layoutVariants, solidBgVariants } from "./lib/variants";

function App() {
  const { t } = useTranslation();

  const [currentMode, setCurrentMode] = useState<BreathMode>(() => {
    return (localStorage.getItem("breathMode") as BreathMode) || "relax";
  });

  const [cycles, setCycles] = useState<number>(3);
  const [remainingCycles, setRemainingCycles] = useState<number>(1);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("breathMode", currentMode);
  }, [currentMode]);

  function onInfoButtonClick() {
    setShowInfo(true);
  }

  function onInfoClose() {
    setShowInfo(false);
  }

  function decreaseCycle() {
    if (cycles <= 3) return;
    setCycles(cycles - 1);
  }

  function increaseCycle() {
    if (cycles >= 9) return;
    setCycles(cycles + 1);
  }

  function onStartButtonClick() {
    setIsSessionActive(true);
    setRemainingCycles(1);
  }
  function onFinishButtonClick() {
    // setRemainingCycles(cycles);
    setIsSessionActive(false);
    // setShowInfoButton(false);
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-dvh w-screen overflow-hidden font-helvetica",
        layoutVariants({ mode: currentMode })
      )}
    >
      <>
        <Header
          showInfoButton={!isSessionActive}
          onInfoButtonClick={onInfoButtonClick}
        />

        <main className="relative flex-1 tracking-tight">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "w-[55vmin] max-w-80 rounded-full aspect-square",
                solidBgVariants({ mode: currentMode })
              )}
            />
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
              remainingCycles={remainingCycles}
            />
          </div>
        </main>

        <Footer />
      </>
      <AnimatePresence>
        {showInfo && <Info onClose={onInfoClose} />}
      </AnimatePresence>
    </div>
  );
}

export default App;