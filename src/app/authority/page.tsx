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
  User,
  Award,
  GraduationCap,
  Target,
  Linkedin,
  Type,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  Italic,
  BarChart,
  Users,
  Zap,
  GripVertical,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
  Link,
  Star,
  Clock
} from "lucide-react";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { SectionHeader } from "@/components/SectionHeader";
import Loading from "@/components/Loading";
import { useJsonManagement } from "@/hooks/useJsonManagement";
import { Button } from "@/components/Button";
import IconSelector from "@/components/IconSelector";
import { ImageUpload } from "@/components/ImageUpload";
import { useSite } from "@/context/site-context";

interface StatItem {
  label: string;
  desc: string;
  icon: string;
}

interface Social {
  label: string;
  url: string;
}

interface ImageData {
  src: string;
  alt: string;
}

interface Title {
  main: string;
  italic: string;
}

interface AuthorityData {
  authority: {
    badge: string;
    title: Title;
    bio: string;
    experienceYears: string;
    stats: StatItem[];
    social: Social;
    image: ImageData;
  };
}

const defaultAuthorityData: AuthorityData = {
  authority: {
    badge: "",
    title: {
      main: "",
      italic: ""
    },
    bio: "",
    experienceYears: "",
    stats: [
      {
        label: "",
        desc: "",
        icon: "ph:graduation-cap-bold"
      }
    ],
    social: {
      label: "",
      url: ""
    },
    image: {
      src: "",
      alt: ""
    }
  }
};

const mergeWithDefaults = (apiData: any, defaultData: AuthorityData): AuthorityData => {
  if (!apiData) return defaultData;
  
  return {
    authority: {
      badge: apiData.authority?.badge || defaultData.authority.badge,
      title: {
        main: apiData.authority?.title?.main || defaultData.authority.title.main,
        italic: apiData.authority?.title?.italic || defaultData.authority.title.italic,
      },
      bio: apiData.authority?.bio || defaultData.authority.bio,
      experienceYears: apiData.authority?.experienceYears || defaultData.authority.experienceYears,
      stats: apiData.authority?.stats || defaultData.authority.stats,
      social: {
        label: apiData.authority?.social?.label || defaultData.authority.social.label,
        url: apiData.authority?.social?.url || defaultData.authority.social.url,
      },
      image: {
        src: apiData.authority?.image?.src || defaultData.authority.image.src,
        alt: apiData.authority?.image?.alt || defaultData.authority.image.alt,
      }
    }
  };
};

