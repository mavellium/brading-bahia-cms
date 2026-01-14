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
  Star,
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
  Sparkles
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

interface Headline {
  textNormal: string;
  textAccent: string;
}

interface CTA {
  text: string;
  link: string;
}

interface HeroData {
  hero: {
    badge: string;
    headline: Headline;
    subheadline: string;
    primaryCta: CTA;
    secondaryCta: CTA;
    trustBadge: string;
  };
}

const defaultHeroData: HeroData = {
  hero: {
    badge: "",
    headline: {
      textNormal: "",
      textAccent: ""
    },
    subheadline: "",
    primaryCta: {
      text: "",
      link: ""
    },
    secondaryCta: {
      text: "",
      link: ""
    },
    trustBadge: ""
  }
};

const mergeWithDefaults = (apiData: any, defaultData: HeroData): HeroData => {
  if (!apiData) return defaultData;
  
  return {
    hero: {
      badge: apiData.hero?.badge || defaultData.hero.badge,
      headline: {
        textNormal: apiData.hero?.headline?.textNormal || defaultData.hero.headline.textNormal,
        textAccent: apiData.hero?.headline?.textAccent || defaultData.hero.headline.textAccent,
      },
      subheadline: apiData.hero?.subheadline || defaultData.hero.subheadline,
      primaryCta: {
        text: apiData.hero?.primaryCta?.text || defaultData.hero.primaryCta.text,
        link: apiData.hero?.primaryCta?.link || defaultData.hero.primaryCta.link,
      },
      secondaryCta: {
        text: apiData.hero?.secondaryCta?.text || defaultData.hero.secondaryCta.text,
        link: apiData.hero?.secondaryCta?.link || defaultData.hero.secondaryCta.link,
      },
      trustBadge: apiData.hero?.trustBadge || defaultData.hero.trustBadge,
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

export default function HeroPage() {
  const { currentSite } = useSite();
  const currentPlanType = currentSite.planType;

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
  } = useJsonManagement<HeroData>({
    apiPath: "/api/tegbe-institucional/json/headline",
    defaultData: defaultHeroData,
    mergeFunction: mergeWithDefaults,
  });

  const [expandedSections, setExpandedSections] = useState({
    badge: true,
    headline: false,
    subheadline: false,
    cta: false,
    trustBadge: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      await save();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Badge (1 campo)
    total += 1;
    if (pageData.hero.badge.trim()) completed++;

    // Headline (2 campos)
    total += 2;
    if (pageData.hero.headline.textNormal.trim()) completed++;
    if (pageData.hero.headline.textAccent.trim()) completed++;

    // Subheadline (1 campo)
    total += 1;
    if (pageData.hero.subheadline.trim()) completed++;

    // Primary CTA (2 campos)
    total += 2;
    if (pageData.hero.primaryCta.text.trim()) completed++;
    if (pageData.hero.primaryCta.link.trim()) completed++;

    // Secondary CTA (2 campos)
    total += 2;
    if (pageData.hero.secondaryCta.text.trim()) completed++;
    if (pageData.hero.secondaryCta.link.trim()) completed++;

    // Trust Badge (1 campo)
    total += 1;
    if (pageData.hero.trustBadge.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={Star}
      title="Seção Headline (Destaque Principal)"
      description="Gerencie o conteúdo principal da seção headline"
      exists={!!exists}
      itemName="Headline"
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
                    Badge Principal
                  </label>
                  <Input
                    value={pageData.hero.badge}
                    onChange={(e) => updateNested('hero.badge', e.target.value)}
                    placeholder="Estratégia Digital & Inteligência Artificial [cite: 98, 204, 208]"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                    <p>Texto curto que aparece acima do título principal, geralmente destacando o diferencial ou categoria.</p>
                    <p className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Headline */}
        <div className="space-y-4">
          <SectionHeader
            title="Título Principal (Headline)"
            section="headline"
            icon={Type}
            isExpanded={expandedSections.headline}
            onToggle={() => toggleSection("headline")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.headline ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto Normal
                  </label>
                  <Input
                    value={pageData.hero.headline.textNormal}
                    onChange={(e) => updateNested('hero.headline.textNormal', e.target.value)}
                    placeholder="Mais tráfego, mais leads [cite: 96, 176, 183]"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Primeira parte do título principal
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto em Destaque
                  </label>
                  <Input
                    value={pageData.hero.headline.textAccent}
                    onChange={(e) => updateNested('hero.headline.textAccent', e.target.value)}
                    placeholder="e mais vendas. [cite: 96, 176, 185]"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg font-semibold"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Segunda parte do título que será destacada visualmente
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Subheadline */}
        <div className="space-y-4">
          <SectionHeader
            title="Subtítulo"
            section="subheadline"
            icon={Quote}
            isExpanded={expandedSections.subheadline}
            onToggle={() => toggleSection("subheadline")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.subheadline ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto do Subtítulo
                  </label>
                  <TextArea
                    value={pageData.hero.subheadline}
                    onChange={(e) => updateNested('hero.subheadline', e.target.value)}
                    placeholder="Unimos a precisão da IA com estratégias de tráfego pago para transformar a sua presença digital em uma máquina de faturamento. [cite: 98, 178, 204]"
                    rows={4}
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                    <p>Texto descritivo que aparece abaixo do título principal.</p>
                    <p className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <strong>Dica:</strong> Explique brevemente o valor principal da sua oferta
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção CTA */}
        <div className="space-y-4">
          <SectionHeader
            title="Call to Action (CTA)"
            section="cta"
            icon={Target}
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
                {/* Primary CTA */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    CTA Primário
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto do Botão Primário
                      </label>
                      <Input
                        value={pageData.hero.primaryCta.text}
                        onChange={(e) => updateNested('hero.primaryCta.text', e.target.value)}
                        placeholder="Quero Escalar meu Negócio [cite: 231, 236]"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-semibold"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Texto do botão principal de ação
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Link do Botão Primário
                      </label>
                      <Input
                        value={pageData.hero.primaryCta.link}
                        onChange={(e) => updateNested('hero.primaryCta.link', e.target.value)}
                        placeholder="https://wa.me/55719XXXXXXXX"
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

                {/* Secondary CTA */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    CTA Secundário
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto do Botão Secundário
                      </label>
                      <Input
                        value={pageData.hero.secondaryCta.text}
                        onChange={(e) => updateNested('hero.secondaryCta.text', e.target.value)}
                        placeholder="Ver Nosso Arsenal"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Texto do botão secundário/alternativo
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Link do Botão Secundário
                      </label>
                      <Input
                        value={pageData.hero.secondaryCta.link}
                        onChange={(e) => updateNested('hero.secondaryCta.link', e.target.value)}
                        placeholder="#Solucoes"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Link para seção interna ou página específica
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Trust Badge */}
        <div className="space-y-4">
          <SectionHeader
            title="Badge de Confiança"
            section="trustBadge"
            icon={Award}
            isExpanded={expandedSections.trustBadge}
            onToggle={() => toggleSection("trustBadge")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.trustBadge ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto do Selo de Confiança
                  </label>
                  <TextArea
                    value={pageData.hero.trustBadge}
                    onChange={(e) => updateNested('hero.trustBadge', e.target.value)}
                    placeholder="Consultoria liderada por especialistas com +25 anos de mercado [cite: 299]"
                    rows={3}
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                    <p>Texto que aparece abaixo dos CTAs para aumentar a confiança e credibilidade.</p>
                    <p className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <strong>Dica:</strong> Destaque experiência, prêmios, certificações ou números impressionantes
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
          totalCount={completion.total}
          itemName="Hero"
          icon={Star}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={1}
        itemName="Seção Hero"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}