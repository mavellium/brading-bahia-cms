/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { Switch } from "@/components/Switch";
import { 
  Layout,
  MapPin,
  Type,
  Settings,
  CheckCircle2,
  AlertCircle,
  XCircle,
  GripVertical,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Tag,
  Navigation,
  Target,
  ListChecks,
  Compass,
  Zap,
  Map,
  Clock,
  GitBranch
} from "lucide-react";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { SectionHeader } from "@/components/SectionHeader";
import Loading from "@/components/Loading";
import { useJsonManagement } from "@/hooks/useJsonManagement";
import { Button } from "@/components/Button";
import ColorPicker from "@/components/ColorPicker";
import { useSite } from "@/context/site-context";

interface MainTitle {
  text: string;
  highlight: string;
}

interface Step {
  tag: string;
  title: string;
  desc: string;
}

interface StrategicData {
  strategic: {
    badge: string;
    mainTitle: MainTitle;
    description: string;
    steps: Step[];
    coordinates: string;
  };
}

const defaultStrategicData: StrategicData = {
  strategic: {
    badge: "",
    mainTitle: {
      text: "",
      highlight: ""
    },
    description: "",
    steps: [
      {
        tag: "FASE 01",
        title: "",
        desc: ""
      }
    ],
    coordinates: ""
  }
};

const mergeWithDefaults = (apiData: any, defaultData: StrategicData): StrategicData => {
  if (!apiData) return defaultData;
  
  return {
    strategic: {
      badge: apiData.strategic?.badge || defaultData.strategic.badge,
      mainTitle: {
        text: apiData.strategic?.mainTitle?.text || defaultData.strategic.mainTitle.text,
        highlight: apiData.strategic?.mainTitle?.highlight || defaultData.strategic.mainTitle.highlight,
      },
      description: apiData.strategic?.description || defaultData.strategic.description,
      steps: apiData.strategic?.steps || defaultData.strategic.steps,
      coordinates: apiData.strategic?.coordinates || defaultData.strategic.coordinates,
    }
  };
};

