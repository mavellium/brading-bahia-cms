import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon, Trash2 } from "lucide-react";
import { Button } from "../Button";
import { Card } from "../Card";

interface ExpandableItemProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  expanded: boolean;
  onToggle(): void;
  onDelete(): void;
  children: React.ReactNode;
}

export function ExpandableItem({
  title,
  subtitle,
  icon: Icon,
  expanded,
  onToggle,
  onDelete,
  children
}: ExpandableItemProps) {
  return (
    <div className="space-y-4">
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-zinc-50"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <div>
            <h4 className="font-semibold">{title}</h4>
            {subtitle && <p className="text-sm">{subtitle}</p>}
          </div>
        </div>

        <Button
          variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
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