export default function AuthorityPage() {
  const { currentSite } = useSite();
  const currentPlanType = currentSite.planType;
  const currentStatsLimit = currentPlanType === 'pro' ? 6 : 4;

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
    fileStates,
    setFileState,
  } = useJsonManagement<AuthorityData>({
    apiPath: "/api/tegbe-institucional/json/authority",
    defaultData: defaultAuthorityData,
    mergeFunction: mergeWithDefaults,
  });

  // Estados para drag & drop
  const [draggingStat, setDraggingStat] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    badge: true,
    title: false,
    bio: false,
    experience: false,
    stats: false,
    social: false,
    image: false,
  });

  // Referência para novo item
  const newStatRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Funções para manipular a lista de stats
  const handleAddStat = () => {
    const stats = pageData.authority.stats;
    if (stats.length >= currentStatsLimit) {
      return false;
    }
    
    const newStat: StatItem = {
      label: "",
      desc: "",
      icon: "ph:star-bold"
    };
    
    const updated = [...stats, newStat];
    updateNested('authority.stats', updated);
    
    setTimeout(() => {
      newStatRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const handleUpdateStat = (index: number, field: keyof StatItem, value: string) => {
    const stats = pageData.authority.stats;
    const updated = [...stats];
    
    if (index >= 0 && index < updated.length) {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      updateNested('authority.stats', updated);
    }
  };

  const handleRemoveStat = (index: number) => {
    const stats = pageData.authority.stats;
    
    if (stats.length <= 2) {
      // Mantém pelo menos dois itens
      updateNested('authority.stats', [
        { label: "", desc: "", icon: "ph:graduation-cap-bold" },
        { label: "", desc: "", icon: "ph:target-bold" }
      ]);
    } else {
      const updated = stats.filter((_, i) => i !== index);
      updateNested('authority.stats', updated);
    }
  };

  // Funções de drag & drop para stats
  const handleStatDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingStat(index);
  };

  const handleStatDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingStat === null || draggingStat === index) return;
    
    const stats = pageData.authority.stats;
    const updated = [...stats];
    const draggedStat = updated[draggingStat];
    
    // Remove o item arrastado
    updated.splice(draggingStat, 1);
    
    // Insere na nova posição
    const newIndex = index > draggingStat ? index : index;
    updated.splice(newIndex, 0, draggedStat);
    
    updateNested('authority.stats', updated);
    setDraggingStat(index);
  };

  const handleStatDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingStat(null);
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
  const isStatValid = (stat: StatItem): boolean => {
    return stat.label.trim() !== '' && stat.desc.trim() !== '' && stat.icon.trim() !== '';
  };

  const isStatLimitReached = pageData.authority.stats.length >= currentStatsLimit;
  const canAddNewStat = !isStatLimitReached;
  const statsCompleteCount = pageData.authority.stats.filter(isStatValid).length;
  const statsTotalCount = pageData.authority.stats.length;

  const statsValidationError = isStatLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentStatsLimit} estatísticas).`
    : null;

  // Função auxiliar para obter File do fileStates
  const getFileFromState = (key: string): File | null => {
    const value = fileStates[key];
    return value instanceof File ? value : null;
  };

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Badge (1 campo)
    total += 1;
    if (pageData.authority.badge.trim()) completed++;

    // Title (2 campos)
    total += 2;
    if (pageData.authority.title.main.trim()) completed++;
    if (pageData.authority.title.italic.trim()) completed++;

    // Bio (1 campo)
    total += 1;
    if (pageData.authority.bio.trim()) completed++;

    // Experience Years (1 campo)
    total += 1;
    if (pageData.authority.experienceYears.trim()) completed++;

    // Stats (3 campos por stat)
    total += pageData.authority.stats.length * 3;
    pageData.authority.stats.forEach(stat => {
      if (stat.label.trim()) completed++;
      if (stat.desc.trim()) completed++;
      if (stat.icon.trim()) completed++;
    });

    // Social (2 campos)
    total += 2;
    if (pageData.authority.social.label.trim()) completed++;
    if (pageData.authority.social.url.trim()) completed++;

    // Image (2 campos + arquivo)
    total += 2;
    if (pageData.authority.image.src.trim()) completed++;
    if (pageData.authority.image.alt.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={User}
      title="Seção Autoridade (O Especialista)"
      description="Gerencie a seção que apresenta a autoridade e expertise do especialista"
      exists={!!exists}
      itemName="Autoridade"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Seção Badge */}
        <div className="space-y-4">
          <SectionHeader
            title="Badge da Seção"
            section="badge"
            icon={Award}
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
                    value={pageData.authority.badge}
                    onChange={(e) => updateNested('authority.badge', e.target.value)}
                    placeholder="Liderança Estratégica"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Texto curto que identifica a seção, geralmente destacando a posição de liderança ou expertise
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
                    Texto Normal
                  </label>
                  <Input
                    value={pageData.authority.title.main}
                    onChange={(e) => updateNested('authority.title.main', e.target.value)}
                    placeholder="Inteligência veterana para a"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Primeira parte do título (normal)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                    <Italic className="w-4 h-4" />
                    Texto em Itálico
                  </label>
                  <Input
                    value={pageData.authority.title.italic}
                    onChange={(e) => updateNested('authority.title.italic', e.target.value)}
                    placeholder="nova era digital."
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg italic"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Segunda parte do título (em itálico/destaque)
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Biografia */}
        <div className="space-y-4">
          <SectionHeader
            title="Biografia"
            section="bio"
            icon={MessageSquare}
            isExpanded={expandedSections.bio}
            onToggle={() => toggleSection("bio")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.bio ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto da Biografia
                  </label>
                  <TextArea
                    value={pageData.authority.bio}
                    onChange={(e) => updateNested('authority.bio', e.target.value)}
                    placeholder="A Branding Bahia é liderada por *Marcos Ramos, estrategista com mais de duas décadas de atuação no mercado nacional. Com MBA em Gestão de Negócios pelo **IBMEC* e mestrado em administração, Marcos une o rigor da gestão comercial à precisão das novas tecnologias de IA."
                    rows={6}
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                    <p><strong>Dicas de formatação:</strong></p>
                    <p>• Use <strong>*texto*</strong> para negrito (ex: *Marcos Ramos*)</p>
                    <p>• Use <strong>**texto**</strong> para itálico (ex: **IBMEC**)</p>
                    <p>• Mantenha o tom profissional e focando na expertise</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Experiência */}
        <div className="space-y-4">
          <SectionHeader
            title="Anos de Experiência"
            section="experience"
            icon={Calendar}
            isExpanded={expandedSections.experience}
            onToggle={() => toggleSection("experience")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.experience ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Anos de Experiência
                  </label>
                  <Input
                    value={pageData.authority.experienceYears}
                    onChange={(e) => updateNested('authority.experienceYears', e.target.value)}
                    placeholder="+25"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-2xl font-bold w-24"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Formato recomendado: +N (ex: +25, +20, +15)
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Estatísticas */}
        <div className="space-y-4">
          <SectionHeader
            title="Estatísticas & Diferenciais"
            section="stats"
            icon={BarChart}
            isExpanded={expandedSections.stats}
            onToggle={() => toggleSection("stats")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.stats ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Diferenciais e Estatísticas
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-[var(--color-secondary)]/70">
                          {statsCompleteCount} de {statsTotalCount} completos
                        </span>
                      </div>
                      <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                      <span className="text-sm text-[var(--color-secondary)]/70">
                        Limite: {currentPlanType === 'pro' ? '6' : '4'} itens
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="button"
                      onClick={handleAddStat}
                      variant="primary"
                      className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                      disabled={!canAddNewStat}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Estatística
                    </Button>
                    {isStatLimitReached && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Limite do plano atingido
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-secondary)]/70">
                  Destaque os principais diferenciais, formações e especialidades.
                </p>
              </div>

              {/* Mensagem de erro */}
              {statsValidationError && (
                <div className={`p-3 rounded-lg ${isStatLimitReached ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'} mb-4`}>
                  <div className="flex items-start gap-2">
                    {isStatLimitReached ? (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${isStatLimitReached ? 'text-red-400' : 'text-yellow-400'}`}>
                      {statsValidationError}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {pageData.authority.stats.map((stat, index) => (
                  <div 
                    key={index}
                    ref={index === pageData.authority.stats.length - 1 ? newStatRef : undefined}
                    draggable
                    onDragStart={(e) => handleStatDragStart(e, index)}
                    onDragOver={(e) => handleStatDragOver(e, index)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleStatDragEnd}
                    onDrop={handleDrop}
                    className={`p-6 border border-[var(--color-border)] rounded-lg space-y-6 transition-all duration-200 ${
                      draggingStat === index 
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
                          onDragStart={(e) => handleStatDragStart(e, index)}
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
                              {stat.label || "Estatística sem nome"}
                            </h4>
                            {isStatValid(stat) ? (
                              <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded-full">
                                Completo
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded-full">
                                Incompleto
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                Título
                              </label>
                              <Input
                                value={stat.label}
                                onChange={(e) => handleUpdateStat(index, 'label', e.target.value)}
                                placeholder="Ex: Formação de Elite"
                                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                              />
                              <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                                Título curto e impactante
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                Descrição
                              </label>
                              <Input
                                value={stat.desc}
                                onChange={(e) => handleUpdateStat(index, 'desc', e.target.value)}
                                placeholder="Ex: Especialista em Comunicação Digital e MBA IBMEC."
                                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                              />
                              <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                                Descrição detalhada do diferencial
                              </p>
                            </div>
                          </div>

                          <div className="mt-6">
                            <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                              Ícone
                            </label>
                            <IconSelector
                              value={stat.icon}
                              onChange={(value) => handleUpdateStat(index, 'icon', value)}
                              placeholder="Selecione um ícone"
                              label="Ícone do diferencial"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={() => handleRemoveStat(index)}
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

        {/* Seção Social */}
        <div className="space-y-4">
          <SectionHeader
            title="Rede Social"
            section="social"
            icon={Linkedin}
            isExpanded={expandedSections.social}
            onToggle={() => toggleSection("social")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.social ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Texto do Link
                    </label>
                    <Input
                      value={pageData.authority.social.label}
                      onChange={(e) => updateNested('authority.social.label', e.target.value)}
                      placeholder="Acompanhe meus insights no LinkedIn"
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                    />
                    <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                      Texto de chamada para a rede social
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      URL do LinkedIn
                    </label>
                    <Input
                      value={pageData.authority.social.url}
                      onChange={(e) => updateNested('authority.social.url', e.target.value)}
                      placeholder="https://www.linkedin.com/newsletters/6888992576293085184/"
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                    />
                    <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                      <p><strong>Link do LinkedIn:</strong> https://www.linkedin.com/...</p>
                      <p className="text-yellow-400">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        Certifique-se de que o link é público e acessível
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Imagem */}
        <div className="space-y-4">
          <SectionHeader
            title="Imagem do Especialista"
            section="image"
            icon={ImageIcon}
            isExpanded={expandedSections.image}
            onToggle={() => toggleSection("image")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.image ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <ImageUpload
                  label="Foto do Especialista"
                  currentImage={pageData.authority.image.src || ''}
                  selectedFile={getFileFromState('authority.image.src')}
                  onFileChange={(file) => setFileState('authority.image.src', file)}
                  aspectRatio="aspect-square"
                  previewWidth={400}
                  previewHeight={400}
                  description="Foto profissional do especialista. Formato recomendado: JPG de alta qualidade com fundo neutro ou transparente."
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto Alternativo (Alt Text)
                  </label>
                  <Input
                    value={pageData.authority.image.alt}
                    onChange={(e) => updateNested('authority.image.alt', e.target.value)}
                    placeholder="Marcos Ramos - Fundador da Branding Bahia"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                    <p>Texto descritivo para acessibilidade e SEO. Inclua nome e posição.</p>
                    <p className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <strong>Formato ideal:</strong> Nome - Cargo/Posição na Empresa
                    </p>
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
          completeCount={completion.completed}
          totalCount={completion.total}
          itemName="Autoridade"
          icon={User}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={pageData.authority.stats.length}
        itemName="Estatística"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}