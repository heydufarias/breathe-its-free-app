import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { solidBgVariants } from "../lib/variants";
import type { BreathMode } from "../lib/types";

interface MainButtonProps {
  currentMode: BreathMode;
  onStart: () => void;
  showFinishButton: boolean;
  onFinish: () => void;
}

export function MainButton({ currentMode, onStart, showFinishButton, onFinish }: MainButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={showFinishButton ? onFinish : onStart}
      className="flex h-18 flex-19 items-center justify-between p-1 bg-white rounded-full cursor-pointer"
    >
      <span className="pl-7 text-2xl transition-colors duration-500">
        {showFinishButton ? t("Finish") : t("Start")}
      </span>
      <span
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full",
          solidBgVariants({ mode: currentMode })
        )}
      >
        <ArrowRight className="h-9 w-9 text-white" strokeWidth={2.5} />
      </span>
    </button>
  );
}