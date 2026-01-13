import { motion } from "framer-motion";
import { CardProps } from "../../types";

export const Card = ({ children, className = "" }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${className} rounded-2xl shadow-xl border overflow-hidden`}
  >
    {children}
  </motion.div>
);