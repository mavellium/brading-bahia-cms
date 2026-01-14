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
  HelpCircle,
  MessageSquare,
  Type,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Hash,
  Sparkles,
  Link,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  List,
  Zap,
  Clock,
  Users,
  Search,
  Target
} from "lucide-react";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { SectionHeader } from "@/components/SectionHeader";
import Loading from "@/components/Loading";
import { useJsonManagement } from "@/hooks/useJsonManagement";
import { Button } from "@/components/Button";
import { useSite } from "@/context/site-context";

interface FAQItem {
  question: string;
  answer: string;
}

interface CTA {
  text: string;
  link: string;
}

interface FAQsData {
  faqs: {
    title: string;
    subtitle: string;
    questions: FAQItem[];
    cta: CTA;
  };
}

const defaultFAQsData: FAQsData = {
  faqs: {
    title: "",
    subtitle: "",
    questions: [
      {
        question: "",
        answer: ""
      }
    ],
    cta: {
      text: "",
      link: ""
    }
  }
};

const mergeWithDefaults = (apiData: any, defaultData: FAQsData): FAQsData => {
  if (!apiData) return defaultData;
  
  return {
    faqs: {
      title: apiData.faqs?.title || defaultData.faqs.title,
      subtitle: apiData.faqs?.subtitle || defaultData.faqs.subtitle,
      questions: apiData.faqs?.questions || defaultData.faqs.questions,
      cta: {
        text: apiData.faqs?.cta?.text || defaultData.faqs.cta.text,
        link: apiData.faqs?.cta?.link || defaultData.faqs.cta.link,
      }
    }
  };
};

