import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "../Card";

interface CollapsibleSectionProps {
  title: string;
  icon: LucideIcon;
  expanded: boolean;
  onToggle(): void;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  icon: Icon,
  expanded,
  onToggle,
  rightAction,
  children
}: CollapsibleSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div onClick={onToggle} className="flex items-center gap-3 cursor-pointer">
          <Icon className="w-5 h-5" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {rightAction}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <Card className="p-6">{children}</Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
