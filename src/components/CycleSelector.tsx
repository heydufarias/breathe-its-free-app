import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { solidBgVariants } from "../lib/variants";
import type { BreathMode } from "../lib/types";

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
          "relative flex h-18 w-full items-center rounded-full overflow-hidden",
          isSessionActive ? "bg-white" : solidBgVariants({ mode: currentMode })
        )}
      >
        <div
          className={cn(
            "absolute inset-0 flex w-full items-center justify-between transition-opacity duration-700 ease-in-out",
            isSessionActive ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
        >
          <button
            onClick={onDecrease}
            disabled={!canDecrease}
            className={cn(
              "flex h-20 w-16 items-center justify-center rounded-full",
              canDecrease ? "cursor-pointer" : "cursor-default"
            )}
          >
            <ChevronLeft
              className={cn("h-9 w-9", canDecrease ? "text-white" : "text-white/60")}
              strokeWidth={2.5}
            />
          </button>

          <span className="flex min-w-16 items-baseline justify-center text-white">
            {cycles}
          </span>

          <button
            onClick={onIncrease}
            disabled={!canIncrease}
            className={cn(
              "flex h-20 w-16 items-center justify-center rounded-full",
              canIncrease ? "cursor-pointer" : "cursor-default"
            )}
          >
            <ChevronRight
              className={cn("h-9 w-9", canIncrease ? "text-white" : "text-white/60")}
              strokeWidth={2.5}
            />
          </button>
        </div>

        <div
          className={cn(
            "absolute inset-0 flex w-full items-center justify-center transition-opacity duration-700 ease-in-out",
            isSessionActive ? "opacity-100" : "opacity-0 pointer-events-none",
            `text-[var(--color-${currentMode})]`
          )}
        >
          <span className="flex items-baseline">
            <span>{remainingCycles}</span>
            <span>/{cycles}</span>
          </span>
        </div>
      </div>
    </div>
  );
}