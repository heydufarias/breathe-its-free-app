import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { solidBgVariants } from "../lib/variants";
import type { BreathMode } from "../lib/types";
import { Fade } from "./Fade";

interface CycleSelectorProps {
  currentMode: BreathMode;
  cycles: number;
  remainingCycles: number;
  onDecrease: () => void;
  onIncrease: () => void;
  isSessionActive: boolean;
}

export function CycleSelector({
  currentMode,
  cycles,
  remainingCycles,
  onDecrease,
  onIncrease,
  isSessionActive,
}: CycleSelectorProps) {
  const { t } = useTranslation();

  const canDecrease = cycles > 3;
  const canIncrease = cycles < 9;

  return (
    <div className="flex flex-11 min-w-0 flex-col items-start text-4xl">
      <div className="pl-6 text-xl leading-6">{t("Cycles")}</div>

      <div
        className={cn(
          "relative flex h-18 w-full items-center rounded-full overflow-hidden transition-colors duration-700",
          isSessionActive ? "bg-white" : solidBgVariants({ mode: currentMode })
        )}
      >
        <Fade
          visible={!isSessionActive}
          duration={0.4}
          className="absolute inset-0 flex w-full items-center justify-between"
        >
          <motion.button
            onClick={onDecrease}
            disabled={!canDecrease}
            whileTap={canDecrease ? { scale: 0.8 } : undefined}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={cn(
              "flex h-20 w-16 items-center justify-center rounded-full",
              canDecrease ? "cursor-pointer" : "cursor-default"
            )}
          >
            <ChevronLeft
              className={cn("h-9 w-9 transition-colors", canDecrease ? "text-white" : "text-white/60")}
              strokeWidth={2.5}
            />
          </motion.button>

          <span className="flex min-w-16 items-baseline justify-center text-white">
            <motion.span
              key={cycles}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {cycles}
            </motion.span>
          </span>

          <motion.button
            onClick={onIncrease}
            disabled={!canIncrease}
            whileTap={canIncrease ? { scale: 0.8 } : undefined}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={cn(
              "flex h-20 w-16 items-center justify-center rounded-full",
              canIncrease ? "cursor-pointer" : "cursor-default"
            )}
          >
            <ChevronRight
              className={cn("h-9 w-9 transition-colors", canIncrease ? "text-white" : "text-white/60")}
              strokeWidth={2.5}
            />
          </motion.button>
        </Fade>

        <Fade
          visible={isSessionActive}
          duration={0.4}
          className={cn(
            "absolute inset-0 flex w-full items-center justify-center",
            `text-[var(--color-${currentMode})]`
          )}
        >
          <span className="flex items-baseline">
            <motion.span
              key={remainingCycles}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {remainingCycles}
            </motion.span>
            <span>/{cycles}</span>
          </span>
        </Fade>
      </div>
    </div>
  );
}