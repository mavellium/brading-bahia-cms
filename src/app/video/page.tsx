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
  Video,
  Image as ImageIcon,
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
  Star,
  Sparkles,
  Italic,
  Film
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
import { VideoUpload } from "@/components/VideoUpload";
import { ImageUpload } from "@/components/ImageUpload";

interface BackgroundImage {
  src: string;
  alt: string;
}

interface VideoConfig {
  src: string;
}

interface Headline {
  textNormal: string;
  textItalic: string;
  textEnd: string;
}

interface Content {
  badge: string;
  headline: Headline;
}

interface ShowcaseData {
  showcase: {
    backgroundImage: BackgroundImage;
    video: VideoConfig;
    content: Content;
  };
}

const defaultShowcaseData: ShowcaseData = {
  showcase: {
    backgroundImage: {
      src: "",
      alt: ""
    },
    video: {
      src: ""
    },
    content: {
      badge: "",
      headline: {
        textNormal: "",
        textItalic: "",
        textEnd: ""
      }
    }
  }
};

const mergeWithDefaults = (apiData: any, defaultData: ShowcaseData): ShowcaseData => {
  if (!apiData) return defaultData;
  
  return {
    showcase: {
      backgroundImage: {
        src: apiData.showcase?.backgroundImage?.src || defaultData.showcase.backgroundImage.src,
        alt: apiData.showcase?.backgroundImage?.alt || defaultData.showcase.backgroundImage.alt,
      },
      video: {
        src: apiData.showcase?.video?.src || defaultData.showcase.video.src,
      },
      content: {
        badge: apiData.showcase?.content?.badge || defaultData.showcase.content.badge,
        headline: {
          textNormal: apiData.showcase?.content?.headline?.textNormal || defaultData.showcase.content.headline.textNormal,
          textItalic: apiData.showcase?.content?.headline?.textItalic || defaultData.showcase.content.headline.textItalic,
          textEnd: apiData.showcase?.content?.headline?.textEnd || defaultData.showcase.content.headline.textEnd,
        }
      }
    }
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

export default function ShowcasePage() {
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
    fileStates,
    setFileState,
  } = useJsonManagement<ShowcaseData>({
    apiPath: "/api/tegbe-institucional/json/video",
    defaultData: defaultShowcaseData,
    mergeFunction: mergeWithDefaults,
  });

  const [expandedSections, setExpandedSections] = useState({
    content: true,
    backgroundImage: false,
    video: false,
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

  // Função auxiliar para obter File do fileStates
  const getFileFromState = (key: string): File | null => {
    const value = fileStates[key];
    return value instanceof File ? value : null;
  };

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;

    // Content (4 campos)
    total += 4;
    if (pageData.showcase.content.badge.trim()) completed++;
    if (pageData.showcase.content.headline.textNormal.trim()) completed++;
    if (pageData.showcase.content.headline.textItalic.trim()) completed++;
    if (pageData.showcase.content.headline.textEnd.trim()) completed++;

    // Background Image (2 campos + arquivo)
    total += 2;
    if (pageData.showcase.backgroundImage.src.trim()) completed++;
    if (pageData.showcase.backgroundImage.alt.trim()) completed++;

    // Video (1 campo + arquivo)
    total += 1;
    if (pageData.showcase.video.src.trim()) completed++;

    return { completed, total };
  };

  const completion = calculateCompletion();

  if (loading && !exists) {
    return <Loading layout={Layout} exists={!!exists} />;
  }

  return (
    <ManageLayout
      headerIcon={Film}
      title="Seção Showcase (Vitrine)"
      description="Gerencie o vídeo de apresentação e conteúdo da seção showcase"
      exists={!!exists}
      itemName="Showcase"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Seção Conteúdo */}
        <div className="space-y-4">
          <SectionHeader
            title="Conteúdo da Vitrine"
            section="content"
            icon={Type}
            isExpanded={expandedSections.content}
            onToggle={() => toggleSection("content")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.content ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Badge da Seção
                  </label>
                  <Input
                    value={pageData.showcase.content.badge}
                    onChange={(e) => updateNested('showcase.content.badge', e.target.value)}
                    placeholder="A Nova Era da Performance"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                    Texto curto que identifica a seção, geralmente destacando inovação ou performance
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Headline da Vitrine
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto Normal
                      </label>
                      <Input
                        value={pageData.showcase.content.headline.textNormal}
                        onChange={(e) => updateNested('showcase.content.headline.textNormal', e.target.value)}
                        placeholder="Tecnologia que"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Primeira parte do título (normal)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2 flex items-center gap-2">
                        <Italic className="w-4 h-4" />
                        Texto em Itálico (Destaque)
                      </label>
                      <Input
                        value={pageData.showcase.content.headline.textItalic}
                        onChange={(e) => updateNested('showcase.content.headline.textItalic', e.target.value)}
                        placeholder="conecta"
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg italic"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Parte central do título em itálico para destaque
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                        Texto Final
                      </label>
                      <Input
                        value={pageData.showcase.content.headline.textEnd}
                        onChange={(e) => updateNested('showcase.content.headline.textEnd', e.target.value)}
                        placeholder="sua marca ao resultado que realmente importa."
                        className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] text-lg"
                      />
                      <p className="text-xs text-[var(--color-secondary)]/50 mt-2">
                        Conclusão do título principal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Imagem de Fundo */}
        <div className="space-y-4">
          <SectionHeader
            title="Imagem de Fundo"
            section="backgroundImage"
            icon={ImageIcon}
            isExpanded={expandedSections.backgroundImage}
            onToggle={() => toggleSection("backgroundImage")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.backgroundImage ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <ImageUpload
                  label="Imagem de Fundo do Showcase"
                  currentImage={pageData.showcase.backgroundImage.src || ''}
                  selectedFile={getFileFromState('showcase.backgroundImage.src')}
                  onFileChange={(file) => setFileState('showcase.backgroundImage.src', file)}
                  aspectRatio="aspect-video"
                  previewWidth={800}
                  previewHeight={450}
                  description="Imagem que serve como plano de fundo para a seção showcase. Formato recomendado: PNG com transparência ou JPG de alta qualidade."
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Texto Alternativo (Alt Text)
                  </label>
                  <Input
                    value={pageData.showcase.backgroundImage.alt}
                    onChange={(e) => updateNested('showcase.backgroundImage.alt', e.target.value)}
                    placeholder="Logo Branding Bahia - Farol"
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                  />
                  <div className="text-xs text-[var(--color-secondary)]/50 mt-2 space-y-1">
                    <p>Texto descritivo para acessibilidade e SEO.</p>
                    <p className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <strong>Dica:</strong> Descreva a imagem de forma clara e objetiva
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Seção Vídeo */}
        <div className="space-y-4">
          <SectionHeader
            title="Vídeo de Apresentação"
            section="video"
            icon={Video}
            isExpanded={expandedSections.video}
            onToggle={() => toggleSection("video")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.video ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 bg-[var(--color-background)]">
              <div className="space-y-6">
                <VideoUpload
                  label="Vídeo do Showcase"
                  currentVideo={pageData.showcase.video.src || ''}
                  selectedFile={getFileFromState('showcase.video.src')}
                  onFileChange={(file) => setFileState('showcase.video.src', file)}
                  aspectRatio="aspect-video"
                  previewWidth={800}
                  previewHeight={450}
                  description="Vídeo de apresentação ou demonstração que será exibido na seção showcase."
                  accept="video/mp4,video/webm,video/ogg"
                  maxSizeMB={100}
                  showRemoveButton={true}
                />
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
          itemName="Showcase"
          icon={Film}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={1}
        itemName="Seção Showcase"
      />

      <FeedbackMessages 
        success={success} 
        errorMsg={errorMsg} 
      />
    </ManageLayout>
  );
}