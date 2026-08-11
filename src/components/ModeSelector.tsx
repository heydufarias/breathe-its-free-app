import { useTranslation } from "react-i18next";
import { MODES } from "../lib/consts";
import type { BreathMode } from "../lib/types";
import { cn } from "../lib/utils";
import { indicatorVariants, solidBgVariants } from "../lib/variants";

interface ModeSelectorProps {
  currentMode: BreathMode;
  onModeChange: (mode: BreathMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex p-1 rounded-full backdrop-blur-2xl backdrop-saturate-150",
          solidBgVariants({ mode: currentMode })
        )}
      >
        <div
          className={cn(
            "absolute top-1 bottom-1 left-1 bg-white rounded-full backdrop-blur-md",
            indicatorVariants({ mode: currentMode })
          )}
          style={{ width: "calc((100% - 0.5rem) / 3)" }}
        />

        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={cn(
              "relative flex flex-1 h-16 items-center justify-center text-center text-2xl z-10 cursor-pointer transition-colors duration-300",
              currentMode === mode ? "" : "text-white/60"
            )}
          >
            <span className="relative inline-block overflow-hidden leading-none">
              {t(`modes.${mode}`)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}