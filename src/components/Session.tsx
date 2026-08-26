import { AnimatePresence, motion } from "framer-motion";
import { CycleSelector } from "./CycleSelector";
import { Fade } from "./Fade";
import { MainButton } from "./MainButton";
import { ModeSelector } from "./ModeSelector";
import type { BreathMode, BreathPhaseLabel, SessionStage } from "../lib/types";
import { cn } from "../lib/utils";
import { solidBgVariants } from "../lib/variants";

interface SessionProps {
  currentMode: BreathMode;
  onModeChange: (mode: BreathMode) => void;
  cycles: number;
  currentCycle: number;
  onDecreaseCycle: () => void;
  onIncreaseCycle: () => void;
  sessionStage: SessionStage;
  phaseLabel?: BreathPhaseLabel;
  phaseIndex: number;
  secondsLeft: number;
  isTransitioning: boolean;
  onStart: () => void;
  onFinish: () => void;
}

const phaseText: Record<BreathPhaseLabel, string> = {
  inhale: "Puxe o ar",
  hold: "Segure",
  exhale: "Solte o ar",
};

const doneText: Record<BreathMode, string> = {
  relax: "Mente relaxada.",
  focus: "Foco recuperado.",
  sleep: "Sono tranquilo.",
};

export function Session({
  currentMode,
  onModeChange,
  cycles,
  currentCycle,
  onDecreaseCycle,
  onIncreaseCycle,
  sessionStage,
  phaseLabel,
  phaseIndex,
  secondsLeft,
  isTransitioning,
  onStart,
  onFinish,
}: SessionProps) {
  const isSessionActive = sessionStage !== "idle";

  function renderCircleContent() {
    if (sessionStage === "prepare") {
      return (
        <motion.div
          key="prepare"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex items-center justify-center w-full h-full text-white"
        >
          <AnimatePresence mode="wait">
            {secondsLeft <= 3 && (
              <motion.span
                key={secondsLeft}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute text-[7rem] font-medium leading-none"
              >
                {secondsLeft}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    if (sessionStage === "active" && phaseLabel) {
      return (
        <motion.div
          key="active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
          className="flex items-center justify-center w-full h-full text-white"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${sessionStage}-${phaseIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              style={{ wordSpacing: "-0.15em" }}
              className="text-[4.5rem] tracking-[-0.2rem] leading-none text-center"
            >
              {phaseText[phaseLabel]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      );
    }

    if (sessionStage === "done") {
      return (
        <motion.div
          key="done"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center text-[2.8rem] tracking-tighter leading-[1.8rem] text-white text-center"
        >
          {doneText[currentMode]}
        </motion.div>
      );
    }

    return null;
  }

  return (
    <main className="relative flex-1 tracking-tight">
      <Fade visible={!isSessionActive} duration={0.5}>
        <div className="absolute top-28 left-1/2 flex flex-col w-full max-w-122 items-center px-5 sm:px-0 -translate-x-1/2 z-10">
          <div className="flex text-3xl">O que você precisa agora?</div>
          <ModeSelector currentMode={currentMode} onModeChange={onModeChange} />
        </div>
      </Fade>

      <Fade visible={sessionStage === "prepare"} duration={1.5}>
        <div className="absolute top-36 left-1/2 flex flex-col w-full max-w-122 items-center px-5 sm:px-0 -translate-x-1/2 z-10 text-center">
          <div className="flex text-5xl tracking-tight leading-9.5" style={{ wordSpacing: "-0.15em" }}>
            Solte o ar o máximo que conseguir.
          </div>
        </div>
      </Fade>

      <div className="absolute inset-0 flex items-center justify-center z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "relative flex items-center justify-center w-[55vmin] max-w-80 rounded-full aspect-square",
            solidBgVariants({ mode: currentMode })
          )}
        >
          <AnimatePresence mode="wait">
            {renderCircleContent()}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute bottom-16 left-1/2 flex w-full max-w-122 items-end px-5 sm:px-0 gap-2 -translate-x-1/2 z-10">
        <MainButton
          currentMode={currentMode}
          onStart={onStart}
          onFinish={onFinish}
          isSessionActive={isSessionActive}
          disabled={isTransitioning}
        />

        <CycleSelector
          currentMode={currentMode}
          cycles={cycles}
          onDecrease={onDecreaseCycle}
          onIncrease={onIncreaseCycle}
          isSessionActive={isSessionActive}
          currentCycle={currentCycle}
        />
      </div>
    </main>
  );
}