import { Plus } from "lucide-react";
import { Button } from "@/components/Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel = "Adicionar",
  onAction
}: EmptyStateProps) {
  return (
    <div className="p-10 border-2 border-dashed rounded-lg text-center space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm opacity-70">{description}</p>}
      {onAction && (
        <Button onClick={onAction} className="mx-auto flex gap-2">
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
