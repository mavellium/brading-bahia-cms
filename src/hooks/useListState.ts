/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useSite } from "@/context/site-context";

interface UseListStateProps<T> {
  initialItems?: T[];
  defaultItem: T;
  validationFields?: (keyof T)[];
  enableDragDrop?: boolean;
}

interface UseListStateReturn<T> {
  [x: string]: any;
  // Estado
  items: T[];
  filteredItems: T[];
  search: string;
  setSearch: (search: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  showValidation: boolean;
  setShowValidation: (show: boolean) => void;
  draggingItem: number | null;
  
  // Ações
  addItem: () => boolean; // Retorna se foi bem-sucedido
  updateItem: (index: number, updates: Partial<T>) => void;
  removeItem: (index: number) => void;
  resetItems: () => void;
  
  // Drag & Drop
  startDrag: (index: number) => void;
  handleDragOver: (index: number) => void;
  endDrag: () => void;
  
  // Controles
  isLimitReached: boolean;
  canAddNewItem: boolean;
  validationError: string | null; // Erro de validação atual
  completeCount: number;
  totalCount: number;
  currentPlanLimit: number;
  currentPlanType: 'basic' | 'pro';
  
  // Referências
  newItemRef: React.RefObject<HTMLDivElement | null>;
  
  // Utilitários
  getItem: (index: number) => T | undefined;
  isItemValid: (item: T) => boolean;
}

export function useListState<T extends Record<string, any>>({
  initialItems = [],
  defaultItem,
  validationFields = [],
  enableDragDrop = true,
}: UseListStateProps<T>): UseListStateReturn<T> {
  const { currentSite } = useSite();
  
  // Estado principal
  const [items, setItems] = useState<T[]>(() => {
    if (initialItems.length > 0) {
      return initialItems.map((item, index) => ({
        ...item,
        id: (item as any).id || `item-${index}`,
        order: (item as any).order || index
      }));
    }
    return [{ ...defaultItem, id: 'item-0', order: 0 }];
  });
  
  // Estado de filtros
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showValidation, setShowValidation] = useState(false);
  const [draggingItem, setDraggingItem] = useState<number | null>(null);
  
  // Referência para novo item
  const newItemRef = useRef<HTMLDivElement>(null);

  // =========================
  // CONFIGURAÇÃO DO PLANO
  // =========================
  const getPlanLimit = useCallback((planType: "basic" | "pro"): number => {
    return planType === "pro" ? 10 : 5;
  }, []);

  const currentPlanLimit = useMemo(
    () => getPlanLimit(currentSite.planType),
    [currentSite.planType, getPlanLimit]
  );

  const currentPlanType = currentSite.planType;

