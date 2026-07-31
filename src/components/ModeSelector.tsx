import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { solidBgVariants, indicatorVariants } from "../lib/variants";
import type { BreathMode } from "../lib/types";

const MODES: BreathMode[] = ["relax", "focus", "sleep"];

interface ModeSelectorProps {
  currentMode: BreathMode;
  onModeChange: (mode: BreathMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const { t, i18n } = useTranslation();

  return (
    <div
      className={cn(
        "relative flex rounded-full p-1 backdrop-blur-2xl backdrop-saturate-150",
        solidBgVariants({ mode: currentMode })
      )}
    >
      <div
        className={cn(
          "absolute bottom-1 left-1 top-1 w-40 rounded-full bg-white backdrop-blur-md",
          indicatorVariants({ mode: currentMode })
        )}
      />

      {MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={cn(
            "relative z-10 flex h-16 w-40 cursor-pointer items-center justify-center border-none bg-transparent text-center text-2xl transition-colors duration-300",
            currentMode === mode ? "" : "text-white/60"
          )}
        >
          <span className="relative inline-block overflow-hidden leading-none">
            <motion.span
              key={`${mode}-${i18n.language}`}
              initial={{ opacity: 1, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="inline-block"
            >
              {t(`modes.${mode}`)}
            </motion.span>
          </span>
        </button>
      ))}
    </div>
  );
}