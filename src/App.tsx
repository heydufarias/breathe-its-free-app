import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { CycleSelector } from "./components/CycleSelector";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { ModeSelector } from "./components/ModeSelector";
import { StartButton } from "./components/StartButton";
import type { BreathMode } from "./lib/types";
import { cn } from "./lib/utils";
import { layoutVariants, solidBgVariants } from "./lib/variants";

function App() {
  const { t } = useTranslation();

  const [currentMode, setCurrentMode] = useState<BreathMode>(() => {
    return (localStorage.getItem("breathMode") as BreathMode) || "relax";
  });

  const [cycles, setCycles] = useState<number>(3);
  const [showInfoButton, setShowInfoButton] = useState<boolean>(true);
  const [showInfo, setShowInfo] = useState<boolean>(false);

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

  return (
    <div
      className={cn(
        "relative flex h-dvh w-screen flex-col overflow-hidden font-helvetica",
        layoutVariants({ mode: currentMode })
      )}
    >
      <>
        <Header
          showInfoButton={showInfoButton}
          onInfoButtonClick={onInfoButtonClick}
        />

        <main className="relative flex-1 font-semibold tracking-tight">
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "aspect-square w-[55vmin] max-w-80 rounded-full",
                solidBgVariants({ mode: currentMode })
              )}
            />
          </div>

          <div className="absolute left-1/2 top-28 z-10 flex w-full max-w-[488px] -translate-x-1/2 flex-col items-center px-5 sm:px-0">
            <div className="flex pb-1 text-3xl">
              {t("Select mode")}
            </div>

            <ModeSelector
              currentMode={currentMode}
              onModeChange={setCurrentMode}
            />
          </div>

          <div className="absolute bottom-16 left-1/2 z-10 flex w-full max-w-122 -translate-x-1/2 items-end gap-2 px-5 sm:px-0">
            <StartButton
              currentMode={currentMode}
              onStart={() => { }}
            />

            <CycleSelector
              currentMode={currentMode}
              cycles={cycles}
              onDecrease={decreaseCycle}
              onIncrease={increaseCycle}
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