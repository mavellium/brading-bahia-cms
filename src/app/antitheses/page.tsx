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
  AlertTriangle,
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
  MessageCircle,
  Target,
  Award,
  Zap,
  Link,
  Quote,
  Sparkles,
  Italic,
  ListChecks
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
  light: string;
  italic: string;
}

interface FooterCTA {
  text: string;
  link: string;
}

interface Footer {
  headline: string;
  accent: string;
  subtext: string;
  cta: FooterCTA;
}

interface AntithesisData {
  antithesis: {
    badge: string;
    mainTitle: MainTitle;
    phrases: string[];
    footer: Footer;
  };
}

const defaultAntithesisData: AntithesisData = {
  antithesis: {
    badge: "",
    mainTitle: {
      light: "",
      italic: ""
    },
    phrases: [
      "",
    ],
    footer: {
      headline: "",
      accent: "",
      subtext: "",
      cta: {
        text: "",
        link: ""
      }
    }
  }
};

const mergeWithDefaults = (apiData: any, defaultData: AntithesisData): AntithesisData => {
  if (!apiData) return defaultData;
  
  return {
    antithesis: {
      badge: apiData.antithesis?.badge || defaultData.antithesis.badge,
      mainTitle: {
        light: apiData.antithesis?.mainTitle?.light || defaultData.antithesis.mainTitle.light,
        italic: apiData.antithesis?.mainTitle?.italic || defaultData.antithesis.mainTitle.italic,
      },
      phrases: apiData.antithesis?.phrases || defaultData.antithesis.phrases,
      footer: {
        headline: apiData.antithesis?.footer?.headline || defaultData.antithesis.footer.headline,
        accent: apiData.antithesis?.footer?.accent || defaultData.antithesis.footer.accent,
        subtext: apiData.antithesis?.footer?.subtext || defaultData.antithesis.footer.subtext,
        cta: {
          text: apiData.antithesis?.footer?.cta?.text || defaultData.antithesis.footer.cta.text,
          link: apiData.antithesis?.footer?.cta?.link || defaultData.antithesis.footer.cta.link,
        }
      }
    }
  };
};

