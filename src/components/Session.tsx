import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { modeStyles } from "../lib/consts";
import { cn } from "../lib/utils";
import {
  advanceSession,
  decreaseCycles,
  finishSession,
  increaseCycles,
  resetToIdle,
  setMode,
  startSession,
} from "../state/actions";
import { state } from "../state/state";
import { CycleSelector } from "./CycleSelector";
import { MainButton } from "./MainButton";
import { ModeSelector } from "./ModeSelector";
import { MotionFade } from "./motion/MotionFade";

export function Session() {
  const { t } = useTranslation();

  const currentMode = state.use((value) => value.currentMode);
  const cycles = state.use((value) => value.cycles);
  const currentCycle = state.use((value) => value.currentCycle);
  const sessionStage = state.use((value) => value.sessionStage);
  const currentPhase = state.use((value) => value.currentPhase);
  const phaseIndex = state.use((value) => value.phaseIndex);
  const secondsLeft = state.use((value) => value.secondsLeft);
  const isTransitioning = state.use((value) => value.isTransitioning);

  const isSessionActive = sessionStage !== "idle";

  useEffect(() => {
    if (sessionStage !== "prepare" && sessionStage !== "active") {
      return;
    }

    const timeout = setTimeout(advanceSession, 1000);

    return () => clearTimeout(timeout);
  }, [sessionStage, secondsLeft]);

  useEffect(() => {
    if (sessionStage !== "done") {
      return;
    }

    const timeout = setTimeout(resetToIdle, 3000);

    return () => clearTimeout(timeout);
  }, [sessionStage]);

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
            modeStyles[currentMode].text,
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
            modeStyles[currentMode].text,
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
      <MotionFade visible={!isSessionActive} duration={0.5}>
        <div className="absolute top-26 left-1/2 flex flex-col w-full max-w-122 items-center px-5 sm:px-0 -translate-x-1/2 z-20 pointer-events-auto">
          <div className="flex text-3xl">{t("session.title")}</div>

          <ModeSelector
            currentMode={currentMode}
            onModeChange={setMode}
          />
        </div>
      </MotionFade>

      <MotionFade visible={sessionStage === "prepare"} duration={sessionStage === "prepare" ? 1.5 : sessionStage === "active" ? 1.5 : 0.2}>
        <div className="absolute top-36 left-1/2 flex flex-col w-full max-w-122 items-center px-5 sm:px-0 -translate-x-1/2 z-20 text-center pointer-events-none">
          <div className="flex text-[6.5vmin] sm:text-5xl tracking-tighter leading-9">
            {t("session.prepare")}
          </div>
        </div>
      </MotionFade>

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
          onStart={startSession}
          onFinish={finishSession}
          isSessionActive={isSessionActive}
          disabled={isTransitioning}
        />

        <CycleSelector
          currentMode={currentMode}
          cycles={cycles}
          onDecrease={decreaseCycles}
          onIncrease={increaseCycles}
          isSessionActive={isSessionActive}
          currentCycle={currentCycle}
        />
      </div>
    </main>
  );
}