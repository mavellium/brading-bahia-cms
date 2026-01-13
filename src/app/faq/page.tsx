/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback, useId, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListManagement } from "@/hooks/useListManagement";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/Button";
import { 
  HelpCircle, 
  GripVertical, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  XCircle,
  Search,
  X,
  FileText
} from "lucide-react";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

function SortableFAQItem({
  item,
  index,
  originalIndex,
  isLastInOriginalList,
  isLastAndEmpty,
  showValidation,
  itemList,
  handleChange,
  openDeleteSingleModal,
  setNewItemRef,
}: {
  item: FAQItem;
  index: number;
  originalIndex: number;
  isLastInOriginalList: boolean;
  isLastAndEmpty: boolean;
  showValidation: boolean;
  itemList: FAQItem[];
  handleChange: (index: number, field: keyof FAQItem, value: any) => void;
  openDeleteSingleModal: (index: number, title: string) => void;
  setNewItemRef?: (node: HTMLDivElement | null) => void;
}) {
  const stableId = useId();
  const sortableId = item.id || `faq-${index}-${stableId}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const hasQuestion = item.question.trim() !== "";
  const hasAnswer = item.answer.trim() !== "";

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      
      if (isLastAndEmpty && setNewItemRef) {
        setNewItemRef(node);
      }
    },
    [setNodeRef, isLastAndEmpty, setNewItemRef]
  );

  return (
    <div
      ref={setRefs}
      style={style}
      className={`relative ${isDragging ? 'z-50' : ''}`}
    >
      <Card className={`mb-4 overflow-hidden transition-all duration-300 ${
        isLastInOriginalList && showValidation && (!hasQuestion || !hasAnswer) 
          ? 'ring-2 ring-[var(--color-danger)]' 
          : ''
      } ${isDragging ? 'shadow-lg scale-105' : ''} bg-[var(--color-background)] border-l-4 border-[var(--color-primary)]`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="cursor-grab active:cursor-grabbing text-[var(--color-secondary)]/70 hover:text-[var(--color-primary)] transition-colors p-2 rounded-lg hover:bg-[var(--color-background)]/50"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-5 h-5" />
              </button>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm text-[var(--color-secondary)]/70">
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Posição: {index + 1}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {hasQuestion ? (
                    <h4 className="font-medium text-[var(--color-secondary)]">
                      {item.question.length > 50 ? `${item.question.substring(0, 50)}...` : item.question}
                    </h4>
                  ) : (
                    <h4 className="font-medium text-[var(--color-secondary)]/50">
                      FAQ sem pergunta
                    </h4>
                  )}
                  {hasQuestion && hasAnswer ? (
                    <span className="px-2 py-1 text-xs bg-[var(--color-success)]/20 text-green-300 rounded-full border border-[var(--color-success)]/30">
                      Completo
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-[var(--color-warning)]/20 text-red rounded-full border border-[var(--color-warning)]/30">
                      Incompleto
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={() => openDeleteSingleModal(originalIndex, item.question || "FAQ sem pergunta")}
              variant="danger"
              className="whitespace-nowrap bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/90 border-none flex items-center gap-2"
              disabled={itemList.length <= 1}
            >
              <Trash2 className="w-4 h-4" />
              Remover
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Pergunta <span className="text-xs text-[var(--color-danger)]">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Quais são os métodos de pagamento aceitos?"
                  value={item.question}
                  onChange={(e: any) => handleChange(originalIndex, "question", e.target.value)}
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-medium"
                  autoFocus={isLastAndEmpty}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Resposta <span className="text-xs text-[var(--color-danger)]">*</span>
                </label>
                <TextArea
                  placeholder="Digite a resposta detalhada..."
                  value={item.answer}
                  onChange={(e: any) => handleChange(originalIndex, "answer", e.target.value)}
                  rows={5}
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function CreateFAQ({ 
  type = "faq", 
  subtype = "branding-bahia"
}: { 
  type: string; 
  subtype: string; 
}) {
  const defaultFAQItem = useMemo(() => ({ 
    question: "", 
    answer: "" 
  }), []);

  const [localFAQs, setLocalFAQs] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const apiBase = `/api/${subtype}/form`;

  const {
    list: faqList,
    setList: setFAQList,
    exists,
    loading,
    setLoading,
    success,
    setSuccess,
    errorMsg,
    setErrorMsg,
    showValidation,
    deleteModal,
    currentPlanLimit,
    currentPlanType,
    openDeleteSingleModal,
    openDeleteAllModal,
    closeDeleteModal,
    confirmDelete,
  } = useListManagement<FAQItem>({
    type,
    apiPath: `${apiBase}/${type}`,
    defaultItem: defaultFAQItem,
    validationFields: ["question", "answer"]
  });

  // Sincroniza FAQs locais
  useEffect(() => {
    setLocalFAQs(faqList);
  }, [faqList]);

  const newFAQRef = useRef<HTMLDivElement>(null);

  const setNewItemRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      newFAQRef.current = node;
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = localFAQs.findIndex((item) => 
        item.id === active.id || item.id?.includes(active.id as string)
      );
      const newIndex = localFAQs.findIndex((item) => 
        item.id === over.id || item.id?.includes(over.id as string)
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newList = arrayMove(localFAQs, oldIndex, newIndex);
        setLocalFAQs(newList);
        setFAQList(newList);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const filteredList = localFAQs.filter(
        item => item.question.trim() && item.answer.trim()
      );

      if (!filteredList.length) {
        setErrorMsg("Adicione ao menos um FAQ completo (com pergunta e resposta).");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      
      if (exists) fd.append("id", exists.id);
      
      fd.append(
        "values",
        JSON.stringify(
          filteredList.map(item => item)
        )
      );

      const method = exists ? "PUT" : "POST";

      const res = await fetch(`${apiBase}/${type}`, {
        method,
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar FAQs");
      }

      const saved = await res.json();

      const normalized = saved.values.map((v: any, i: number) => ({
        ...v,
        id: v.id || `faq-${Date.now()}-${i}`,
      }));

      setLocalFAQs(normalized);
      setFAQList(normalized);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof FAQItem, value: any) => {
    const newList = [...localFAQs];
    newList[index] = { ...newList[index], [field]: value };
    setLocalFAQs(newList);
    setFAQList(newList);
  };

  const updateFAQs = async (list: FAQItem[]) => {
    if (!exists) return;

    const filteredList = list.filter(
      item => item.question.trim() || item.answer.trim()
    );

    const fd = new FormData();
    
    fd.append("id", exists.id);
    
    fd.append(
      "values",
      JSON.stringify(
        filteredList.map(item => item)
      )
    );

    const res = await fetch(`${apiBase}/${type}`, {
      method: "PUT",
      body: fd,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Falha ao atualizar dados");
    }

    const updated = await res.json();
    return updated;
  };

  const handleAddFAQItem = () => {
    if (localFAQs.length >= currentPlanLimit) {
      return false;
    }
    
    const newItem: FAQItem = {
      question: '',
      answer: ''
    };
    
    const updated = [...localFAQs, newItem];
    setLocalFAQs(updated);
    setFAQList(updated);
    
    setTimeout(() => {
      newFAQRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const filteredFAQItems = useMemo(() => {
    let filtered = [...localFAQs];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [localFAQs, searchTerm]);

  const isFAQLimitReached = localFAQs.length >= currentPlanLimit;
  const canAddNewItem = !isFAQLimitReached;
  const faqCompleteCount = localFAQs.filter(item => 
    item.question.trim() !== '' && 
    item.answer.trim() !== ''
  ).length;
  const faqTotalCount = localFAQs.length;

  const faqValidationError = isFAQLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentPlanLimit} itens).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Cada FAQ tem 2 campos (question, answer)
    total += localFAQs.length * 2;
    localFAQs.forEach(item => {
      if (item.question.trim()) completed++;
      if (item.answer.trim()) completed++;
    });

    return { completed, total };
  };

  const completion = calculateCompletion();

  const stableIds = useMemo(
    () => localFAQs.map((item, index) => item.id ?? `faq-${index}`),
    [localFAQs]
  );

  return (
    <ManageLayout
      headerIcon={HelpCircle}
      title="FAQs"
      description="Gerencie as perguntas frequentes da sua empresa"
      exists={!!exists}
      itemName="FAQ"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Cabeçalho de Controle */}
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2">
                Gerenciamento de FAQs
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-[var(--color-secondary)]/70">
                    {faqCompleteCount} de {faqTotalCount} completos
                  </span>
                </div>
                <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                <span className="text-sm text-[var(--color-secondary)]/70">
                  Limite: {currentPlanType === 'pro' ? '10' : '5'} itens
                </span>
              </div>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-secondary)]">
              Buscar FAQs
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-secondary)]/70" />
              <Input
                type="text"
                placeholder="Buscar FAQs por pergunta ou resposta..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Mensagem de erro */}
        {faqValidationError && (
          <div className={`p-3 rounded-lg ${isFAQLimitReached 
            ? 'bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30' 
            : 'bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30'}`}>
            <div className="flex items-start gap-2">
              {isFAQLimitReached ? (
                <XCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${isFAQLimitReached 
                ? 'text-[var(--color-danger)]' 
                : 'text-[var(--color-warning)]'}`}>
                {faqValidationError}
              </p>
            </div>
          </div>
        )}

        {/* Lista de FAQs */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFAQItems.length === 0 ? (
              <Card className="p-8 bg-[var(--color-background)]">
                <div className="text-center">
                  <HelpCircle className="w-12 h-12 text-[var(--color-secondary)]/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--color-secondary)] mb-2">
                    Nenhum FAQ encontrado
                  </h3>
                  <p className="text-sm text-[var(--color-secondary)]/70">
                    {searchTerm ? 'Tente ajustar sua busca ou limpe o filtro' : 'Adicione seu primeiro FAQ usando o botão abaixo'}
                  </p>
                </div>
              </Card>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={stableIds}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredFAQItems.map((item, index) => {
                    const originalIndex = localFAQs.findIndex(i => i.id === item.id) || index;
                    const hasQuestion = item.question.trim() !== "";
                    const hasAnswer = item.answer.trim() !== "";
                    const isLastInOriginalList = originalIndex === localFAQs.length - 1;
                    const isLastAndEmpty = isLastInOriginalList && !hasQuestion && !hasAnswer;

                    return (
                      <SortableFAQItem
                        key={stableIds[index]}
                        item={item}
                        index={index}
                        originalIndex={originalIndex}
                        isLastInOriginalList={isLastInOriginalList}
                        isLastAndEmpty={isLastAndEmpty}
                        showValidation={showValidation}
                        itemList={localFAQs}
                        handleChange={handleChange}
                        openDeleteSingleModal={openDeleteSingleModal}
                        setNewItemRef={isLastAndEmpty ? setNewItemRef : undefined}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            )}
          </AnimatePresence>
        </div>

        <FixedActionBar
          onDeleteAll={openDeleteAllModal}
          onSubmit={handleSubmit}
          onAddNew={handleAddFAQItem}
          isAddDisabled={!canAddNewItem}
          isSaving={loading}
          exists={!!exists}
          totalCount={completion.total}
          itemName="FAQ"
          icon={HelpCircle}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => confirmDelete(updateFAQs)}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={localFAQs.length}
        itemName="FAQ"
      />

      <FeedbackMessages success={success} errorMsg={errorMsg} />
    </ManageLayout>
  );
}