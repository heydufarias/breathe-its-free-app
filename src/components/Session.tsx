import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import type { BreathPhase } from "../lib/breathingPatterns";
import type { BreathMode, SessionStage } from "../lib/types";
import { cn } from "../lib/utils";
import { CycleSelector } from "./CycleSelector";
import { Fade } from "./Fade";
import { MainButton } from "./MainButton";
import { ModeSelector } from "./ModeSelector";

interface SessionProps {
  currentMode: BreathMode;
  onModeChange: (mode: BreathMode) => void;
  cycles: number;
  currentCycle: number;
  onDecreaseCycle: () => void;
  onIncreaseCycle: () => void;
  sessionStage: SessionStage;
  currentPhase?: BreathPhase;
  phaseIndex: number;
  secondsLeft: number;
  isTransitioning: boolean;
  onStart: () => void;
  onFinish: () => void;
}

const modeTextColor: Record<BreathMode, string> = {
  relax: "text-relax",
  focus: "text-focus",
  sleep: "text-sleep",
};

export function Session({
  currentMode,
  onModeChange,
  cycles,
  currentCycle,
  onDecreaseCycle,
  onIncreaseCycle,
  sessionStage,
  currentPhase,
  phaseIndex,
  secondsLeft,
  isTransitioning,
  onStart,
  onFinish,
}: SessionProps) {
  const { t } = useTranslation();
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
          className={cn(
            "relative flex items-center justify-center w-full h-full",
            modeTextColor[currentMode]
          )}
        >
          <AnimatePresence mode="wait">
            {secondsLeft <= 3 && (
              <motion.span
                key={secondsLeft}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute text-[25vmin] sm:text-[7rem] font-medium leading-none"
              >
                {secondsLeft}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }

    if (sessionStage === "active" && currentPhase) {
      return (
        <motion.div
          key="active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
          className={cn(
            "relative flex items-center justify-center w-full h-full px-4",
            modeTextColor[currentMode]
          )}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${sessionStage}-${phaseIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              style={{ wordSpacing: "-0.15em" }}
              className="absolute text-[13vmin] sm:text-[4.5rem] tracking-tighter sm:tracking-[-0.2rem] leading-none text-center whitespace-pre-line"
            >
              {t(`session.phases.${currentPhase.label}`)}
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
          className="absolute flex flex-col items-center justify-center text-[8vmin] sm:text-[2.8rem] tracking-tighter leading-[1.05] text-white text-center w-full h-full px-4"
        >
          {t(`session.done.${currentMode}`)}
        </motion.div>
      );
    }

    return null;
  }

  return (
    <main className="relative flex-1 tracking-tight pointer-events-none">
      <Fade visible={!isSessionActive} duration={0.5}>
        <div className="absolute top-26 left-1/2 flex flex-col w-full max-w-122 items-center px-5 sm:px-0 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="flex text-3xl">{t("session.title")}</div>
          <ModeSelector currentMode={currentMode} onModeChange={onModeChange} />
        </div>
      </Fade>

      <Fade visible={sessionStage === "prepare"} duration={1.5}>
        <div className="absolute top-36 left-1/2 flex flex-col w-full max-w-122 items-center px-5 sm:px-0 -translate-x-1/2 z-20 text-center pointer-events-none">
          <div className="flex text-[6.5vmin] sm:text-5xl tracking-tighter leading-9">
            {t("session.prepare")}
          </div>
        </div>
      </Fade>

      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="relative w-[98vmin] max-w-160 aspect-square translate-y-10">
          <AnimatePresence mode="wait">
            {renderCircleContent()}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-16 left-1/2 flex w-full max-w-122 items-end px-5 sm:px-0 gap-2 -translate-x-1/2 z-20 pointer-events-auto">
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