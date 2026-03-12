import { motion } from "framer-motion";

const Duration = 0.3;
const BorderEase = "easeOut";

export function BottomBorder() {
  return (
    <motion.div
      exit={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      initial={{ scaleX: 0, originX: 0 }}
      transition={{ duration: Duration, ease: BorderEase }}
      className="absolute bottom-0 left-0 h-1 w-full bg-primary"
    />
  );
}
