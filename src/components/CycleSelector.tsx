import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { solidBgVariants } from "../lib/variants";
import type { BreathMode } from "../lib/types";

interface CycleSelectorProps {
  currentMode: BreathMode;
  cycles: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function CycleSelector({ currentMode, cycles, onDecrease, onIncrease }: CycleSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-11 flex-col items-start">
      <div className="pl-6 text-xl leading-6">
        {t("Cycles")}
      </div>

      <div
        className={cn(
          "flex h-18 w-full items-center justify-between rounded-full",
          solidBgVariants({ mode: currentMode })
        )}
      >
        <button
          onClick={onDecrease}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full"
        >
          <ChevronLeft
            className={cn("h-9 w-9 transition-colors duration-200", cycles > 3 ? "text-white" : "text-white/50")}
            strokeWidth={2.5}
          />
        </button>

        <span className="text-4xl text-white">
          {cycles}
        </span>

        <button
          onClick={onIncrease}
          className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full"
        >
          <ChevronRight
            className={cn("h-9 w-9 transition-colors duration-200", cycles < 9 ? "text-white" : "text-white/50")}
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}