export default function StrategicPage() {
  const { currentSite } = useSite();
  const currentPlanType = currentSite.planType;
  const currentStepsLimit = currentPlanType === 'pro' ? 8 : 4;

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
  } = useJsonManagement<StrategicData>({
    apiPath: "/api/tegbe-institucional/json/strategic",
    defaultData: defaultStrategicData,
    mergeFunction: mergeWithDefaults,
  });

  // Estados para drag & drop
  const [draggingStep, setDraggingStep] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    badge: true,
    mainTitle: false,
    description: false,
    steps: false,
    coordinates: false,
  });

  // Referência para novo item
  const newStepRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Funções para manipular a lista de passos
  const handleAddStep = () => {
    const steps = pageData.strategic.steps;
    if (steps.length >= currentStepsLimit) {
      return false;
    }
    
    const newStep: Step = {
      tag: `FASE ${(steps.length + 1).toString().padStart(2, '0')}`,
      title: "",
      desc: ""
    };
    
    const updated = [...steps, newStep];
    updateNested('strategic.steps', updated);
    
    setTimeout(() => {
      newStepRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const handleUpdateStep = (index: number, updates: Partial<Step>) => {
    const steps = pageData.strategic.steps;
    const updated = [...steps];
    if (index >= 0 && index < updated.length) {
      updated[index] = { ...updated[index], ...updates };
      updateNested('strategic.steps', updated);
    }
  };

  const handleRemoveStep = (index: number) => {
    const steps = pageData.strategic.steps;
    
    if (steps.length <= 1) {
      // Mantém pelo menos um passo vazio
      const emptyStep: Step = {
        tag: "FASE 01",
        title: "",
        desc: ""
      };
      updateNested('strategic.steps', [emptyStep]);
    } else {
      const updated = steps.filter((_, i) => i !== index);
      updateNested('strategic.steps', updated);
    }
  };

  // Funções de drag & drop para passos
  const handleStepDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingStep(index);
  };

  const handleStepDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingStep === null || draggingStep === index) return;
    
    const steps = pageData.strategic.steps;
    const updated = [...steps];
    const draggedStep = updated[draggingStep];
    
    // Remove o item arrastado
    updated.splice(draggingStep, 1);
    
    // Insere na nova posição
    const newIndex = index > draggingStep ? index : index;
    updated.splice(newIndex, 0, draggedStep);
    
    updateNested('strategic.steps', updated);
    setDraggingStep(index);
  };

  const handleStepDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingStep(null);
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
  const isStepValid = (step: Step): boolean => {
    return step.tag.trim() !== '' && step.title.trim() !== '' && step.desc.trim() !== '';
  };

  const isStepLimitReached = pageData.strategic.steps.length >= currentStepsLimit;
  const canAddNewStep = !isStepLimitReached;
  const stepsCompleteCount = pageData.strategic.steps.filter(isStepValid).length;
  const stepsTotalCount = pageData.strategic.steps.length;

  const stepsValidationError = isStepLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentStepsLimit} fases).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Badge (1 campo)
    total += 1;
    if (pageData.strategic.badge.trim()) completed++;

    // MainTitle (2 campos)
    total += 2;
    if (pageData.strategic.mainTitle.text.trim()) completed++;
    if (pageData.strategic.mainTitle.highlight.trim()) completed++;

    // Description (1 campo)
    total += 1;
    if (pageData.strategic.description.trim()) completed++;

    // Steps (3 campos por passo)
    total += pageData.strategic.steps.length * 3;
    pageData.strategic.steps.forEach(step => {
      if (step.tag.trim()) completed++;
      if (step.title.trim()) completed++;
      if (step.desc.trim()) completed++;
    });

    // Coordinates (1 campo)
    total += 1;
    if (pageData.strategic.coordinates.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={Navigation}
      title="Metodologia Estratégica"
      description="Gerencie o processo estratégico em fases e metodologia"
      exists={!!exists}
      itemName="Metodologia Estratégica"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Seção Badge */}
        <div className="space-y-4">
          <SectionHeader
            title="Badge / Tag"
            section="badge"
            icon={Tag}
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
                    Badge da Metodologia
                  </label>
                  <Input
                    value={pageData.strategic.badge}
                    onChange={(e) => updateNested('strategic.badge', e.target.value)}
                    placeholder="Metodologia Branding Bahia"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Nome da metodologia ou processo estratégico
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Título Principal */}
        <div className="space-y-4">
          <SectionHeader
            title="Título Principal"
            section="mainTitle"
            icon={Type}
            isExpanded={expandedSections.mainTitle}
            onToggle={() => toggleSection("mainTitle")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.mainTitle ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                      Texto Normal
                    </label>
                    <Input
                      value={pageData.strategic.mainTitle.text}
                      onChange={(e) => updateNested('strategic.mainTitle.text', e.target.value)}
                      placeholder="O Caminho do"
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                    />
                    <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                      Primeira parte do título
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                      Texto em Destaque
                    </label>
                    <Input
                      value={pageData.strategic.mainTitle.highlight}
                      onChange={(e) => updateNested('strategic.mainTitle.highlight', e.target.value)}
                      placeholder="Farol."
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg font-semibold"
                    />
                    <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                      Parte do título que será destacada visualmente
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Descrição */}
        <div className="space-y-4">
          <SectionHeader
            title="Descrição da Metodologia"
            section="description"
            icon={GitBranch}
            isExpanded={expandedSections.description}
            onToggle={() => toggleSection("description")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.description ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Descrição Resumida
                  </label>
                  <TextArea
                    value={pageData.strategic.description}
                    onChange={(e) => updateNested('strategic.description', e.target.value)}
                    placeholder="Um processo de engenharia digital focado em tirar sua marca da sombra e levá-la ao faturamento."
                    rows={4}
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Descrição breve que explica o propósito da metodologia
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Fases/Passos */}
        <div className="space-y-4">
          <SectionHeader
            title="Fases da Metodologia"
            section="steps"
            icon={ListChecks}
            isExpanded={expandedSections.steps}
            onToggle={() => toggleSection("steps")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.steps ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Fases do Processo
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-[var(--color-secondary)]/70">
                          {stepsCompleteCount} de {stepsTotalCount} completos
                        </span>
                      </div>
                      <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                      <span className="text-sm text-[var(--color-secondary)]/70">
                        Limite: {currentPlanType === 'pro' ? '8' : '4'} fases
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="button"
                      onClick={handleAddStep}
                      variant="primary"
                      className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                      disabled={!canAddNewStep}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Fase
                    </Button>
                    {isStepLimitReached && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Limite do plano atingido
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-secondary)]/70">
                  Defina as fases do seu processo estratégico em ordem sequencial.
                </p>
              </div>

              {/* Mensagem de erro */}
              {stepsValidationError && (
                <div className={`p-3 rounded-lg ${isStepLimitReached ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'} mb-4`}>
                  <div className="flex items-start gap-2">
                    {isStepLimitReached ? (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${isStepLimitReached ? 'text-red-400' : 'text-yellow-400'}`}>
                      {stepsValidationError}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {pageData.strategic.steps.map((step, index) => (
                  <div 
                    key={index}
                    ref={index === pageData.strategic.steps.length - 1 ? newStepRef : undefined}
                    draggable
                    onDragStart={(e) => handleStepDragStart(e, index)}
                    onDragOver={(e) => handleStepDragOver(e, index)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleStepDragEnd}
                    onDrop={handleDrop}
                    className={`p-6 border border-[var(--color-border)] rounded-lg space-y-6 transition-all duration-200 ${
                      draggingStep === index 
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
                          onDragStart={(e) => handleStepDragStart(e, index)}
                        >
                          <GripVertical className="w-5 h-5 text-[var(--color-secondary)]/70" />
                        </div>
                        
                        {/* Indicador de posição */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30">
                            <span className="text-sm font-bold text-[var(--color-primary)]">
                              {index + 1}
                            </span>
                          </div>
                          <div className="w-px h-4 bg-[var(--color-border)] mt-1"></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-[var(--color-secondary)]">
                              {step.title || "Fase sem título"}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500">
                                {step.tag || "FASE"}
                              </span>
                              {isStepValid(step) ? (
                                <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded-full">
                                  Completo
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded-full">
                                  Incompleto
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                  Tag/Número da Fase
                                </label>
                                <Input
                                  value={step.tag}
                                  onChange={(e) => handleUpdateStep(index, { tag: e.target.value })}
                                  placeholder="FASE 01"
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-semibold"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                  Título da Fase
                                </label>
                                <Input
                                  value={step.title}
                                  onChange={(e) => handleUpdateStep(index, { title: e.target.value })}
                                  placeholder="Diagnóstico & Estratégia"
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                  Descrição da Fase
                                </label>
                                <TextArea
                                  value={step.desc}
                                  onChange={(e) => handleUpdateStep(index, { desc: e.target.value })}
                                  placeholder="Analisamos seu funil atual e mapeamos gargalos comerciais..."
                                  rows={4}
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={() => handleRemoveStep(index)}
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

        {/* Seção Coordenadas */}
        <div className="space-y-4">
          <SectionHeader
            title="Coordenadas & Localização"
            section="coordinates"
            icon={MapPin}
            isExpanded={expandedSections.coordinates}
            onToggle={() => toggleSection("coordinates")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.coordinates ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    Coordenadas Geográficas
                  </label>
                  <Input
                    value={pageData.strategic.coordinates}
                    onChange={(e) => updateNested('strategic.coordinates', e.target.value)}
                    placeholder="Lat: -12.9714 | Long: -38.5014"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                  />
                  <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                    <p>Coordenadas geográficas que simbolizam localização ou referência estratégica.</p>
                    <p><strong>Formato:</strong> Lat: XX.XXXX | Long: XX.XXXX</p>
                    <p><strong>Exemplo:</strong> Lat: -12.9714 | Long: -38.5014 (Salvador, BA)</p>
                  </div>
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
          totalCount={completion.total}
          itemName="Metodologia Estratégica"
          icon={Navigation}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={pageData.strategic.steps.length}
        itemName="Fase"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}