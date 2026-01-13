/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback, useId, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListManagement } from "@/hooks/useListManagement";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { 
  Video, 
  GripVertical, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  XCircle,
  Search,
  X,
  Clock,
  Plus,
  Minus
} from "lucide-react";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { VideoUpload } from "@/components/VideoUpload";
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

interface HighlightItem {
  id?: string;
  textLists: string[];
  video: string;
  videoDuration: number;
  videoFile?: File | null;
}

function SortableHighlightItem({
  item,
  index,
  originalIndex,
  isLastInOriginalList,
  isLastAndEmpty,
  showValidation,
  itemList,
  handleChange,
  handleTextItemChange,
  addTextItem,
  removeTextItem,
  handleVideoFileChange,
  openDeleteSingleModal,
  setNewItemRef,
}: {
  item: HighlightItem;
  index: number;
  originalIndex: number;
  isLastInOriginalList: boolean;
  isLastAndEmpty: boolean;
  showValidation: boolean;
  itemList: HighlightItem[];
  handleChange: (index: number, field: keyof HighlightItem, value: any) => void;
  handleTextItemChange: (index: number, textIndex: number, value: string) => void;
  addTextItem: (index: number) => void;
  removeTextItem: (index: number, textIndex: number) => void;
  handleVideoFileChange: (index: number, file: File | null) => void;
  openDeleteSingleModal: (index: number, title: string) => void;
  setNewItemRef?: (node: HTMLDivElement | null) => void;
}) {
  const stableId = useId();
  const sortableId = item.id || `highlight-${index}-${stableId}`;

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

  const hasText = item.textLists.some(text => text.trim() !== "");
  const hasVideo = item.video.trim() !== "" || !!item.videoFile;
  const hasDuration = item.videoDuration > 0;

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
        isLastInOriginalList && showValidation && (!hasText || !hasVideo) 
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
                  {hasText ? (
                    <h4 className="font-medium text-[var(--color-secondary)]">
                      {item.textLists[0]?.length > 50 ? `${item.textLists[0].substring(0, 50)}...` : item.textLists[0] || "Destaque sem texto"}
                    </h4>
                  ) : (
                    <h4 className="font-medium text-[var(--color-secondary)]/50">
                      Destaque sem texto
                    </h4>
                  )}
                  {hasText && hasVideo && hasDuration ? (
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
              onClick={() => openDeleteSingleModal(originalIndex, item.textLists[0] || "Destaque sem texto")}
              variant="danger"
              className="whitespace-nowrap bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/90 border-none flex items-center gap-2"
              disabled={itemList.length <= 1}
            >
              <Trash2 className="w-4 h-4" />
              Remover
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[var(--color-secondary)]">
                    Textos do Destaque
                  </label>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addTextItem(originalIndex)}
                    className="!p-2 !rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-3">
                  {item.textLists.map((text: string, textIndex: number) => (
                    <div key={textIndex} className="flex items-start gap-2">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder={`Texto ${textIndex + 1}...`}
                          value={text}
                          onChange={(e: any) => handleTextItemChange(originalIndex, textIndex, e.target.value)}
                          className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                          autoFocus={isLastAndEmpty && textIndex === 0}
                        />
                      </div>
                      
                      {item.textLists.length > 1 && (
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => removeTextItem(originalIndex, textIndex)}
                          className="!p-2 !rounded-lg mt-1"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duração do Vídeo (segundos)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-secondary)]/70 w-4 h-4" />
                  <Input
                    type="number"
                    placeholder="Ex: 120"
                    value={item.videoDuration.toString()}
                    onChange={(e: any) => handleChange(originalIndex, "videoDuration", parseInt(e.target.value) || 0)}
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] pl-10"
                    min="0"
                  />
                </div>
                <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
                  Duração em segundos do vídeo
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Vídeo do Destaque <span className="text-xs text-[var(--color-danger)]">*</span>
                  </label>
                  <VideoUpload
                    label="Vídeo do Destaque"
                    description="Formatos suportados: MP4, WEBM, MOV. Tamanho máximo: 50MB."
                    currentVideo={item.video || ""}
                    selectedFile={item.videoFile || null}
                    onFileChange={(file) => handleVideoFileChange(originalIndex, file)}
                    aspectRatio="aspect-video"
                    previewWidth={500}
                    previewHeight={280}
                    maxSizeMB={50}
                    showRemoveButton={true}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    URL do Vídeo <span className="text-xs text-[var(--color-secondary)]/50">- Opcional se fizer upload</span>
                  </label>
                  <Input
                    type="text"
                    value={item.video}
                    onChange={(e: any) => handleChange(originalIndex, "video", e.target.value)}
                    placeholder="Ex: https://videos.unsplash.com/video-..."
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-[var(--color-secondary)]/50">
                    URL do vídeo. Deixe em branco se fizer upload de arquivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function HighlightsPage({ 
  type = "highlights", 
  subtype = "branding-bahia"
}: { 
  type: string; 
  subtype: string; 
}) {
  const defaultHighlightItem = useMemo(() => ({ 
    textLists: [""], 
    video: "",
    videoDuration: 0,
    videoFile: null
  }), []);

  const [localHighlights, setLocalHighlights] = useState<HighlightItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const apiBase = `/api/${subtype}/form`;

  const {
    list: highlightList,
    setList: setHighlightList,
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
  } = useListManagement<HighlightItem>({
    type,
    apiPath: `${apiBase}/${type}`,
    defaultItem: defaultHighlightItem,
    validationFields: ["textLists", "video"]
  });

  // Sincroniza destaques locais
  useEffect(() => {
    setLocalHighlights(highlightList);
  }, [highlightList]);

  const newHighlightRef = useRef<HTMLDivElement>(null);

  const setNewItemRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      newHighlightRef.current = node;
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
      const oldIndex = localHighlights.findIndex((item) => 
        item.id === active.id || item.id?.includes(active.id as string)
      );
      const newIndex = localHighlights.findIndex((item) => 
        item.id === over.id || item.id?.includes(over.id as string)
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newList = arrayMove(localHighlights, oldIndex, newIndex);
        setLocalHighlights(newList);
        setHighlightList(newList);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const filteredList = localHighlights.filter(
        item => item.textLists.some(text => text.trim()) && (item.video.trim() || item.videoFile)
      );

      if (!filteredList.length) {
        setErrorMsg("Adicione ao menos um destaque completo (com texto e vídeo).");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      
      if (exists) fd.append("id", exists.id);
      
      fd.append(
        "values",
        JSON.stringify(
          filteredList.map(({ videoFile, ...rest }) => rest)
        )
      );

      filteredList.forEach((item, i) => {
        if (item.videoFile) {
          fd.append(`video${i}`, item.videoFile);
        }
      });

      const method = exists ? "PUT" : "POST";

      const res = await fetch(`${apiBase}/${type}`, {
        method,
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar destaques");
      }

      const saved = await res.json();

      const normalized = saved.values.map((v: any, i: number) => ({
        ...v,
        id: v.id || `highlight-${Date.now()}-${i}`,
        videoFile: null,
      }));

      setLocalHighlights(normalized);
      setHighlightList(normalized);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof HighlightItem, value: any) => {
    const newList = [...localHighlights];
    
    if (field === 'videoDuration') {
      newList[index] = { ...newList[index], [field]: parseInt(value) || 0 };
    } else {
      newList[index] = { ...newList[index], [field]: value };
    }
    
    setLocalHighlights(newList);
    setHighlightList(newList);
  };

  const handleTextItemChange = (index: number, textIndex: number, value: string) => {
    const newList = [...localHighlights];
    const newItem = { ...newList[index] };
    newItem.textLists = [...newItem.textLists];
    newItem.textLists[textIndex] = value;
    newList[index] = newItem;
    setLocalHighlights(newList);
    setHighlightList(newList);
  };

  const addTextItem = (index: number) => {
    const newList = [...localHighlights];
    const newItem = { ...newList[index] };
    newItem.textLists = [...newItem.textLists, ""];
    newList[index] = newItem;
    setLocalHighlights(newList);
    setHighlightList(newList);
  };

  const removeTextItem = (index: number, textIndex: number) => {
    const newList = [...localHighlights];
    const newItem = { ...newList[index] };
    if (newItem.textLists.length > 1) {
      newItem.textLists = newItem.textLists.filter((_, i) => i !== textIndex);
      newList[index] = newItem;
      setLocalHighlights(newList);
      setHighlightList(newList);
    }
  };

  const handleVideoFileChange = (index: number, file: File | null) => {
    const newList = [...localHighlights];
    newList[index] = { ...newList[index], videoFile: file };
    setLocalHighlights(newList);
    setHighlightList(newList);
  };

  const updateHighlights = async (list: HighlightItem[]) => {
    if (!exists) return;

    const filteredList = list.filter(
      item => item.textLists.some(text => text.trim()) || item.video.trim() || item.videoFile
    );

    const fd = new FormData();
    
    fd.append("id", exists.id);
    
    fd.append(
      "values",
      JSON.stringify(
        filteredList.map(({ videoFile, ...rest }) => rest)
      )
    );

    filteredList.forEach((item, i) => {
      if (item.videoFile) {
        fd.append(`video${i}`, item.videoFile);
      }
    });

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

  const handleAddHighlightItem = () => {
    if (localHighlights.length >= currentPlanLimit) {
      return false;
    }
    
    const newItem: HighlightItem = {
      textLists: [""],
      video: '',
      videoDuration: 0,
      videoFile: null
    };
    
    const updated = [...localHighlights, newItem];
    setLocalHighlights(updated);
    setHighlightList(updated);
    
    setTimeout(() => {
      newHighlightRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const filteredHighlightItems = useMemo(() => {
    let filtered = [...localHighlights];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.textLists.some(text => text.toLowerCase().includes(term)) ||
        item.video.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [localHighlights, searchTerm]);

  const isHighlightLimitReached = localHighlights.length >= currentPlanLimit;
  const canAddNewItem = !isHighlightLimitReached;
  const highlightCompleteCount = localHighlights.filter(item => 
    item.textLists.some(text => text.trim() !== '') && 
    item.video.trim() !== '' && 
    item.videoDuration > 0
  ).length;
  const highlightTotalCount = localHighlights.length;

  const highlightValidationError = isHighlightLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentPlanLimit} itens).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Cada destaque tem: cada texto na lista + vídeo + duração
    localHighlights.forEach(item => {
      total += item.textLists.length + 2; // +2 para vídeo e duração
      
      item.textLists.forEach(text => {
        if (text.trim()) completed++;
      });
      
      if (item.video.trim() || item.videoFile) completed++;
      if (item.videoDuration > 0) completed++;
    });

    return { completed, total };
  };

  const completion = calculateCompletion();

  const stableIds = useMemo(
    () => localHighlights.map((item, index) => item.id ?? `highlight-${index}`),
    [localHighlights]
  );

  return (
    <ManageLayout
      headerIcon={Video}
      title="Destaques"
      description="Gerencie os destaques com vídeos promocionais da sua empresa"
      exists={!!exists}
      itemName="Destaque"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Cabeçalho de Controle */}
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2">
                Gerenciamento de Destaques
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-[var(--color-secondary)]/70">
                    {highlightCompleteCount} de {highlightTotalCount} completos
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
              Buscar Destaques
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-secondary)]/70" />
              <Input
                type="text"
                placeholder="Buscar destaques por texto ou URL do vídeo..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Mensagem de erro */}
        {highlightValidationError && (
          <div className={`p-3 rounded-lg ${isHighlightLimitReached 
            ? 'bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30' 
            : 'bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30'}`}>
            <div className="flex items-start gap-2">
              {isHighlightLimitReached ? (
                <XCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${isHighlightLimitReached 
                ? 'text-[var(--color-danger)]' 
                : 'text-[var(--color-warning)]'}`}>
                {highlightValidationError}
              </p>
            </div>
          </div>
        )}

        {/* Lista de Destaques */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredHighlightItems.length === 0 ? (
              <Card className="p-8 bg-[var(--color-background)]">
                <div className="text-center">
                  <Video className="w-12 h-12 text-[var(--color-secondary)]/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--color-secondary)] mb-2">
                    Nenhum destaque encontrado
                  </h3>
                  <p className="text-sm text-[var(--color-secondary)]/70">
                    {searchTerm ? 'Tente ajustar sua busca ou limpe o filtro' : 'Adicione seu primeiro destaque usando o botão abaixo'}
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
                  {filteredHighlightItems.map((item, index) => {
                    const originalIndex = localHighlights.findIndex(i => i.id === item.id) || index;
                    const hasText = item.textLists.some(text => text.trim() !== "");
                    const hasVideo = item.video.trim() !== "" || !!item.videoFile;
                    const hasDuration = item.videoDuration > 0;
                    const isLastInOriginalList = originalIndex === localHighlights.length - 1;
                    const isLastAndEmpty = isLastInOriginalList && !hasText && !hasVideo && !hasDuration;

                    return (
                      <SortableHighlightItem
                        key={stableIds[index]}
                        item={item}
                        index={index}
                        originalIndex={originalIndex}
                        isLastInOriginalList={isLastInOriginalList}
                        isLastAndEmpty={isLastAndEmpty}
                        showValidation={showValidation}
                        itemList={localHighlights}
                        handleChange={handleChange}
                        handleTextItemChange={handleTextItemChange}
                        addTextItem={addTextItem}
                        removeTextItem={removeTextItem}
                        handleVideoFileChange={handleVideoFileChange}
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
          onAddNew={handleAddHighlightItem}
          isAddDisabled={!canAddNewItem}
          isSaving={loading}
          exists={!!exists}
          totalCount={completion.total}
          itemName="Destaque"
          icon={Video}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => confirmDelete(updateHighlights)}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={localHighlights.length}
        itemName="Destaque"
      />

      <FeedbackMessages success={success} errorMsg={errorMsg} />
    </ManageLayout>
  );
}