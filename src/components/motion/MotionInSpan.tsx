import { motion, type HTMLMotionProps } from "framer-motion";

interface MotionInSpanProps extends HTMLMotionProps<"span"> {
  scale?: boolean;
}

export function MotionInSpan({ scale, children, ...props }: MotionInSpanProps) {
  return (
    <motion.span
      initial={{ opacity: 0, ...(scale && { scale: 0.85 }) }}
      animate={{ opacity: 1, ...(scale && { scale: 1 }) }}
      exit={{ opacity: 0 }}
      {...props}
    >
      {children}
    </motion.span>
  );
}