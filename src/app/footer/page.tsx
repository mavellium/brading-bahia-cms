/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { 
  Layout,
  Navigation,
  MapPin,
  Copyright,
  Type,
  Italic,
  MessageCircle,
  Link,
  Home,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Globe,
  Calendar,
  Building,
  Zap,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { SectionHeader } from "@/components/SectionHeader";
import Loading from "@/components/Loading";
import { useJsonManagement } from "@/hooks/useJsonManagement";
import { Button } from "@/components/Button";
import { useSite } from "@/context/site-context";

interface FooterLink {
  label: string;
  href: string;
}

interface CTA {
  badge: string;
  headlineMain: string;
  headlineItalic: string;
  headlineEnd: string;
  buttonText: string;
  whatsappLink: string;
}

interface Navigation {
  title: string;
  links: FooterLink[];
}

interface Info {
  title: string;
  address: string;
  serviceArea: string;
  foundedText: string;
  copyright: string;
}

interface FooterData {
  footer: {
    cta: CTA;
    navigation: Navigation;
    info: Info;
  };
}

const defaultFooterData: FooterData = {
  footer: {
    cta: {
      badge: "",
      headlineMain: "",
      headlineItalic: "",
      headlineEnd: "",
      buttonText: "",
      whatsappLink: ""
    },
    navigation: {
      title: "",
      links: [
        { label: "", href: "" }
      ]
    },
    info: {
      title: "",
      address: "",
      serviceArea: "",
      foundedText: "",
      copyright: ""
    }
  }
};

const mergeWithDefaults = (apiData: any, defaultData: FooterData): FooterData => {
  if (!apiData) return defaultData;
  
  return {
    footer: {
      cta: {
        badge: apiData.footer?.cta?.badge || defaultData.footer.cta.badge,
        headlineMain: apiData.footer?.cta?.headlineMain || defaultData.footer.cta.headlineMain,
        headlineItalic: apiData.footer?.cta?.headlineItalic || defaultData.footer.cta.headlineItalic,
        headlineEnd: apiData.footer?.cta?.headlineEnd || defaultData.footer.cta.headlineEnd,
        buttonText: apiData.footer?.cta?.buttonText || defaultData.footer.cta.buttonText,
        whatsappLink: apiData.footer?.cta?.whatsappLink || defaultData.footer.cta.whatsappLink,
      },
      navigation: {
        title: apiData.footer?.navigation?.title || defaultData.footer.navigation.title,
        links: apiData.footer?.navigation?.links || defaultData.footer.navigation.links,
      },
      info: {
        title: apiData.footer?.info?.title || defaultData.footer.info.title,
        address: apiData.footer?.info?.address || defaultData.footer.info.address,
        serviceArea: apiData.footer?.info?.serviceArea || defaultData.footer.info.serviceArea,
        foundedText: apiData.footer?.info?.foundedText || defaultData.footer.info.foundedText,
        copyright: apiData.footer?.info?.copyright || defaultData.footer.info.copyright,
      }
    }
  };
};

export default function FooterPage() {
  const { currentSite } = useSite();
  const currentPlanType = currentSite.planType;
  const currentLinksLimit = currentPlanType === 'pro' ? 6 : 4;

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
  } = useJsonManagement<FooterData>({
    apiPath: "/api/tegbe-institucional/json/footer",
    defaultData: defaultFooterData,
    mergeFunction: mergeWithDefaults,
  });

  // Estados para drag & drop
  const [draggingLink, setDraggingLink] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    cta: true,
    navigation: false,
    info: false,
  });

  // Referência para novo item
  const newLinkRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Funções para manipular a lista de links
  const handleAddLink = () => {
    const links = pageData.footer.navigation.links;
    if (links.length >= currentLinksLimit) {
      return false;
    }
    
    const newLink: FooterLink = {
      label: "",
      href: ""
    };
    
    const updated = [...links, newLink];
    updateNested('footer.navigation.links', updated);
    
    setTimeout(() => {
      newLinkRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const handleUpdateLink = (index: number, field: keyof FooterLink, value: string) => {
    const links = pageData.footer.navigation.links;
    const updated = [...links];
    
    if (index >= 0 && index < updated.length) {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      updateNested('footer.navigation.links', updated);
    }
  };

  const handleRemoveLink = (index: number) => {
    const links = pageData.footer.navigation.links;
    
    if (links.length <= 1) {
      // Mantém pelo menos um link
      updateNested('footer.navigation.links', [{ label: "", href: "" }]);
    } else {
      const updated = links.filter((_, i) => i !== index);
      updateNested('footer.navigation.links', updated);
    }
  };

  // Funções de drag & drop para links
  const handleLinkDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingLink(index);
  };

  const handleLinkDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingLink === null || draggingLink === index) return;
    
    const links = pageData.footer.navigation.links;
    const updated = [...links];
    const draggedLink = updated[draggingLink];
    
    // Remove o item arrastado
    updated.splice(draggingLink, 1);
    
    // Insere na nova posição
    const newIndex = index > draggingLink ? index : index;
    updated.splice(newIndex, 0, draggedLink);
    
    updateNested('footer.navigation.links', updated);
    setDraggingLink(newIndex);
  };

  const handleLinkDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingLink(null);
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
  const isLinkValid = (link: FooterLink): boolean => {
    return link.label.trim() !== '' && link.href.trim() !== '';
  };

  const isLinksLimitReached = pageData.footer.navigation.links.length >= currentLinksLimit;
  const canAddNewLink = !isLinksLimitReached;
  const linksCompleteCount = pageData.footer.navigation.links.filter(isLinkValid).length;
  const linksTotalCount = pageData.footer.navigation.links.length;

  const linksValidationError = isLinksLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentLinksLimit} links).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // CTA (6 campos)
    total += 6;
    if (pageData.footer.cta.badge.trim()) completed++;
    if (pageData.footer.cta.headlineMain.trim()) completed++;
    if (pageData.footer.cta.headlineItalic.trim()) completed++;
    if (pageData.footer.cta.headlineEnd.trim()) completed++;
    if (pageData.footer.cta.buttonText.trim()) completed++;
    if (pageData.footer.cta.whatsappLink.trim()) completed++;

    // Navigation (título + 2 campos por link)
    total += 1;
    if (pageData.footer.navigation.title.trim()) completed++;
    
    total += pageData.footer.navigation.links.length * 2;
    pageData.footer.navigation.links.forEach(link => {
      if (link.label.trim()) completed++;
      if (link.href.trim()) completed++;
    });

    // Info (5 campos)
    total += 5;
    if (pageData.footer.info.title.trim()) completed++;
    if (pageData.footer.info.address.trim()) completed++;
    if (pageData.footer.info.serviceArea.trim()) completed++;
    if (pageData.footer.info.foundedText.trim()) completed++;
    if (pageData.footer.info.copyright.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={Navigation}
      title="Seção Rodapé"
      description="Gerencie o rodapé do site com CTA, navegação e informações de contato"
      exists={!!exists}
      itemName="Rodapé"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Seção CTA */}
        <div className="space-y-4">
          <SectionHeader
            title="Call to Action Final"
            section="cta"
            icon={Zap}
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
                    Badge do CTA
                  </label>
                  <Input
                    value={pageData.footer.cta.badge}
                    onChange={(e) => updateNested('footer.cta.badge', e.target.value)}
                    placeholder="Próximo Passo"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Texto curto que introduz o call to action final
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Headline do CTA
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Primeira Parte
                      </label>
                      <Input
                        value={pageData.footer.cta.headlineMain}
                        onChange={(e) => updateNested('footer.cta.headlineMain', e.target.value)}
                        placeholder="Pronto para"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Primeira parte da frase (normal)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <Italic className="w-4 h-4" />
                        Parte Central (Itálico)
                      </label>
                      <Input
                        value={pageData.footer.cta.headlineItalic}
                        onChange={(e) => updateNested('footer.cta.headlineItalic', e.target.value)}
                        placeholder="iluminar"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg italic"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Parte central da frase (em itálico para destaque)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Final da Frase
                      </label>
                      <Input
                        value={pageData.footer.cta.headlineEnd}
                        onChange={(e) => updateNested('footer.cta.headlineEnd', e.target.value)}
                        placeholder="seu lucro?"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Conclusão da frase (com ponto de interrogação se necessário)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Botão de Ação
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto do Botão
                      </label>
                      <Input
                        value={pageData.footer.cta.buttonText}
                        onChange={(e) => updateNested('footer.cta.buttonText', e.target.value)}
                        placeholder="Falar com o Especialista"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg font-semibold"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Texto que aparece no botão de ação
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Link do WhatsApp
                      </label>
                      <Input
                        value={pageData.footer.cta.whatsappLink}
                        onChange={(e) => updateNested('footer.cta.whatsappLink', e.target.value)}
                        placeholder="https://wa.me/5514991779502"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                      />
                      <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                        <p><strong>WhatsApp:</strong> https://wa.me/5514991779502</p>
                        <p><strong>Formato:</strong> https://wa.me/5514991779502?text=Olá...</p>
                        <p className="text-yellow-400">
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          Certifique-se de incluir o código do país (55 para Brasil)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Navegação */}
        <div className="space-y-4">
          <SectionHeader
            title="Navegação do Rodapé"
            section="navigation"
            icon={Navigation}
            isExpanded={expandedSections.navigation}
            onToggle={() => toggleSection("navigation")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.navigation ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Título da Navegação
                  </label>
                  <Input
                    value={pageData.footer.navigation.title}
                    onChange={(e) => updateNested('footer.navigation.title', e.target.value)}
                    placeholder="Navegação"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Título da seção de navegação no rodapé
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <ChevronRight className="w-5 h-5" />
                        Links de Navegação
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-[var(--color-secondary)]/70">
                            {linksCompleteCount} de {linksTotalCount} completos
                          </span>
                        </div>
                        <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                        <span className="text-sm text-[var(--color-secondary)]/70">
                          Limite: {currentPlanType === 'pro' ? '6' : '4'} links
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        type="button"
                        onClick={handleAddLink}
                        variant="primary"
                        className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                        disabled={!canAddNewLink}
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar Link
                      </Button>
                      {isLinksLimitReached && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Limite do plano atingido
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mensagem de erro */}
                  {linksValidationError && (
                    <div className={`p-3 rounded-lg ${isLinksLimitReached ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'} mb-4`}>
                      <div className="flex items-start gap-2">
                        {isLinksLimitReached ? (
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        )}
                        <p className={`text-sm ${isLinksLimitReached ? 'text-red-400' : 'text-yellow-400'}`}>
                          {linksValidationError}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {pageData.footer.navigation.links.map((link, index) => (
                      <div 
                        key={index}
                        ref={index === pageData.footer.navigation.links.length - 1 ? newLinkRef : undefined}
                        draggable
                        onDragStart={(e) => handleLinkDragStart(e, index)}
                        onDragOver={(e) => handleLinkDragOver(e, index)}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragEnd={handleLinkDragEnd}
                        onDrop={handleDrop}
                        className={`p-4 border border-[var(--color-border)] rounded-lg transition-all duration-200 ${
                          draggingLink === index 
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
                              onDragStart={(e) => handleLinkDragStart(e, index)}
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
                              <div className="flex items-center gap-3 mb-4">
                                <h4 className="font-medium text-[var(--color-secondary)]">
                                  {link.label || "Link sem nome"}
                                </h4>
                                {isLinkValid(link) ? (
                                  <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded-full">
                                    Completo
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded-full">
                                    Incompleto
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                    Rótulo do Link
                                  </label>
                                  <Input
                                    value={link.label}
                                    onChange={(e) => handleUpdateLink(index, 'label', e.target.value)}
                                    placeholder="Ex: Início, Arsenal, O Especialista"
                                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                                  />
                                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                                    Texto que será exibido para o link
                                  </p>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                    Link (URL ou Hash)
                                  </label>
                                  <Input
                                    value={link.href}
                                    onChange={(e) => handleUpdateLink(index, 'href', e.target.value)}
                                    placeholder="Ex: #headline-section, #services, #marcos"
                                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                                  />
                                  <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                                    <p><strong>Hash interno:</strong> #nome-da-secao</p>
                                    <p><strong>URL externa:</strong> https://exemplo.com</p>
                                    <p className="text-yellow-400">
                                      <AlertCircle className="w-3 h-3 inline mr-1" />
                                      Para navegação interna, use o padrão #nome-da-secao
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              onClick={() => handleRemoveLink(index)}
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
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Informações */}
        <div className="space-y-4">
          <SectionHeader
            title="Informações da Empresa"
            section="info"
            icon={Building}
            isExpanded={expandedSections.info}
            onToggle={() => toggleSection("info")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.info ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Localização e Área de Atendimento
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Título da Localização
                      </label>
                      <Input
                        value={pageData.footer.info.title}
                        onChange={(e) => updateNested('footer.info.title', e.target.value)}
                        placeholder="Localização"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Título da seção de localização
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Área de Atendimento
                      </label>
                      <Input
                        value={pageData.footer.info.serviceArea}
                        onChange={(e) => updateNested('footer.info.serviceArea', e.target.value)}
                        placeholder="Atendimento Nacional"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Descrição da área geográfica atendida
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                      Endereço
                    </label>
                    <Input
                      value={pageData.footer.info.address}
                      onChange={(e) => updateNested('footer.info.address', e.target.value)}
                      placeholder="Salvador — Bahia"
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                    />
                    <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                      Cidade e estado ou endereço completo
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Fundação e Copyright
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto de Fundação
                      </label>
                      <Input
                        value={pageData.footer.info.foundedText}
                        onChange={(e) => updateNested('footer.info.foundedText', e.target.value)}
                        placeholder="Since 2026"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Texto que indica o ano de fundação ou início das atividades
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <Copyright className="w-4 h-4" />
                        Texto de Copyright
                      </label>
                      <Input
                        value={pageData.footer.info.copyright}
                        onChange={(e) => updateNested('footer.info.copyright', e.target.value)}
                        placeholder="© 2026 Branding Bahia. Todos os direitos reservados."
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Texto completo de direitos autorais
                      </p>
                    </div>
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
          itemName="Rodapé"
          icon={Navigation}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={pageData.footer.navigation.links.length}
        itemName="Link de Navegação"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}