import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { solidBgVariants } from "../lib/variants";
import type { BreathMode } from "../lib/types";
import { Fade } from "./Fade";

interface MainButtonProps {
  currentMode: BreathMode;
  onStart: () => void;
  onFinish: () => void;
  isSessionActive: boolean;
}

export function MainButton({ currentMode, onStart, isSessionActive, onFinish }: MainButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={isSessionActive ? onFinish : onStart}
      className={cn(
        "relative flex h-18 flex-19 items-center p-1 rounded-full cursor-pointer overflow-hidden",
        isSessionActive ? "justify-start" : "justify-end"
      )}
    >
      <Fade
        visible={!isSessionActive}
        className="absolute inset-0 z-0 bg-white"
      />

      <div className="absolute left-7 flex h-full items-center pointer-events-none z-10">
        <Fade
          visible={!isSessionActive}
          className="text-primary text-2xl">
          {t("Start")}
        </Fade>
      </div>

      <Fade
        visible={isSessionActive}
        className={cn("absolute inset-0 z-0 transition-colors duration-500",
          solidBgVariants({ mode: currentMode })
        )}
      />

      <div className="absolute right-7 flex h-full items-center pointer-events-none z-10">
        <Fade
          visible={isSessionActive}
          duration={0.5}
          className="text-white text-2xl"
        >
          {t("Finish")}
        </Fade>
      </div>

      <motion.div
        layout
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative z-20 flex h-16 w-16 shrink-0 items-center justify-center rounded-full overflow-hidden"
      >
        <Fade
          visible={!isSessionActive}
          className={cn("absolute inset-0 transition-colors duration-500",
            solidBgVariants({ mode: currentMode })
          )}
        />

        <Fade
          visible={isSessionActive}
          className="absolute inset-0 bg-white"
        />

        <motion.div
          animate={{ rotate: isSessionActive ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="relative z-10"
        >
          <ArrowRight
            className={cn(
              "h-9 w-9 transition-colors duration-500",
              isSessionActive ? `text-[var(--color-${currentMode})]` : "text-white"
            )}
            strokeWidth={2.5}
          />
        </motion.div>
      </motion.div>
    </button>
  );
}