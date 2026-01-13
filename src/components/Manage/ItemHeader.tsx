"use client";

import { Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/Button";

interface ItemHeaderProps {
  index: number;
  fields: { label: string; hasValue: boolean }[];
  showValidation: boolean;
  isLast: boolean;
  onDelete: () => void;
  showDelete: boolean;
}

export function ItemHeader({
  index,
  fields,
  showValidation,
  isLast,
  onDelete,
  showDelete,
}: ItemHeaderProps) {
  const completedFields = fields.filter(f => f.hasValue).length;
  const totalFields = fields.length;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-[var(--color-secondary)]">
            #{index + 1}
          </span>
          <span className="text-xs text-[var(--color-secondary)]/70">
            ({completedFields}/{totalFields} campos)
          </span>
        </div>
        
        {isLast && showValidation && completedFields < totalFields && (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Preencha todos os campos</span>
          </div>
        )}
      </div>

      {showDelete && (
        <Button
          type="button"
          variant="danger"
          onClick={onDelete}
          className="ml-2"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir
        </Button>
      )}
    </div>
  );
}