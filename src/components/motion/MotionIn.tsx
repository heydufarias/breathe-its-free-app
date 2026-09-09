import { motion, type HTMLMotionProps } from "framer-motion";

interface MotionInProps extends HTMLMotionProps<"div"> {
  scale?: boolean;
}

export function MotionIn({ scale, children, ...props }: MotionInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...(scale && { scale: 0.95 }) }}
      animate={{ opacity: 1, ...(scale && { scale: 1 }) }}
      exit={{ opacity: 0, ...(scale && { scale: 0.95 }) }}
      {...props}
    >
      {children}
    </motion.div>
  );
}