/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useCallback, useId, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListManagement } from "@/hooks/useListManagement";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";
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
  FileText,
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

interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  image: string;
  file?: File | null;
}

function SortableServiceItem({
  item,
  index,
  originalIndex,
  isLastInOriginalList,
  isLastAndEmpty,
  showValidation,
  itemList,
  handleChange,
  handleFileChange,
  openDeleteSingleModal,
  getImageUrl,
  setNewItemRef,
}: {
  item: ServiceItem;
  index: number;
  originalIndex: number;
  isLastInOriginalList: boolean;
  isLastAndEmpty: boolean;
  showValidation: boolean;
  itemList: ServiceItem[];
  handleChange: (index: number, field: keyof ServiceItem, value: any) => void;
  handleFileChange: (index: number, file: File | null) => void;
  openDeleteSingleModal: (index: number, title: string) => void;
  getImageUrl: (item: ServiceItem) => string;
  setNewItemRef?: (node: HTMLDivElement | null) => void;
}) {
  const stableId = useId();
  const sortableId = item.id || `service-${index}-${stableId}`;

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

  const hasTitle = item.title.trim() !== "";
  const hasDescription = item.description.trim() !== "";
  const hasImage = Boolean(item.image?.trim() !== "" || item.file);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      
      if (isLastAndEmpty && setNewItemRef) {
        setNewItemRef(node);
      }
    },
    [setNodeRef, isLastAndEmpty, setNewItemRef]
  );

  const imageUrl = getImageUrl(item);

  return (
    <div
      ref={setRefs}
      style={style}
      className={`relative ${isDragging ? 'z-50' : ''}`}
    >
      <Card className={`mb-4 overflow-hidden transition-all duration-300 ${
        isLastInOriginalList && showValidation && (!hasTitle || !hasDescription) 
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
                      {item.title}
                    </h4>
                  ) : (
                    <h4 className="font-medium text-[var(--color-secondary)]/50">
                      Serviço sem título
                    </h4>
                  )}
                  {hasTitle && hasDescription ? (
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
              onClick={() => openDeleteSingleModal(originalIndex, item.title || "Serviço sem título")}
              variant="danger"
              className="whitespace-nowrap bg-[var(--color-danger)] hover:bg-[var(--color-danger)]/90 border-none flex items-center gap-2"
              disabled={itemList.length <= 1}
            >
              <Trash2 className="w-4 h-4" />
              Remover
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Título do Serviço <span className="text-xs text-[var(--color-danger)]">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Ex: Desenvolvimento Web"
                  value={item.title}
                  onChange={(e: any) => handleChange(originalIndex, "title", e.target.value)}
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-medium"
                  autoFocus={isLastAndEmpty}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Descrição <span className="text-xs text-[var(--color-danger)]">*</span>
                </label>
                <TextArea
                  placeholder="Descreva detalhadamente o serviço oferecido..."
                  value={item.description}
                  onChange={(e: any) => handleChange(originalIndex, "description", e.target.value)}
                  rows={5}
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] resize-none"
                />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Imagem do Serviço <span className="text-xs text-[var(--color-secondary)]/50">- Opcional</span>
                  </label>
                  <ImageUpload
                    label="Imagem do Serviço"
                    description="Formatos suportados: JPG, PNG, WEBP. Tamanho recomendado: 800x600px."
                    currentImage={item.image || ""}
                    selectedFile={item.file || null}
                    onFileChange={(file) => handleFileChange(originalIndex, file)}
                    aspectRatio="aspect-video"
                    previewWidth={400}
                    previewHeight={300}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    URL da Imagem <span className="text-xs text-[var(--color-secondary)]/50">- Opcional se fizer upload</span>
                  </label>
                  <Input
                    type="text"
                    value={item.image}
                    onChange={(e: any) => handleChange(originalIndex, "image", e.target.value)}
                    placeholder="Ex: https://images.unsplash.com/photo-..."
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-[var(--color-secondary)]/50">
                    URL da imagem. Deixe em branco se fizer upload de arquivo.
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

export default function ServicesPage({ 
  type = "setors", 
  subtype = "branding-bahia"
}: { 
  type: string; 
  subtype: string; 
}) {
  const defaultServiceItem = useMemo(() => ({ 
    title: "", 
    description: "", 
    image: "",
    file: null
  }), []);

  const [localServices, setLocalServices] = useState<ServiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const apiBase = `/api/${subtype}/form`;

  const {
    list: serviceList,
    setList: setServiceList,
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
  } = useListManagement<ServiceItem>({
    type,
    apiPath: `${apiBase}/${type}`,
    defaultItem: defaultServiceItem,
    validationFields: ["title", "description"]
  });

  // Sincroniza serviços locais
  useEffect(() => {
    setLocalServices(serviceList);
  }, [serviceList]);

  const newServiceRef = useRef<HTMLDivElement>(null);

  const setNewItemRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      newServiceRef.current = node;
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
      const oldIndex = localServices.findIndex((item) => 
        item.id === active.id || item.id?.includes(active.id as string)
      );
      const newIndex = localServices.findIndex((item) => 
        item.id === over.id || item.id?.includes(over.id as string)
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newList = arrayMove(localServices, oldIndex, newIndex);
        setLocalServices(newList);
        setServiceList(newList);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const filteredList = localServices.filter(
        item => item.title.trim() && item.description.trim()
      );

      if (!filteredList.length) {
        setErrorMsg("Adicione ao menos um serviço completo (com título e descrição).");
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

      filteredList.forEach((item, i) => {
        if (item.file) {
          fd.append(`file${i}`, item.file);
        }
      });

      const method = exists ? "PUT" : "POST";

      const res = await fetch(`${apiBase}/${type}`, {
        method,
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar serviços");
      }

      const saved = await res.json();

      const normalized = saved.values.map((v: any, i: number) => ({
        ...v,
        id: v.id || `service-${Date.now()}-${i}`,
        file: null,
      }));

      setLocalServices(normalized);
      setServiceList(normalized);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof ServiceItem, value: any) => {
    const newList = [...localServices];
    newList[index] = { ...newList[index], [field]: value };
    setLocalServices(newList);
    setServiceList(newList);
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newList = [...localServices];
    newList[index] = { ...newList[index], file };
    setLocalServices(newList);
    setServiceList(newList);
  };

  const getImageUrl = (item: ServiceItem): string => {
    if (item.file) {
      return URL.createObjectURL(item.file);
    }
    if (item.image) {
      if (item.image.startsWith('http') || item.image.startsWith('//')) {
        return item.image;
      } else {
        return `https://mavellium.com.br${item.image.startsWith('/') ? '' : '/'}${item.image}`;
      }
    }
    return "";
  };

  const updateServices = async (list: ServiceItem[]) => {
    if (!exists) return;

    const filteredList = list.filter(
      item => item.title.trim() || item.description.trim() || item.file || item.image
    );

    const fd = new FormData();
    
    fd.append("id", exists.id);
    
    fd.append(
      "values",
      JSON.stringify(
        filteredList.map(({ file, ...rest }) => rest)
      )
    );

    filteredList.forEach((item, i) => {
      if (item.file) {
        fd.append(`file${i}`, item.file);
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

  const handleAddServiceItem = () => {
    if (localServices.length >= currentPlanLimit) {
      return false;
    }
    
    const newItem: ServiceItem = {
      title: '',
      description: '',
      image: '',
      file: null
    };
    
    const updated = [...localServices, newItem];
    setLocalServices(updated);
    setServiceList(updated);
    
    setTimeout(() => {
      newServiceRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const filteredServiceItems = useMemo(() => {
    let filtered = [...localServices];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [localServices, searchTerm]);

  const isServiceLimitReached = localServices.length >= currentPlanLimit;
  const canAddNewItem = !isServiceLimitReached;
  const serviceCompleteCount = localServices.filter(item => 
    item.title.trim() !== '' && 
    item.description.trim() !== ''
  ).length;
  const serviceTotalCount = localServices.length;

  const serviceValidationError = isServiceLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentPlanLimit} itens).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Cada serviço tem 3 campos (title, description, image)
    total += localServices.length * 3;
    localServices.forEach(item => {
      if (item.title.trim()) completed++;
      if (item.description.trim()) completed++;
      if (item.image?.trim() || item.file) completed++;
    });

    return { completed, total };
  };

  const completion = calculateCompletion();

  const stableIds = useMemo(
    () => localServices.map((item, index) => item.id ?? `service-${index}`),
    [localServices]
  );

  return (
    <ManageLayout
      headerIcon={HelpCircle}
      title="Serviços"
      description="Gerencie os serviços oferecidos pela sua empresa"
      exists={!!exists}
      itemName="Serviço"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Cabeçalho de Controle */}
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2">
                Gerenciamento de Serviços
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-[var(--color-secondary)]/70">
                    {serviceCompleteCount} de {serviceTotalCount} completos
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
              Buscar Serviços
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-secondary)]/70" />
              <Input
                type="text"
                placeholder="Buscar serviços por título ou descrição..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Mensagem de erro */}
        {serviceValidationError && (
          <div className={`p-3 rounded-lg ${isServiceLimitReached 
            ? 'bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30' 
            : 'bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30'}`}>
            <div className="flex items-start gap-2">
              {isServiceLimitReached ? (
                <XCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${isServiceLimitReached 
                ? 'text-[var(--color-danger)]' 
                : 'text-[var(--color-warning)]'}`}>
                {serviceValidationError}
              </p>
            </div>
          </div>
        )}

        {/* Lista de Serviços */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredServiceItems.length === 0 ? (
              <Card className="p-8 bg-[var(--color-background)]">
                <div className="text-center">
                  <HelpCircle className="w-12 h-12 text-[var(--color-secondary)]/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[var(--color-secondary)] mb-2">
                    Nenhum serviço encontrado
                  </h3>
                  <p className="text-sm text-[var(--color-secondary)]/70">
                    {searchTerm ? 'Tente ajustar sua busca ou limpe o filtro' : 'Adicione seu primeiro serviço usando o botão abaixo'}
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
                  {filteredServiceItems.map((item, index) => {
                    const originalIndex = localServices.findIndex(i => i.id === item.id) || index;
                    const hasTitle = item.title.trim() !== "";
                    const hasDescription = item.description.trim() !== "";
                    const hasImage = Boolean(item.image?.trim() !== "" || item.file);
                    const isLastInOriginalList = originalIndex === localServices.length - 1;
                    const isLastAndEmpty = isLastInOriginalList && !hasTitle && !hasDescription && !hasImage;

                    return (
                      <SortableServiceItem
                        key={stableIds[index]}
                        item={item}
                        index={index}
                        originalIndex={originalIndex}
                        isLastInOriginalList={isLastInOriginalList}
                        isLastAndEmpty={isLastAndEmpty}
                        showValidation={showValidation}
                        itemList={localServices}
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
          onAddNew={handleAddServiceItem}
          isAddDisabled={!canAddNewItem}
          isSaving={loading}
          exists={!!exists}
          totalCount={completion.total}
          itemName="Serviço"
          icon={HelpCircle}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => confirmDelete(updateServices)}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={localServices.length}
        itemName="Serviço"
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