import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [switched, setSwitched] = useState(isSessionActive);

  useEffect(() => {
    const timeout = setTimeout(() => setSwitched(isSessionActive), 250);
    return () => clearTimeout(timeout);
  }, [isSessionActive]);

  return (
    <button
      onClick={isSessionActive ? onFinish : onStart}
      className={cn(
        "relative flex h-18 flex-19 items-center p-1 rounded-full cursor-pointer overflow-hidden transition-colors duration-500",
        switched ? solidBgVariants({ mode: currentMode }) : "bg-white",
        switched ? "justify-start" : "justify-end"
      )}
    >
      <div className="absolute left-7 flex items-center h-full pointer-events-none z-10">
        <Fade visible={!switched} duration={0.4} className="text-primary text-2xl">
          {t("Start")}
        </Fade>
      </div>

      <div className="absolute right-7 flex items-center h-full pointer-events-none z-10">
        <Fade visible={switched} duration={0.4} className="text-white text-2xl">
          {t("Finish")}
        </Fade>
      </div>

      <motion.div
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={cn(
          "relative z-20 flex h-16 w-16 shrink-0 items-center justify-center rounded-full transition-colors duration-500",
          switched ? "bg-white" : solidBgVariants({ mode: currentMode })
        )}
      >
        <motion.div
          animate={{ rotate: isSessionActive ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ArrowRight
            className={cn(
              "h-9 w-9 transition-colors duration-500",
              switched ? `text-[var(--color-${currentMode})]` : "text-white"
            )}
            strokeWidth={2.5}
          />
        </motion.div>
      </motion.div>
    </button>
  );
}