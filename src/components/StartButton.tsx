import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { solidBgVariants } from "../lib/variants";
import type { BreathMode } from "../lib/types";

interface StartButtonProps {
  currentMode: BreathMode;
  onStart: () => void;
}

export function StartButton({ currentMode, onStart }: StartButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onStart}
      className="flex h-18 w-76 cursor-pointer items-center justify-between rounded-full bg-white p-1"
    >
      <span className="pl-7 text-2xl transition-colors duration-500">
        {t("Start")}
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