import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon, Trash2 } from "lucide-react";
import { Button } from "../Button";
import { Card } from "../Card";

interface EntityEditorProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  children: React.ReactNode;
}

export function EntityEditor({
  title,
  subtitle,
  icon: Icon,
  isOpen,
  onToggle,
  onRemove,
  children
}: EntityEditorProps) {
  return (
    <div className="space-y-4">
      <div onClick={onToggle} className="flex justify-between cursor-pointer">
        <div className="flex gap-3">
          {Icon && <Icon />}
          <div>
            <h4>{title}</h4>
            {subtitle && <p className="text-sm">{subtitle}</p>}
          </div>
        </div>
        {onRemove && (
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div>
            <Card className="p-6">{children}</Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
