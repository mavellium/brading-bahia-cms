/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback, useId, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListManagement } from "@/hooks/useListManagement";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { 
  FileText, 
  GripVertical, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  Trash2,
  XCircle,
  Search,
  X,
  Link as LinkIcon,
  Image as ImageIcon
} from "lucide-react";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { ImageUpload } from "@/components/ImageUpload";
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

interface NewsItem {
  id?: string;
  fallback: string;
  title: string;
  file?: File | null;
  image?: string;
  link: string;
}

function SortableNewsItem({
  news,
  index,
  originalIndex,
  isLastInOriginalList,
  isLastAndEmpty,
  showValidation,
  newsList,
  handleChange,
  handleFileChange,
  openDeleteSingleModal,
  getImageUrl,
  setNewItemRef,
}: {
  news: NewsItem;
  index: number;
  originalIndex: number;
  isLastInOriginalList: boolean;
  isLastAndEmpty: boolean;
  showValidation: boolean;
  newsList: NewsItem[];
  handleChange: (index: number, field: keyof NewsItem, value: any) => void;
  handleFileChange: (index: number, file: File | null) => void;
  openDeleteSingleModal: (index: number, title: string) => void;
  getImageUrl: (news: NewsItem) => string;
  setNewItemRef?: (node: HTMLDivElement | null) => void;
}) {
  const stableId = useId();
  const sortableId = news.id || `news-${index}-${stableId}`;

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

  const hasTitle = news.title.trim() !== "";
  const hasFallback = news.fallback.trim() !== "";
  const hasLink = news.link.trim() !== "";
  const hasImage = Boolean(news.image?.trim() !== "" || news.file);
  const imageUrl = getImageUrl(news);

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
        isLastInOriginalList && showValidation && (!hasTitle || !hasFallback) 
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
                  {hasTitle ? (
                    <h4 className="font-medium text-[var(--color-secondary)]">
                      {news.title}
                    </h4>
                  ) : (
                    <h4 className="font-medium text-[var(--color-secondary)]/50">
                      Newsletter sem título
                    </h4>
                  )}
                  {hasTitle && hasFallback && hasLink ? (
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
              onClick={() => openDeleteSingleModal(originalIndex, news.title || "Newsletter sem título")}
              variant="danger"
              className="whitespace-nowrap bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/90 border-none flex items-center gap-2"
              disabled={newsList.length <= 1}
            >
              <Trash2 className="w-4 h-4" />
              Remover
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Imagem da Newsletter
                </label>
                <ImageUpload
                  label="Imagem da Newsletter"
                  description="Formatos suportados: JPG, PNG, WEBP. Tamanho recomendado: 800x400px."
                  currentImage={news.image || ""}
                  selectedFile={news.file || null}
                  onFileChange={(file) => handleFileChange(originalIndex, file)}
                  aspectRatio="aspect-video"
                  previewWidth={300}
                  previewHeight={150}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Título da Newsletter
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Newsletter de Janeiro 2024"
                  value={news.title}
                  onChange={(e: any) => handleChange(originalIndex, "title", e.target.value)}
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Texto Alternativo (Alt)
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Imagem representativa da newsletter sobre tecnologia"
                  value={news.fallback}
                  onChange={(e: any) => handleChange(originalIndex, "fallback", e.target.value)}
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
                <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
                  Texto descritivo para acessibilidade (leitura por screen readers)
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Link da Newsletter
                </label>
                <Input
                  type="text"
                  placeholder="https://exemplo.com/newsletter"
                  value={news.link}
                  onChange={(e: any) => handleChange(originalIndex, "link", e.target.value)}
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
                <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
                  Link para a newsletter completa
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function NewsPage({ 
  type = "newsletter", 
  subtype = "branding-bahia"
}: { 
  type: string; 
  subtype: string; 
}) {
  const defaultNews = useMemo(() => ({ 
    fallback: "", 
    title: "", 
    file: null, 
    link: "", 
    image: "" 
  }), []);

  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const apiBase = `/api/${subtype}/form`;

  const {
    list: newsList,
    setList: setNewsList,
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
  } = useListManagement<NewsItem>({
    type,
    apiPath: `${apiBase}/${type}`,
    defaultItem: defaultNews,
    validationFields: ["title", "fallback"]
  });

  // Sincroniza newsletters locais
  useEffect(() => {
    setLocalNews(newsList);
  }, [newsList]);

  const newNewsRef = useRef<HTMLDivElement>(null);

  const setNewItemRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      newNewsRef.current = node;
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
      const oldIndex = localNews.findIndex((item) => 
        item.id === active.id || item.id?.includes(active.id as string)
      );
      const newIndex = localNews.findIndex((item) => 
        item.id === over.id || item.id?.includes(over.id as string)
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newList = arrayMove(localNews, oldIndex, newIndex);
        setLocalNews(newList);
        setNewsList(newList);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const filteredList = localNews.filter(
        n => n.title.trim() && n.fallback.trim()
      );

      if (!filteredList.length) {
        setErrorMsg("Adicione ao menos uma newsletter completa (com título e texto alternativo).");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      
      if (exists) fd.append("id", exists.id);
      
      fd.append(
        "values",
        JSON.stringify(
          filteredList.map(({ file, ...rest }) => rest)
        )
      );

      filteredList.forEach((n, i) => {
        if (n.file) {
          fd.append(`file${i}`, n.file);
        }
      });

      const method = exists ? "PUT" : "POST";

      const res = await fetch(`${apiBase}/${type}`, {
        method,
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar newsletters");
      }

      const saved = await res.json();

      const normalized = saved.values.map((v: any, i: number) => ({
        ...v,
        id: v.id || `news-${Date.now()}-${i}`,
        file: null,
      }));

      setLocalNews(normalized);
      setNewsList(normalized);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof NewsItem, value: any) => {
    const newList = [...localNews];
    newList[index] = { ...newList[index], [field]: value };
    setLocalNews(newList);
    setNewsList(newList);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newList = [...localNews];
    newList[index] = { ...newList[index], file };
    setLocalNews(newList);
    setNewsList(newList);
  };

  const getImageUrl = (news: NewsItem): string => {
    if (news.file) {
      return URL.createObjectURL(news.file);
    }
    if (news.image) {
      if (news.image.startsWith('http') || news.image.startsWith('//')) {
        return news.image;
      } else {
        return `https://mavellium.com.br${news.image.startsWith('/') ? '' : '/'}${news.image}`;
      }
    }
    return "";
  };

  const updateNews = async (list: NewsItem[]) => {
    if (!exists) return;

    const filteredList = list.filter(
      n => n.fallback.trim() || n.title.trim() || n.file || n.link.trim() || n.image
    );

    const fd = new FormData();
    
    fd.append("id", exists.id);
    
    filteredList.forEach((n, i) => {
      fd.append(`values[${i}][fallback]`, n.fallback);
      fd.append(`values[${i}][title]`, n.title);
      fd.append(`values[${i}][link]`, n.link);
      fd.append(`values[${i}][image]`, n.image || "");
      
      if (n.file) {
        fd.append(`file${i}`, n.file);
      }
      
      if (n.id) {
        fd.append(`values[${i}][id]`, n.id);
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

  const handleAddNews = () => {
    if (localNews.length >= currentPlanLimit) {
      return false;
    }
    
    const newItem: NewsItem = {
      fallback: '',
      title: '',
      file: null, 
      link: '', 
      image: ''
    };
    
    const updated = [...localNews, newItem];
    setLocalNews(updated);
    setNewsList(updated);
    
    setTimeout(() => {
      newNewsRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const filteredNews = useMemo(() => {
    let filtered = [...localNews];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(term) ||
        news.fallback.toLowerCase().includes(term) ||
        news.link.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [localNews, searchTerm]);

  const isNewsLimitReached = localNews.length >= currentPlanLimit;
  const canAddNewNews = !isNewsLimitReached;
  const newsCompleteCount = localNews.filter(news => 
    news.title.trim() !== '' && 
    news.fallback.trim() !== ''
  ).length;
  const newsTotalCount = localNews.length;

  const newsValidationError = isNewsLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentPlanLimit} itens).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Cada newsletter tem 4 campos (fallback, title, link, image)
    total += localNews.length * 4;
    localNews.forEach(news => {
      if (news.title.trim()) completed++;
      if (news.fallback.trim()) completed++;
      if (news.link.trim()) completed++;
      if (news.image?.trim() || news.file) completed++;
    });

    return { completed, total };
  };

  const completion = calculateCompletion();

  const stableIds = useMemo(
    () => localNews.map((item, index) => item.id ?? `news-${index}`),
    [localNews]
  );

  return (
    <ManageLayout
      headerIcon={FileText}
      title="Newsletters"
      description="Gerencie as newsletters da sua empresa"
      exists={!!exists}
      itemName="Newsletter"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Cabeçalho de Controle */}
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2">
                Gerenciamento de Newsletters
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-[var(--color-secondary)]/70">
                    {newsCompleteCount} de {newsTotalCount} completas
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
              Buscar Newsletters
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-secondary)]/70" />
              <Input
                type="text"
                placeholder="Buscar newsletters por título, texto alternativo ou link..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Mensagem de erro */}
        {newsValidationError && (
          <div className={`p-3 rounded-lg ${isNewsLimitReached 
            ? 'bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30' 
            : 'bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30'}`}>
            <div className="flex items-start gap-2">
              {isNewsLimitReached ? (
                <XCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${isNewsLimitReached 
                ? 'text-[var(--color-danger)]' 
                : 'text-[var(--color-warning)]'}`}>
                {newsValidationError}
              </p>
            </div>
          </div>
        )}

        {/* Lista de Newsletters */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNews.length === 0 ? (
              <Card className="p-8 bg-[var(--color-background)]">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-[var(--color-secondary)]/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--color-secondary)] mb-2">
                    Nenhuma newsletter encontrada
                  </h3>
                  <p className="text-sm text-[var(--color-secondary)]/70">
                    {searchTerm ? 'Tente ajustar sua busca ou limpe o filtro' : 'Adicione sua primeira newsletter usando o botão abaixo'}
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
                  {filteredNews.map((news, index) => {
                    const originalIndex = localNews.findIndex(n => n.id === news.id) || index;
                    const hasTitle = news.title.trim() !== "";
                    const hasFallback = news.fallback.trim() !== "";
                    const hasLink = news.link.trim() !== "";
                    const hasImage = Boolean(news.image?.trim() !== "" || news.file);
                    const isLastInOriginalList = originalIndex === localNews.length - 1;
                    const isLastAndEmpty = isLastInOriginalList && !hasTitle && !hasFallback && !hasLink && !hasImage;

                    return (
                      <SortableNewsItem
                        key={stableIds[index]}
                        news={news}
                        index={index}
                        originalIndex={originalIndex}
                        isLastInOriginalList={isLastInOriginalList}
                        isLastAndEmpty={isLastAndEmpty}
                        showValidation={showValidation}
                        newsList={localNews}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                        openDeleteSingleModal={openDeleteSingleModal}
                        getImageUrl={getImageUrl}
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
          onAddNew={handleAddNews}
          isAddDisabled={!canAddNewNews}
          isSaving={loading}
          exists={!!exists}
          totalCount={completion.total}
          itemName="Newsletter"
          icon={FileText}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => confirmDelete(updateNews)}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={localNews.length}
        itemName="Newsletter"
      />

      <FeedbackMessages success={success} errorMsg={errorMsg} />

      {/* Modal de imagem expandida */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onClick={() => setExpandedImage(null)}
                className="absolute -top-4 -right-4 !p-3 !rounded-full bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/90 z-10 border-none"
              >
                <X className="w-5 h-5" />
              </Button>
              <img
                src={expandedImage}
                alt="Preview expandido"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
                onError={(e) => {
                  console.error('Erro ao carregar imagem expandida:', expandedImage);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ManageLayout>
  );
}