export default function AntithesisPage() {
  const { currentSite } = useSite();
  const currentPlanType = currentSite.planType;
  const currentPhrasesLimit = currentPlanType === 'pro' ? 10 : 6;

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
  } = useJsonManagement<AntithesisData>({
    apiPath: "/api/tegbe-institucional/json/antithesis",
    defaultData: defaultAntithesisData,
    mergeFunction: mergeWithDefaults,
  });

  // Estados para drag & drop
  const [draggingPhrase, setDraggingPhrase] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    badge: true,
    mainTitle: false,
    phrases: false,
    footer: false,
  });

  // Referência para novo item
  const newPhraseRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Funções para manipular a lista de frases
  const handleAddPhrase = () => {
    const phrases = pageData.antithesis.phrases;
    if (phrases.length >= currentPhrasesLimit) {
      return false;
    }
    
    const newPhrase = "";
    const updated = [...phrases, newPhrase];
    updateNested('antithesis.phrases', updated);
    
    setTimeout(() => {
      newPhraseRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const handleUpdatePhrase = (index: number, value: string) => {
    const phrases = pageData.antithesis.phrases;
    const updated = [...phrases];
    if (index >= 0 && index < updated.length) {
      updated[index] = value;
      updateNested('antithesis.phrases', updated);
    }
  };

  const handleRemovePhrase = (index: number) => {
    const phrases = pageData.antithesis.phrases;
    
    if (phrases.length <= 1) {
      // Mantém pelo menos uma frase vazia
      updateNested('antithesis.phrases', [""]);
    } else {
      const updated = phrases.filter((_, i) => i !== index);
      updateNested('antithesis.phrases', updated);
    }
  };

  // Funções de drag & drop para frases
  const handlePhraseDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingPhrase(index);
  };

  const handlePhraseDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingPhrase === null || draggingPhrase === index) return;
    
    const phrases = pageData.antithesis.phrases;
    const updated = [...phrases];
    const draggedPhrase = updated[draggingPhrase];
    
    // Remove o item arrastado
    updated.splice(draggingPhrase, 1);
    
    // Insere na nova posição
    const newIndex = index > draggingPhrase ? index : index;
    updated.splice(newIndex, 0, draggedPhrase);
    
    updateNested('antithesis.phrases', updated);
    setDraggingPhrase(index);
  };

  const handlePhraseDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingPhrase(null);
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
  const isPhraseValid = (phrase: string): boolean => {
    return phrase.trim() !== '';
  };

  const isPhraseLimitReached = pageData.antithesis.phrases.length >= currentPhrasesLimit;
  const canAddNewPhrase = !isPhraseLimitReached;
  const phrasesCompleteCount = pageData.antithesis.phrases.filter(isPhraseValid).length;
  const phrasesTotalCount = pageData.antithesis.phrases.length;

  const phrasesValidationError = isPhraseLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentPhrasesLimit} frases).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Badge (1 campo)
    total += 1;
    if (pageData.antithesis.badge.trim()) completed++;

    // MainTitle (2 campos)
    total += 2;
    if (pageData.antithesis.mainTitle.light.trim()) completed++;
    if (pageData.antithesis.mainTitle.italic.trim()) completed++;

    // Phrases (1 campo por frase)
    total += pageData.antithesis.phrases.length;
    pageData.antithesis.phrases.forEach(phrase => {
      if (phrase.trim()) completed++;
    });

    // Footer (4 campos)
    total += 4;
    if (pageData.antithesis.footer.headline.trim()) completed++;
    if (pageData.antithesis.footer.accent.trim()) completed++;
    if (pageData.antithesis.footer.subtext.trim()) completed++;
    
    // CTA (2 campos)
    total += 2;
    if (pageData.antithesis.footer.cta.text.trim()) completed++;
    if (pageData.antithesis.footer.cta.link.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={AlertTriangle}
      title="Seção Antítese (Problemas & Soluções)"
      description="Gerencie a seção que contrasta problemas comuns com sua solução"
      exists={!!exists}
      itemName="Antítese"
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
                    Badge da Seção
                  </label>
                  <Input
                    value={pageData.antithesis.badge}
                    onChange={(e) => updateNested('antithesis.badge', e.target.value)}
                    placeholder="Diagnóstico de Eficiência"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Texto curto que identifica a seção, geralmente focado no diagnóstico ou problema
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
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto Normal
                  </label>
                  <Input
                    value={pageData.antithesis.mainTitle.light}
                    onChange={(e) => updateNested('antithesis.mainTitle.light', e.target.value)}
                    placeholder="Onde o seu lucro"
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
                    value={pageData.antithesis.mainTitle.italic}
                    onChange={(e) => updateNested('antithesis.mainTitle.italic', e.target.value)}
                    placeholder="se esconde."
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

        {/* Seção Frases */}
        <div className="space-y-4">
          <SectionHeader
            title="Frases de Problemas"
            section="phrases"
            icon={AlertTriangle}
            isExpanded={expandedSections.phrases}
            onToggle={() => toggleSection("phrases")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.phrases ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <ListChecks className="w-5 h-5" />
                      Frases de Problemas Comuns
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-[var(--color-secondary)]/70">
                          {phrasesCompleteCount} de {phrasesTotalCount} completos
                        </span>
                      </div>
                      <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                      <span className="text-sm text-[var(--color-secondary)]/70">
                        Limite: {currentPlanType === 'pro' ? '10' : '6'} frases
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="button"
                      onClick={handleAddPhrase}
                      variant="primary"
                      className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                      disabled={!canAddNewPhrase}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Frase
                    </Button>
                    {isPhraseLimitReached && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Limite do plano atingido
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-secondary)]/70">
                  Liste os problemas ou dores que seus clientes enfrentam.
                </p>
              </div>

              {/* Mensagem de erro */}
              {phrasesValidationError && (
                <div className={`p-3 rounded-lg ${isPhraseLimitReached ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'} mb-4`}>
                  <div className="flex items-start gap-2">
                    {isPhraseLimitReached ? (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${isPhraseLimitReached ? 'text-red-400' : 'text-yellow-400'}`}>
                      {phrasesValidationError}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {pageData.antithesis.phrases.map((phrase, index) => (
                  <div 
                    key={index}
                    ref={index === pageData.antithesis.phrases.length - 1 ? newPhraseRef : undefined}
                    draggable
                    onDragStart={(e) => handlePhraseDragStart(e, index)}
                    onDragOver={(e) => handlePhraseDragOver(e, index)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handlePhraseDragEnd}
                    onDrop={handleDrop}
                    className={`p-6 border border-[var(--color-border)] rounded-lg space-y-6 transition-all duration-200 ${
                      draggingPhrase === index 
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
                          onDragStart={(e) => handlePhraseDragStart(e, index)}
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
                              {phrase || "Frase vazia"}
                            </h4>
                            {isPhraseValid(phrase) ? (
                              <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded-full">
                                Completo
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded-full">
                                Incompleto
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                Texto da Frase
                              </label>
                              <Input
                                value={phrase}
                                onChange={(e) => handleUpdatePhrase(index, e.target.value)}
                                placeholder="Ex: Tráfego pago que apenas queima caixa."
                                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={() => handleRemovePhrase(index)}
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

        {/* Seção Rodapé */}
        <div className="space-y-4">
          <SectionHeader
            title="Rodapé & Solução"
            section="footer"
            icon={Target}
            isExpanded={expandedSections.footer}
            onToggle={() => toggleSection("footer")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.footer ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-8">
                {/* Headline do Footer */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <Quote className="w-5 h-5" />
                    Texto do Rodapé
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Primeira Linha
                      </label>
                      <Input
                        value={pageData.antithesis.footer.headline}
                        onChange={(e) => updateNested('antithesis.footer.headline', e.target.value)}
                        placeholder="Seu negócio não precisa de 'posts',"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Primeira parte do texto do rodapé
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Segunda Linha (Destaque)
                      </label>
                      <Input
                        value={pageData.antithesis.footer.accent}
                        onChange={(e) => updateNested('antithesis.footer.accent', e.target.value)}
                        placeholder="precisa de engenharia de vendas."
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg font-semibold"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Segunda parte do texto (em destaque)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto de Suporte
                      </label>
                      <TextArea
                        value={pageData.antithesis.footer.subtext}
                        onChange={(e) => updateNested('antithesis.footer.subtext', e.target.value)}
                        placeholder="A Branding Bahia elimina o amadorismo e implementa tecnologia de alta performance."
                        rows={3}
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Texto explicativo que apresenta sua solução
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA do Footer */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Call to Action Final
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto do Botão
                      </label>
                      <Input
                        value={pageData.antithesis.footer.cta.text}
                        onChange={(e) => updateNested('antithesis.footer.cta.text', e.target.value)}
                        placeholder="SOLICITAR DIAGNÓSTICO"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-semibold"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Texto do botão de ação final
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Link do Botão
                      </label>
                      <Input
                        value={pageData.antithesis.footer.cta.link}
                        onChange={(e) => updateNested('antithesis.footer.cta.link', e.target.value)}
                        placeholder="https://wa.me/5514991779502"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                      />
                      <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                        <p><strong>WhatsApp:</strong> https://wa.me/5514991779502</p>
                        <p><strong>Link Interno:</strong> #solucoes, #contato</p>
                        <p><strong>URL Externa:</strong> https://seusite.com.br</p>
                      </div>
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
          totalCount={completion.total}
          itemName="Antítese"
          icon={AlertTriangle}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={pageData.antithesis.phrases.length}
        itemName="Frase"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}