/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Switch } from "@/components/Switch";
import IconSelector from "@/components/IconSelector";
import { 
  Layout,
  Menu,
  Phone,
  MessageCircle,
  Home,
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
  Type,
  Palette,
  Globe,
  ExternalLink,
  Hash
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

interface NavigationItem {
  label: string;
  sectionId: string;
  isExternal: boolean;
}

interface ContactInfo {
  buttonText: string;
  whatsappNumber: string;
}

interface LogoConfig {
  textFirst: string;
  textSecond: string;
  accentColor: string;
}

interface HeaderData {
  logo: LogoConfig;
  navigation: NavigationItem[];
  contact: ContactInfo;
}

const defaultHeaderData: HeaderData = {
  logo: {
    textFirst: "",
    textSecond: "",
    accentColor: ""
  },
  navigation: [
    {
      label: "",
      sectionId: "",
      isExternal: false
    }
  ],
  contact: {
    buttonText: "",
    whatsappNumber: ""
  }
};

const mergeWithDefaults = (apiData: any, defaultData: HeaderData): HeaderData => {
  if (!apiData) return defaultData;
  
  return {
    logo: {
      textFirst: apiData.logo?.textFirst || defaultData.logo.textFirst,
      textSecond: apiData.logo?.textSecond || defaultData.logo.textSecond,
      accentColor: apiData.logo?.accentColor || defaultData.logo.accentColor,
    },
    navigation: apiData.navigation || defaultData.navigation,
    contact: {
      buttonText: apiData.contact?.buttonText || defaultData.contact.buttonText,
      whatsappNumber: apiData.contact?.whatsappNumber || defaultData.contact.whatsappNumber,
    },
  };
};

// Componente ColorPropertyInput ajustado
interface ColorPropertyInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

const ColorPropertyInput = ({ 
  label, 
  value, 
  onChange, 
  description 
}: ColorPropertyInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--color-secondary)]">
          {label}
        </label>
      </div>
      {description && (
        <p className="text-xs text-[var(--color-secondary)]/70">{description}</p>
      )}
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder="#000000"
          className="flex-1 font-mono bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
        />
        <ColorPicker
          color={value}
          onChange={onChange}
        />
        <div 
          className="w-10 h-10 rounded-lg border border-[var(--color-border)]"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
};

