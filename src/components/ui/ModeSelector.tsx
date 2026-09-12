import { useTranslation } from "react-i18next";
import { MODES, modeStyles } from "../../lib/consts";
import type { BreathMode } from "../../lib/types";
import { cn } from "../../lib/utils";

interface ModeSelectorProps {
  currentMode: BreathMode;
  onModeChange: (mode: BreathMode) => void;
}

export function ModeSelector({
  currentMode,
  onModeChange,
}: ModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "relative flex w-full rounded-full transition-colors duration-500",
        modeStyles[currentMode].bgPrimary
      )}
    >
      <div
        className={cn(
          "absolute top-1 bottom-1 left-1 bg-white rounded-full transition-all duration-500 ease-in-out",
          modeStyles[currentMode].translate
        )}
        style={{ width: "calc((100% - 0.5rem) / 3)" }}
      />

      {MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={cn(
            " flex flex-1 h-[clamp(4rem,6vh,9rem)] items-center justify-center text-center text-2xl z-10 cursor-pointer transition-colors duration-500",
            currentMode === mode ? "" : "text-white/60"
          )}
        >
          <span>
            {t(`modes.${mode}`)}
          </span>
        </button>
      ))}
    </div>

  );
}