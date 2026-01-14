/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { 
  Layout,
  Settings,
  Zap,
  Target,
  Palette,
  Type,
  Sparkles,
  GripVertical,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
  Bold,
  Hash,
  ListChecks,
  Rocket,
  Cpu,
  Globe,
  Search,
  Briefcase
} from "lucide-react";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { SectionHeader } from "@/components/SectionHeader";
import Loading from "@/components/Loading";
import { useJsonManagement } from "@/hooks/useJsonManagement";
import { Button } from "@/components/Button";
import IconSelector from "@/components/IconSelector";
import { useSite } from "@/context/site-context";

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

interface Title {
  main: string;
  highlight: string;
}

interface ServicesArsenalData {
  servicesArsenal: {
    badge: string;
    title: Title;
    services: ServiceItem[];
    ctaText: string;
  };
}

const defaultServicesArsenalData: ServicesArsenalData = {
  servicesArsenal: {
    badge: "",
    title: {
      main: "",
      highlight: ""
    },
    services: [
      {
        id: "01",
        title: "",
        desc: "",
        icon: "ph:chart-line-up-bold"
      }
    ],
    ctaText: ""
  }
};

const mergeWithDefaults = (apiData: any, defaultData: ServicesArsenalData): ServicesArsenalData => {
  if (!apiData) return defaultData;
  
  return {
    servicesArsenal: {
      badge: apiData.servicesArsenal?.badge || defaultData.servicesArsenal.badge,
      title: {
        main: apiData.servicesArsenal?.title?.main || defaultData.servicesArsenal.title.main,
        highlight: apiData.servicesArsenal?.title?.highlight || defaultData.servicesArsenal.title.highlight,
      },
      services: apiData.servicesArsenal?.services || defaultData.servicesArsenal.services,
      ctaText: apiData.servicesArsenal?.ctaText || defaultData.servicesArsenal.ctaText,
    }
  };
};

