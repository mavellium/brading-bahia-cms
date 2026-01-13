"use client";

import { Plus, X, Save } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { LucideIcon } from "lucide-react";

interface FixedActionBarProps {
  onDeleteAll: () => void;
  onAddNew?: () => void;
  onSubmit: () => void;
  isAddDisabled: boolean;
  isSaving: boolean;
  exists: boolean;
  completeCount?: number;
  totalCount: number;
  itemName: string;
  itemNamePlural?: string;
  icon?: LucideIcon;
  submitColor?: string;
}

export function FixedActionBar({
  onDeleteAll,
  onAddNew,
  onSubmit,
  isAddDisabled,
  isSaving,
  exists,
  completeCount,
  totalCount,
  itemName,
  itemNamePlural,
  icon: Icon,
  submitColor = "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
}: FixedActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[var(--color-background)]/90 to-transparent backdrop-blur-sm pt-4">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-4">
        <Card className="shadow-xl bg-[var(--color-background)] border-2 border-[var(--color-border)]">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-[var(--color-secondary)]/70">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>
                    {completeCount} {completeCount === 1 ? itemName : itemNamePlural || `${itemName}s`} {completeCount && "completos"}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="danger"
                  onClick={onDeleteAll}
                  className="flex-1 sm:flex-none justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Tudo
                </Button>
                
                {
                  onAddNew && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onAddNew}
                      disabled={isAddDisabled}
                      className="flex-1 sm:flex-none justify-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo {itemName}
                    </Button>
                  )
                }

                <Button
                  type="button"
                  onClick={onSubmit}
                  loading={isSaving}
                  variant="primary"
                  className={`flex-1 sm:flex-none justify-center ${submitColor}`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {exists ? "Atualizar" : "Salvar"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}