  // =========================
  // GERADOR DE IDS
  // =========================
  const generateId = useCallback(() => {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // =========================
  // VALIDAÇÕES
  // =========================
  const isItemValid = useCallback((item: T): boolean => {
    if (validationFields.length === 0) return true;
    
    return validationFields.every((field) => {
      const value = item[field];
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null;
    });
  }, [validationFields]);

  // =========================
  // CALCULAR SE PODE ADICIONAR NOVO ITEM
  // =========================
  const canAddNewItem = useMemo(() => {
    // Verifica se atingiu o limite do plano
    if (items.length >= currentPlanLimit) {
      return false;
    }
    
    // Verifica se há busca ativa (não adiciona durante busca)
    if (search.trim() !== '') return true;
    
    // Se não há campos de validação, pode adicionar
    if (validationFields.length === 0) return true;
    
    // Verifica se o último item está válido
    const lastItem = items[items.length - 1];
    return isItemValid(lastItem);
  }, [items, currentPlanLimit, search, validationFields, isItemValid]);

  // Função para obter mensagem de erro atual (sem state, apenas cálculo)
  const validationError = useMemo(() => {
    if (items.length >= currentPlanLimit) {
      return `Você chegou ao limite do plano ${currentPlanType} (${currentPlanLimit} itens).`;
    }
    
    if (!canAddNewItem && validationFields.length > 0 && items.length > 0) {
      const lastItem = items[items.length - 1];
      if (lastItem && !isItemValid(lastItem)) {
        return 'Você precisa preencher o item anterior antes de adicionar um novo.';
      }
    }
    
    return null;
  }, [items, canAddNewItem, currentPlanLimit, currentPlanType, validationFields, isItemValid]);

  const isLimitReached = items.length >= currentPlanLimit;
  const completeCount = items.filter(isItemValid).length;
  const totalCount = items.length;

  // =========================
  // FILTROS E ORDENAÇÃO
  // =========================
  const filteredItems = useMemo(() => {
    let result = [...items];
    
    // Aplicar busca
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      result = result.filter((item) => {
        return Object.values(item).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          if (typeof value === 'number') {
            return value.toString().includes(searchLower);
          }
          return false;
        });
      });
    }
    
    // Ordenar por ordem definida (para drag & drop)
    result.sort((a, b) => {
      const orderA = (a as any).order || 0;
      const orderB = (b as any).order || 0;
      return orderA - orderB;
    });
    
    // Aplicar ordenação adicional
    if (sortOrder === 'desc') {
      result.reverse();
    }
    
    return result;
  }, [items, search, sortOrder]);

  // =========================
  // AÇÕES NA LISTA
  // =========================
  const addItem = useCallback(() => {
    if (!canAddNewItem) {
      setShowValidation(true);
      return false; // Falha ao adicionar
    }
    
    const newItem: T = {
      ...defaultItem,
      id: generateId(),
      order: items.length
    } as T;
    
    setItems(prev => [...prev, newItem]);
    setShowValidation(false);
    
    // Scroll para o novo item
    setTimeout(() => {
      newItemRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true; // Sucesso
  }, [canAddNewItem, defaultItem, generateId, items.length]);

  const updateItem = useCallback((index: number, updates: Partial<T>) => {
    setItems(prev => {
      const newItems = [...prev];
      if (index >= 0 && index < newItems.length) {
        newItems[index] = { ...newItems[index], ...updates };
      }
      return newItems;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => {
      if (prev.length <= 1) {
        // Mantém pelo menos um item vazio
        const emptyItem = { ...defaultItem, id: generateId(), order: 0 } as T;
        return [emptyItem];
      }
      
      // Remove o item e reordena os restantes
      const newItems = prev.filter((_, i) => i !== index);
      
      // Atualiza a ordem dos itens restantes
      return newItems.map((item, idx) => ({
        ...item,
        order: idx
      }));
    });
  }, [defaultItem, generateId]);

  const resetItems = useCallback(() => {
    setItems([{ ...defaultItem, id: generateId(), order: 0 } as T]);
    setSearch('');
    setSortOrder('asc');
    setShowValidation(false);
    setDraggingItem(null);
  }, [defaultItem, generateId]);

  // =========================
  // DRAG & DROP
  // =========================
  const startDrag = useCallback((index: number) => {
    if (!enableDragDrop) return;
    setDraggingItem(index);
  }, [enableDragDrop]);

  const handleDragOver = useCallback((index: number) => {
    if (!enableDragDrop || draggingItem === null || draggingItem === index) return;
    
    setItems(prev => {
      const newItems = [...prev];
      const draggedItem = newItems[draggingItem];
      
      // Remove o item arrastado
      newItems.splice(draggingItem, 1);
      
      // Insere na nova posição
      const newIndex = index > draggingItem ? index : index;
      newItems.splice(newIndex, 0, draggedItem);
      
      // Atualiza a ordem de todos os itens
      return newItems.map((item, idx) => ({
        ...item,
        order: idx
      }));
    });
    
    setDraggingItem(index);
  }, [enableDragDrop, draggingItem]);

  const endDrag = useCallback(() => {
    setDraggingItem(null);
  }, []);

  // =========================
  // UTILITÁRIOS
  // =========================
  const getItem = useCallback((index: number): T | undefined => {
    return items[index];
  }, [items]);

  // =========================
  // RETORNO DO HOOK
  // =========================
  return {
    // Estado
    items,
    filteredItems,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    showValidation,
    setShowValidation,
    draggingItem,
    
    // Ações
    addItem,
    updateItem,
    removeItem,
    resetItems,
    
    // Drag & Drop
    startDrag,
    handleDragOver,
    endDrag,
    
    // Controles
    isLimitReached,
    canAddNewItem,
    validationError,
    completeCount,
    totalCount,
    currentPlanLimit,
    currentPlanType,
    
    // Referências
    newItemRef,
    
    // Utilitários
    getItem,
    isItemValid
  };
}