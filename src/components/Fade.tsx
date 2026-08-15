import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface FadeProps {
  visible: boolean;
  duration?: number;
  className?: string;
  children?: ReactNode;
}

export function Fade({ visible, duration = 0.5, className, children }: FadeProps) {
  return (
    <motion.span
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration, ease: "easeInOut" }}
      className={cn(className, !visible && "pointer-events-none")}
    >
      {children}
    </motion.span>
  );
}