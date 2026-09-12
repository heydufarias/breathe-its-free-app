import { AnimatePresence } from "framer-motion";
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
import { MotionFade } from "./motion/MotionFade";
import { MotionIn } from "./motion/MotionIn";
import { MotionInSpan } from "./motion/MotionInSpan";
import { CycleSelector } from "./ui/CycleSelector";
import { MainButton } from "./ui/MainButton";
import { ModeSelector } from "./ui/ModeSelector";

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
        <MotionIn
          key="prepare"
          transition={{ duration: 0.6 }}
          className={cn(
            "relative flex h-full w-full items-center justify-center",
            modeStyles[currentMode].text,
          )}
        >
          <AnimatePresence mode="wait">
            {secondsLeft <= 3 && (
              <MotionInSpan
                key={secondsLeft}
                scale
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute text-[clamp(2rem,20vmin,7rem)] font-medium"
              >
                {secondsLeft}
              </MotionInSpan>
            )}
          </AnimatePresence>
        </MotionIn>
      );
    }

    if (sessionStage === "active" && currentPhase) {
      return (
        <MotionIn
          key="active"
          transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
          className={cn(
            "relative flex h-full w-full items-center justify-center px-4",
            modeStyles[currentMode].text,
          )}
        >
          <AnimatePresence mode="wait">
            <MotionInSpan
              key={phaseIndex}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className="absolute text-[clamp(2.5rem,13vmin,4.5rem)] tracking-tight [word-spacing:-0.15em] text-center whitespace-pre-line"
            >
              {t(`session.phases.${currentPhase.label}`)}
            </MotionInSpan>
          </AnimatePresence>
        </MotionIn>
      );
    }

    if (sessionStage === "done") {
      return (
        <MotionIn
          key="done"
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={cn(
            "absolute flex flex-col items-center justify-center text-[clamp(1.75rem,9vmin,3.25rem)] tracking-tight text-center w-full h-full px-4",
            {
              relax: "leading-10.5",
              focus: "leading-9.5",
              sleep: "leading-10.5",
            }[currentMode]
          )}
        >
          {t(`session.done.${currentMode}`).split(" ").map((word, index) => (
            <span key={index} className="block">
              {word}
            </span>
          ))}
        </MotionIn>
      );
    }

    return null;
  }

  return (
    <div className="relative flex-1 w-full h-full tracking-tight">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative flex items-center justify-center w-[98vmin] max-w-160 aspect-square">
          <AnimatePresence mode="wait">
            {renderCircleContent()}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full flex justify-center z-20 pointer-events-none pt-2 sm:pt-4">
        <div className="relative flex flex-col w-full max-w-122 items-center px-5 sm:px-0">
          <MotionFade visible={!isSessionActive} duration={0.5}>
            <div className="flex flex-col items-center w-full pointer-events-auto">
              <div className="flex text-3xl">{t("session.title")}</div>
              <ModeSelector
                currentMode={currentMode}
                onModeChange={setMode}
              />
            </div>
          </MotionFade>

          <MotionFade visible={sessionStage === "prepare"} duration={sessionStage === "prepare" ? 1.5 : sessionStage === "active" ? 1.5 : 0.2}>
            <div className="absolute top-0 left-0 right-0 flex flex-col items-center w-full text-center">
              <div className="flex text-[6.5vmin] sm:text-5xl tracking-tight leading-[37.2px]">
                {t("session.prepare")}
              </div>
            </div>
          </MotionFade>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full flex justify-center z-20 pointer-events-none pb-4 sm:pb-6">
        <div className="flex w-full max-w-122 items-end px-5 sm:px-0 gap-2 pointer-events-auto">
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
      </div>
    </div>
  );
}