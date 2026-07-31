import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CycleSelector } from "./components/CycleSelector";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ModeSelector } from "./components/ModeSelector";
import { StartButton } from "./components/StartButton";
import type { BreathMode } from "./lib/types";
import { cn } from "./lib/utils";
import { layoutVariants } from "./lib/variants";

function App() {
  const { t } = useTranslation();

  const [currentMode, setCurrentMode] = useState<BreathMode>(() => {
    return (localStorage.getItem("breathMode") as BreathMode) || "relax";
  });

  const [cycles, setCycles] = useState<number>(3);
  const [showInfoButton, setShowInfoButton] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem("breathMode", currentMode);
  }, [currentMode]);

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
      <Header
        showInfoButton={showInfoButton}
        onInfoButtonClick={() => setShowInfoButton(false)}
      />

      <main className="relative flex flex-1 flex-col items-center justify-center font-semibold tracking-tight">
        <div className="flex pb-1 text-3xl">
          {t("Select mode")}
        </div>

        <ModeSelector
          currentMode={currentMode}
          onModeChange={setCurrentMode}
        />

        <div className="mt-10 flex items-end gap-2">
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
    </div>
  );
}

export default App;