export default function HeaderPage() {
  const { currentSite } = useSite();
  const currentPlanType = currentSite.planType;
  const currentNavigationLimit = currentPlanType === 'pro' ? 10 : 6;

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
  } = useJsonManagement<HeaderData>({
    apiPath: "/api/tegbe-institucional/json/header",
    defaultData: defaultHeaderData,
    mergeFunction: mergeWithDefaults,
  });

  // Estados para drag & drop
  const [draggingNavigation, setDraggingNavigation] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    logo: true,
    navigation: false,
    contact: false,
  });

  // Referência para novo item
  const newNavigationRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Funções para manipular a lista de navegação
  const handleAddNavigation = () => {
    const navigation = pageData.navigation;
    if (navigation.length >= currentNavigationLimit) {
      return false;
    }
    
    const newNavigation: NavigationItem = {
      label: "",
      sectionId: "",
      isExternal: false
    };
    
    const updated = [...navigation, newNavigation];
    updateNested('navigation', updated);
    
    setTimeout(() => {
      newNavigationRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const handleUpdateNavigation = (index: number, updates: Partial<NavigationItem>) => {
    const navigation = pageData.navigation;
    const updated = [...navigation];
    if (index >= 0 && index < updated.length) {
      updated[index] = { ...updated[index], ...updates };
      updateNested('navigation', updated);
    }
  };

  const handleRemoveNavigation = (index: number) => {
    const navigation = pageData.navigation;
    
    if (navigation.length <= 1) {
      // Mantém pelo menos um item vazio
      const emptyNavigation: NavigationItem = {
        label: "",
        sectionId: "",
        isExternal: false
      };
      updateNested('navigation', [emptyNavigation]);
    } else {
      const updated = navigation.filter((_, i) => i !== index);
      updateNested('navigation', updated);
    }
  };

  // Funções de drag & drop para navegação
  const handleNavigationDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingNavigation(index);
  };

  const handleNavigationDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingNavigation === null || draggingNavigation === index) return;
    
    const navigation = pageData.navigation;
    const updated = [...navigation];
    const draggedNavigation = updated[draggingNavigation];
    
    // Remove o item arrastado
    updated.splice(draggingNavigation, 1);
    
    // Insere na nova posição
    const newIndex = index > draggingNavigation ? index : index;
    updated.splice(newIndex, 0, draggedNavigation);
    
    updateNested('navigation', updated);
    setDraggingNavigation(index);
  };

  const handleNavigationDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingNavigation(null);
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
  const isNavigationValid = (nav: NavigationItem): boolean => {
    return nav.label.trim() !== '' && nav.sectionId.trim() !== '';
  };

  const isNavigationLimitReached = pageData.navigation.length >= currentNavigationLimit;
  const canAddNewNavigation = !isNavigationLimitReached;
  const navigationCompleteCount = pageData.navigation.filter(isNavigationValid).length;
  const navigationTotalCount = pageData.navigation.length;

  const navigationValidationError = isNavigationLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentNavigationLimit} itens de navegação).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Logo (3 campos)
    total += 3;
    if (pageData.logo.textFirst.trim()) completed++;
    if (pageData.logo.textSecond.trim()) completed++;
    if (pageData.logo.accentColor.trim()) completed++;

    // Navigation (3 campos por item)
    total += pageData.navigation.length * 3;
    pageData.navigation.forEach(nav => {
      if (nav.label.trim()) completed++;
      if (nav.sectionId.trim()) completed++;
      if (nav.isExternal !== undefined) completed++;
    });

    // Contact (2 campos)
    total += 2;
    if (pageData.contact.buttonText.trim()) completed++;
    if (pageData.contact.whatsappNumber.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={Menu}
      title="Configurações do Cabeçalho"
      description="Gerencie o logo, menu de navegação e informações de contato"
      exists={!!exists}
      itemName="Cabeçalho"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Seção Logo */}
        <div className="space-y-4">
          <SectionHeader
            title="Logo & Marca"
            section="logo"
            icon={Tag}
            isExpanded={expandedSections.logo}
            onToggle={() => toggleSection("logo")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.logo ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)]">
                      Primeiro Texto
                    </label>
                    <Input
                      value={pageData.logo.textFirst}
                      onChange={(e) => updateNested('logo.textFirst', e.target.value)}
                      placeholder="BRANDING"
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-bold text-lg"
                    />
                    <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                      Primeira parte do texto do logo
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)]">
                      Segundo Texto
                    </label>
                    <Input
                      value={pageData.logo.textSecond}
                      onChange={(e) => updateNested('logo.textSecond', e.target.value)}
                      placeholder="BAHIA"
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-bold text-lg"
                    />
                    <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                      Segunda parte do texto do logo
                    </p>
                  </div>
                </div>

                <div>
                  <ColorPropertyInput
                    label="Cor de Destaque"
                    value={pageData.logo.accentColor}
                    onChange={(color) => updateNested('logo.accentColor', color)}
                    description="Cor que destaca o segundo texto do logo"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Navegação */}
        <div className="space-y-4">
          <SectionHeader
            title="Menu de Navegação"
            section="navigation"
            icon={Globe}
            isExpanded={expandedSections.navigation}
            onToggle={() => toggleSection("navigation")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.navigation ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <Menu className="w-5 h-5" />
                      Itens do Menu
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-[var(--color-secondary)]/70">
                          {navigationCompleteCount} de {navigationTotalCount} completos
                        </span>
                      </div>
                      <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                      <span className="text-sm text-[var(--color-secondary)]/70">
                        Limite: {currentPlanType === 'pro' ? '10' : '6'} itens
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="button"
                      onClick={handleAddNavigation}
                      variant="primary"
                      className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                      disabled={!canAddNewNavigation}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Item
                    </Button>
                    {isNavigationLimitReached && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Limite do plano atingido
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-secondary)]/70">
                  Configure os links de navegação do cabeçalho.
                </p>
              </div>

              {/* Mensagem de erro */}
              {navigationValidationError && (
                <div className={`p-3 rounded-lg ${isNavigationLimitReached ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'} mb-4`}>
                  <div className="flex items-start gap-2">
                    {isNavigationLimitReached ? (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${isNavigationLimitReached ? 'text-red-400' : 'text-yellow-400'}`}>
                      {navigationValidationError}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {pageData.navigation.map((navItem, index) => (
                  <div 
                    key={index}
                    ref={index === pageData.navigation.length - 1 ? newNavigationRef : undefined}
                    draggable
                    onDragStart={(e) => handleNavigationDragStart(e, index)}
                    onDragOver={(e) => handleNavigationDragOver(e, index)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleNavigationDragEnd}
                    onDrop={handleDrop}
                    className={`p-6 border border-[var(--color-border)] rounded-lg space-y-6 transition-all duration-200 ${
                      draggingNavigation === index 
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
                          onDragStart={(e) => handleNavigationDragStart(e, index)}
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
                              {navItem.label || "Item sem nome"}
                            </h4>
                            <div className="flex items-center gap-2">
                              {navItem.isExternal ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500">
                                  EXTERNO
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500">
                                  INTERNO
                                </span>
                              )}
                              {isNavigationValid(navItem) ? (
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
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                  Texto do Menu
                                </label>
                                <Input
                                  value={navItem.label}
                                  onChange={(e) => handleUpdateNavigation(index, { label: e.target.value })}
                                  placeholder="Ex: Home, Soluções, Contato"
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                                  <Hash className="w-4 h-4" />
                                  ID da Seção
                                </label>
                                <Input
                                  value={navItem.sectionId}
                                  onChange={(e) => handleUpdateNavigation(index, { sectionId: e.target.value })}
                                  placeholder="Ex: home, solucoes, contato"
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                                />
                                <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                                  Para links internos: ID da seção na página<br />
                                  Para links externos: URL completa (https://...)
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-background-body)]">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    {navItem.isExternal ? (
                                      <ExternalLink className="w-4 h-4 text-blue-500" />
                                    ) : (
                                      <Home className="w-4 h-4 text-green-500" />
                                    )}
                                    <h4 className="font-medium text-[var(--color-secondary)]">
                                      Tipo de Link
                                    </h4>
                                  </div>
                                  <p className="text-sm text-[var(--color-secondary)]/70">
                                    {navItem.isExternal 
                                      ? "Link para página externa" 
                                      : "Link para seção interna"}
                                  </p>
                                </div>
                                <Switch
                                  checked={navItem.isExternal}
                                  onCheckedChange={(checked) => handleUpdateNavigation(index, { isExternal: checked })}
                                />
                              </div>
                              
                              <div className="text-xs text-[var(--color-secondary)]/50 space-y-1">
                                <p className="flex items-center gap-1">
                                  <Home className="w-3 h-3" />
                                  <strong>Interno:</strong> Rola para a seção na mesma página
                                </p>
                                <p className="flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  <strong>Externo:</strong> Abre uma nova página/aba
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={() => handleRemoveNavigation(index)}
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

        {/* Seção Contato */}
        <div className="space-y-4">
          <SectionHeader
            title="Contato & WhatsApp"
            section="contact"
            icon={Phone}
            isExpanded={expandedSections.contact}
            onToggle={() => toggleSection("contact")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.contact ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Texto do Botão
                  </label>
                  <Input
                    value={pageData.contact.buttonText}
                    onChange={(e) => updateNested('contact.buttonText', e.target.value)}
                    placeholder="FALE CONOSCO"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-semibold"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Texto que aparece no botão de contato/WhatsApp
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Número do WhatsApp
                  </label>
                  <Input
                    value={pageData.contact.whatsappNumber}
                    onChange={(e) => updateNested('contact.whatsappNumber', e.target.value)}
                    placeholder="5514991779502"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                  />
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
          itemName="Cabeçalho"
          icon={Menu}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={pageData.navigation.length}
        itemName="Item de Navegação"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}