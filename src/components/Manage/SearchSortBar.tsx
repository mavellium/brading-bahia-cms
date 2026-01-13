// components/Manage/SearchSortBar.tsx
"use client";

import { Search, ArrowUpDown, XCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

interface SearchSortBarProps {
  search: string;
  setSearch: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  onClearFilters: () => void;
  searchPlaceholder: string;
  total: number;
  showing: number;
  searchActiveText: string;
  currentPlanType: string;
  currentPlanLimit: number;
  remainingSlots: number;
  isLimitReached: boolean;
}

export function SearchSortBar({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  onClearFilters,
  searchPlaceholder,
  total,
  showing,
  searchActiveText,
  currentPlanType,
  currentPlanLimit,
  remainingSlots,
  isLimitReached,
}: SearchSortBarProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-secondary)]/50 w-5 h-5" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(search || sortOrder === 'desc') && (
            <Button
              type="button"
              variant="secondary"
              onClick={onClearFilters}
              className="flex-1 sm:flex-none"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Limpar Filtro
            </Button>
          )}
        </div>
      </div>
      <div className="mt-4 text-sm text-[var(--color-secondary)]/70 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <span>Total: {total}</span>
            <span className="mx-2">•</span>
            <span>Mostrando: {showing}</span>
            <span className="mx-2">•</span>
            <span className="font-medium">
              Disponível: {remainingSlots} de {currentPlanLimit}
            </span>
          </div>
          
          {isLimitReached ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>Limite do plano {currentPlanType.toUpperCase()} atingido</span>
            </div>
          ) : (
            <div className="text-xs text-blue-400">
              Plano: {currentPlanType.toUpperCase()}
            </div>
          )}
        </div>
        
        {search && (
          <div className="text-amber-600 text-xs">
            {searchActiveText}
          </div>
        )}
      </div>
    </Card>
  );
}