export default function ServicesArsenalPage() {
  const { currentSite } = useSite();
  const currentPlanType = currentSite.planType;
  const currentServicesLimit = currentPlanType === 'pro' ? 8 : 6;

  const {
    data: pageData,
    exists,
    loading,
    success,
    errorMsg,
    deleteModal,
    updateNested,
    save,
    openDeleteAllModal,
    closeDeleteModal,
    confirmDelete,
  } = useJsonManagement<ServicesArsenalData>({
    apiPath: "/api/tegbe-institucional/json/services",
    defaultData: defaultServicesArsenalData,
    mergeFunction: mergeWithDefaults,
  });

  // Estados para drag & drop
  const [draggingService, setDraggingService] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    badge: true,
    title: false,
    services: false,
    cta: false,
  });

  // Referência para novo item
  const newServiceRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Funções para manipular a lista de serviços
  const handleAddService = () => {
    const services = pageData.servicesArsenal.services;
    if (services.length >= currentServicesLimit) {
      return false;
    }
    
    // Gerar ID sequencial baseado nos existentes
    const existingIds = services.map(service => parseInt(service.id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newId = (maxId + 1).toString().padStart(2, '0');
    
    const newService: ServiceItem = {
      id: newId,
      title: "",
      desc: "",
      icon: "ph:star-bold"
    };
    
    const updated = [...services, newService];
    updateNested('servicesArsenal.services', updated);
    
    setTimeout(() => {
      newServiceRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const handleUpdateService = (index: number, field: keyof ServiceItem, value: string) => {
    const services = pageData.servicesArsenal.services;
    const updated = [...services];
    
    if (index >= 0 && index < updated.length) {
      // Se estiver atualizando o ID, formatar para 2 dígitos
      if (field === 'id') {
        const numericValue = value.replace(/\D/g, '');
        const paddedValue = numericValue.padStart(2, '0');
        updated[index] = {
          ...updated[index],
          [field]: paddedValue
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      updateNested('servicesArsenal.services', updated);
    }
  };

  const handleRemoveService = (index: number) => {
    const services = pageData.servicesArsenal.services;
    
    if (services.length <= 1) {
      // Mantém pelo menos um serviço
      updateNested('servicesArsenal.services', [{
        id: "01",
        title: "",
        desc: "",
        icon: "ph:chart-line-up-bold"
      }]);
    } else {
      const updated = services.filter((_, i) => i !== index);
      // Reorganizar IDs após remoção
      const renumbered = updated.map((service, idx) => ({
        ...service,
        id: (idx + 1).toString().padStart(2, '0')
      }));
      updateNested('servicesArsenal.services', renumbered);
    }
  };

  // Funções de drag & drop para serviços
  const handleServiceDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingService(index);
  };

  const handleServiceDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingService === null || draggingService === index) return;
    
    const services = pageData.servicesArsenal.services;
    const updated = [...services];
    const draggedService = updated[draggingService];
    
    // Remove o item arrastado
    updated.splice(draggingService, 1);
    
    // Insere na nova posição
    const newIndex = index > draggingService ? index : index;
    updated.splice(newIndex, 0, draggedService);
    
    // Reorganizar IDs após reordenação
    const renumbered = updated.map((service, idx) => ({
      ...service,
      id: (idx + 1).toString().padStart(2, '0')
    }));
    
    updateNested('servicesArsenal.services', renumbered);
    setDraggingService(newIndex);
  };

  const handleServiceDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingService(null);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      await save();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  // Validações
  const isServiceValid = (service: ServiceItem): boolean => {
    return service.title.trim() !== '' && service.desc.trim() !== '' && service.icon.trim() !== '';
  };

  const isServicesLimitReached = pageData.servicesArsenal.services.length >= currentServicesLimit;
  const canAddNewService = !isServicesLimitReached;
  const servicesCompleteCount = pageData.servicesArsenal.services.filter(isServiceValid).length;
  const servicesTotalCount = pageData.servicesArsenal.services.length;

  const servicesValidationError = isServicesLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentServicesLimit} serviços).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Badge (1 campo)
    total += 1;
    if (pageData.servicesArsenal.badge.trim()) completed++;

    // Title (2 campos)
    total += 2;
    if (pageData.servicesArsenal.title.main.trim()) completed++;
    if (pageData.servicesArsenal.title.highlight.trim()) completed++;

    // Services (3 campos por serviço)
    total += pageData.servicesArsenal.services.length * 3;
    pageData.servicesArsenal.services.forEach(service => {
      if (service.title.trim()) completed++;
      if (service.desc.trim()) completed++;
      if (service.icon.trim()) completed++;
    });

    // CTA (1 campo)
    total += 1;
    if (pageData.servicesArsenal.ctaText.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={Settings}
      title="Seção Arsenal de Serviços"
      description="Gerencie os serviços oferecidos pela empresa"
      exists={!!exists}
      itemName="Arsenal de Serviços"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Seção Badge */}
        <div className="space-y-4">
          <SectionHeader
            title="Badge da Seção"
            section="badge"
            icon={Briefcase}
            isExpanded={expandedSections.badge}
            onToggle={() => toggleSection("badge")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.badge ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Badge / Tag
                  </label>
                  <Input
                    value={pageData.servicesArsenal.badge}
                    onChange={(e) => updateNested('servicesArsenal.badge', e.target.value)}
                    placeholder="Arsenal de Tecnologia"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Texto curto que identifica a seção de serviços
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Título */}
        <div className="space-y-4">
          <SectionHeader
            title="Título Principal"
            section="title"
            icon={Type}
            isExpanded={expandedSections.title}
            onToggle={() => toggleSection("title")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.title ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Primeira Parte (Normal)
                  </label>
                  <Input
                    value={pageData.servicesArsenal.title.main}
                    onChange={(e) => updateNested('servicesArsenal.title.main', e.target.value)}
                    placeholder="SOLUÇÕES"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-2xl font-bold uppercase"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Primeira parte do título (geralmente em caixa alta)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                    <Bold className="w-4 h-4" />
                    Segunda Parte (Destaque)
                  </label>
                  <Input
                    value={pageData.servicesArsenal.title.highlight}
                    onChange={(e) => updateNested('servicesArsenal.title.highlight', e.target.value)}
                    placeholder="DE IMPACTO."
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-2xl font-bold uppercase italic"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Segunda parte do título (destaque, geralmente em caixa alta e itálico)
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Serviços */}
        <div className="space-y-4">
          <SectionHeader
            title="Lista de Serviços"
            section="services"
            icon={ListChecks}
            isExpanded={expandedSections.services}
            onToggle={() => toggleSection("services")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.services ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Serviços Oferecidos
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-[var(--color-secondary)]/70">
                          {servicesCompleteCount} de {servicesTotalCount} completos
                        </span>
                      </div>
                      <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                      <span className="text-sm text-[var(--color-secondary)]/70">
                        Limite: {currentPlanType === 'pro' ? '8' : '6'} serviços
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="button"
                      onClick={handleAddService}
                      variant="primary"
                      className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                      disabled={!canAddNewService}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Serviço
                    </Button>
                    {isServicesLimitReached && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Limite do plano atingido
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-secondary)]/70">
                  Liste os principais serviços oferecidos pela empresa. Use IDs sequenciais de 2 dígitos.
                </p>
              </div>

              {/* Mensagem de erro */}
              {servicesValidationError && (
                <div className={`p-3 rounded-lg ${isServicesLimitReached ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'} mb-4`}>
                  <div className="flex items-start gap-2">
                    {isServicesLimitReached ? (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${isServicesLimitReached ? 'text-red-400' : 'text-yellow-400'}`}>
                      {servicesValidationError}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {pageData.servicesArsenal.services.map((service, index) => (
                  <div 
                    key={index}
                    ref={index === pageData.servicesArsenal.services.length - 1 ? newServiceRef : undefined}
                    draggable
                    onDragStart={(e) => handleServiceDragStart(e, index)}
                    onDragOver={(e) => handleServiceDragOver(e, index)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleServiceDragEnd}
                    onDrop={handleDrop}
                    className={`p-6 border border-[var(--color-border)] rounded-lg space-y-6 transition-all duration-200 ${
                      draggingService === index 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' 
                        : 'hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Handle para drag & drop */}
                        <div 
                          className="cursor-grab active:cursor-grabbing p-2 hover:bg-[var(--color-background)]/50 rounded transition-colors"
                          draggable
                          onDragStart={(e) => handleServiceDragStart(e, index)}
                        >
                          <GripVertical className="w-5 h-5 text-[var(--color-secondary)]/70" />
                        </div>
                        
                        {/* Indicador de posição com ID */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30">
                            <span className="text-lg font-bold text-[var(--color-primary)] font-mono">
                              {service.id}
                            </span>
                          </div>
                          <div className="w-px h-4 bg-[var(--color-border)] mt-1"></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-[var(--color-secondary)] text-lg">
                              {service.title || "Serviço sem título"}
                            </h4>
                            {isServiceValid(service) ? (
                              <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded-full">
                                Completo
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded-full">
                                Incompleto
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                  ID do Serviço
                                </label>
                                <Input
                                  value={service.id}
                                  onChange={(e) => handleUpdateService(index, 'id', e.target.value)}
                                  placeholder="01, 02, 03..."
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                                />
                                <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                                  Use números de 2 dígitos (ex: 01, 02, 03...)
                                </p>
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                  Título do Serviço
                                </label>
                                <Input
                                  value={service.title}
                                  onChange={(e) => handleUpdateService(index, 'title', e.target.value)}
                                  placeholder="Ex: Tráfego Pago de Elite"
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg font-semibold"
                                />
                                <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                                  Nome do serviço (seja claro e impactante)
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                Descrição do Serviço
                              </label>
                              <TextArea
                                value={service.desc}
                                onChange={(e) => handleUpdateService(index, 'desc', e.target.value)}
                                placeholder="Ex: Campanhas agressivas no Google, Meta e TikTok focadas em atrair clientes qualificados e impulsionar suas vendas imediatamente. [cite: 521, 575]"
                                rows={3}
                                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                Ícone do Serviço
                              </label>
                              <IconSelector
                                value={service.icon}
                                onChange={(value) => handleUpdateService(index, 'icon', value)}
                                placeholder="Selecione um ícone"
                                label="Ícone representativo do serviço"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={() => handleRemoveService(index)}
                          variant="danger"
                          className="whitespace-nowrap bg-red-600 hover:bg-red-700 border-none flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção CTA */}
        <div className="space-y-4">
          <SectionHeader
            title="Call to Action"
            section="cta"
            icon={MessageSquare}
            isExpanded={expandedSections.cta}
            onToggle={() => toggleSection("cta")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.cta ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto do Botão de Ação
                  </label>
                  <Input
                    value={pageData.servicesArsenal.ctaText}
                    onChange={(e) => updateNested('servicesArsenal.ctaText', e.target.value)}
                    placeholder="Agendar Consultoria"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg font-semibold"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Texto do botão que incentiva o cliente a agir (ex: &quot;Agendar Consultoria&quot;, &quot;Solicitar Orçamento&quot;)
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <FixedActionBar
          onDeleteAll={openDeleteAllModal}
          onSubmit={handleSubmit}
          isAddDisabled={false}
          isSaving={loading}
          exists={!!exists}
          completeCount={completion.completed}
          totalCount={completion.total}
          itemName="Arsenal de Serviços"
          icon={Settings}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={pageData.servicesArsenal.services.length}
        itemName="Serviço"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}