export default function FAQsPage() {
  const { currentSite } = useSite();
  const currentPlanType = currentSite.planType;
  const currentFAQsLimit = currentPlanType === 'pro' ? 12 : 8;

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
  } = useJsonManagement<FAQsData>({
    apiPath: "/api/tegbe-institucional/json/faqs",
    defaultData: defaultFAQsData,
    mergeFunction: mergeWithDefaults,
  });

  // Estados para drag & drop
  const [draggingFAQ, setDraggingFAQ] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    header: true,
    questions: false,
    cta: false,
  });

  // Estados para perguntas expandidas individualmente
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Referência para novo item
  const newFAQRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Funções para manipular a lista de FAQs
  const handleAddFAQ = () => {
    const questions = pageData.faqs.questions;
    if (questions.length >= currentFAQsLimit) {
      return false;
    }
    
    const newFAQ: FAQItem = {
      question: "",
      answer: ""
    };
    
    const updated = [...questions, newFAQ];
    updateNested('faqs.questions', updated);
    
    // Expande automaticamente a nova pergunta
    setExpandedQuestions(prev => [...prev, questions.length]);
    
    setTimeout(() => {
      newFAQRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const handleUpdateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    const questions = pageData.faqs.questions;
    const updated = [...questions];
    
    if (index >= 0 && index < updated.length) {
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      updateNested('faqs.questions', updated);
    }
  };

  const handleRemoveFAQ = (index: number) => {
    const questions = pageData.faqs.questions;
    
    if (questions.length <= 1) {
      // Mantém pelo menos uma pergunta vazia
      updateNested('faqs.questions', [{ question: "", answer: "" }]);
      setExpandedQuestions([]);
    } else {
      const updated = questions.filter((_, i) => i !== index);
      updateNested('faqs.questions', updated);
      
      // Remove o índice das perguntas expandidas
      setExpandedQuestions(prev => 
        prev.filter(i => i !== index).map(i => i > index ? i - 1 : i)
      );
    }
  };

  // Funções de drag & drop para FAQs
  const handleFAQDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingFAQ(index);
  };

  const handleFAQDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingFAQ === null || draggingFAQ === index) return;
    
    const questions = pageData.faqs.questions;
    const updated = [...questions];
    const draggedFAQ = updated[draggingFAQ];
    
    // Remove o item arrastado
    updated.splice(draggingFAQ, 1);
    
    // Insere na nova posição
    const newIndex = index > draggingFAQ ? index : index;
    updated.splice(newIndex, 0, draggedFAQ);
    
    updateNested('faqs.questions', updated);
    
    // Ajusta os índices das perguntas expandidas
    setExpandedQuestions(prev => {
      const newExpanded = [...prev];
      const draggedExpandedIndex = newExpanded.indexOf(draggingFAQ);
      
      if (draggedExpandedIndex !== -1) {
        newExpanded[draggedExpandedIndex] = newIndex;
      }
      
      return newExpanded.map(i => {
        if (i === draggingFAQ) return newIndex;
        if (i > draggingFAQ && i <= newIndex) return i - 1;
        if (i < draggingFAQ && i >= newIndex) return i + 1;
        return i;
      }).sort((a, b) => a - b);
    });
    
    setDraggingFAQ(newIndex);
  };

  const handleFAQDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingFAQ(null);
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
  const isFAQValid = (faq: FAQItem): boolean => {
    return faq.question.trim() !== '' && faq.answer.trim() !== '';
  };

  const isFAQsLimitReached = pageData.faqs.questions.length >= currentFAQsLimit;
  const canAddNewFAQ = !isFAQsLimitReached;
  const faqsCompleteCount = pageData.faqs.questions.filter(isFAQValid).length;
  const faqsTotalCount = pageData.faqs.questions.length;

  const faqsValidationError = isFAQsLimitReached 
    ? `Você chegou ao limite do plano ${currentPlanType} (${currentFAQsLimit} perguntas).`
    : null;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Title (2 campos)
    total += 2;
    if (pageData.faqs.title.trim()) completed++;
    if (pageData.faqs.subtitle.trim()) completed++;

    // Questions (2 campos por pergunta)
    total += pageData.faqs.questions.length * 2;
    pageData.faqs.questions.forEach(faq => {
      if (faq.question.trim()) completed++;
      if (faq.answer.trim()) completed++;
    });

    // CTA (2 campos)
    total += 2;
    if (pageData.faqs.cta.text.trim()) completed++;
    if (pageData.faqs.cta.link.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={HelpCircle}
      title="Seção FAQ (Perguntas Frequentes)"
      description="Gerencie as perguntas frequentes e respostas da sua empresa"
      exists={!!exists}
      itemName="FAQs"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Seção Cabeçalho */}
        <div className="space-y-4">
          <SectionHeader
            title="Cabeçalho da Seção"
            section="header"
            icon={Type}
            isExpanded={expandedSections.header}
            onToggle={() => toggleSection("header")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.header ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                      Título Principal
                    </label>
                    <Input
                      value={pageData.faqs.title}
                      onChange={(e) => updateNested('faqs.title', e.target.value)}
                      placeholder="Dúvidas."
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-2xl font-bold"
                    />
                    <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                      Primeira parte do título (geralmente curto e direto)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                      Subtítulo
                    </label>
                    <Input
                      value={pageData.faqs.subtitle}
                      onChange={(e) => updateNested('faqs.subtitle', e.target.value)}
                      placeholder="E respostas."
                      className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-2xl font-bold italic"
                    />
                    <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                      Segunda parte do título (complemento, geralmente em itálico)
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Perguntas */}
        <div className="space-y-4">
          <SectionHeader
            title="Perguntas Frequentes"
            section="questions"
            icon={List}
            isExpanded={expandedSections.questions}
            onToggle={() => toggleSection("questions")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.questions ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      Perguntas & Respostas
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-[var(--color-secondary)]/70">
                          {faqsCompleteCount} de {faqsTotalCount} completas
                        </span>
                      </div>
                      <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                      <span className="text-sm text-[var(--color-secondary)]/70">
                        Limite: {currentPlanType === 'pro' ? '12' : '8'} perguntas
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="button"
                      onClick={handleAddFAQ}
                      variant="primary"
                      className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                      disabled={!canAddNewFAQ}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Pergunta
                    </Button>
                    {isFAQsLimitReached && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Limite do plano atingido
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-secondary)]/70">
                  Liste as perguntas mais comuns dos seus clientes e forneça respostas claras e úteis.
                </p>
              </div>

              {/* Mensagem de erro */}
              {faqsValidationError && (
                <div className={`p-3 rounded-lg ${isFAQsLimitReached ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'} mb-4`}>
                  <div className="flex items-start gap-2">
                    {isFAQsLimitReached ? (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${isFAQsLimitReached ? 'text-red-400' : 'text-yellow-400'}`}>
                      {faqsValidationError}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {pageData.faqs.questions.map((faq, index) => (
                  <div 
                    key={index}
                    ref={index === pageData.faqs.questions.length - 1 ? newFAQRef : undefined}
                    draggable
                    onDragStart={(e) => handleFAQDragStart(e, index)}
                    onDragOver={(e) => handleFAQDragOver(e, index)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleFAQDragEnd}
                    onDrop={handleDrop}
                    className={`p-6 border border-[var(--color-border)] rounded-lg transition-all duration-200 ${
                      draggingFAQ === index 
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
                          onDragStart={(e) => handleFAQDragStart(e, index)}
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
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-[var(--color-secondary)]">
                                {faq.question || "Pergunta vazia"}
                              </h4>
                              {isFAQValid(faq) ? (
                                <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded-full">
                                  Completa
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded-full">
                                  Incompleta
                                </span>
                              )}
                            </div>
                            
                            <Button
                              type="button"
                              onClick={() => toggleQuestion(index)}
                              variant="primary"
                            >
                              {expandedQuestions.includes(index) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          
                          <motion.div
                            initial={false}
                            animate={{ height: expandedQuestions.includes(index) ? "auto" : 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-6 pt-4 border-t border-[var(--color-border)] px-2">
                              <div>
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                  Pergunta
                                </label>
                                <Input
                                  value={faq.question}
                                  onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                                  placeholder="Ex: Como a IA ajuda no meu atendimento pelo WhatsApp?"
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg font-semibold"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                                  Resposta
                                </label>
                                <TextArea
                                  value={faq.answer}
                                  onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                                  placeholder="Ex: Implementamos chatbots inteligentes que qualificam leads e respondem dúvidas comuns 24h por dia. Isso garante que você só gaste tempo com clientes prontos para fechar negócio."
                                  rows={4}
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                                />
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={() => handleRemoveFAQ(index)}
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
            title="Call to Action Final"
            section="cta"
            icon={MessageCircle}
            isExpanded={expandedSections.cta}
            onToggle={() => toggleSection("cta")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.cta ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Chamada para Ação
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto do CTA
                      </label>
                      <TextArea
                        value={pageData.faqs.cta.text}
                        onChange={(e) => updateNested('faqs.cta.text', e.target.value)}
                        placeholder="Pronto para escalar? Fale com Marcos Ramos agora"
                        rows={2}
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg font-semibold"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Texto persuasivo que incentiva o contato após ler as FAQs
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Link do Botão
                      </label>
                      <Input
                        value={pageData.faqs.cta.link}
                        onChange={(e) => updateNested('faqs.cta.link', e.target.value)}
                        placeholder="https://wa.me/5514991779502"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                      />
                      <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                        <p><strong>WhatsApp:</strong> https://wa.me/5514991779502</p>
                        <p><strong>Link Interno:</strong> #solucoes, #contato</p>
                        <p><strong>URL Externa:</strong> https://seusite.com.br/contato</p>
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
          completeCount={completion.completed}
          totalCount={completion.total}
          itemName="FAQs"
          icon={HelpCircle}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={pageData.faqs.questions.length}
        itemName="Pergunta"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}