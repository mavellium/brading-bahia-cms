/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Switch } from "@/components/Switch";
import { 
  Tag, 
  Palette, 
  Type, 
  Zap, 
  Eye, 
  Layers,
  Home,
  ShoppingCart,
  Megaphone,
  Info,
  GraduationCap,
  GripVertical,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Plus,
  Users,
  Target,
  TrendingUp,
  BarChart3,
  Award,
  BookOpen,
  DollarSign,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import ColorPicker from "@/components/ColorPicker";
import IconSelector from "@/components/IconSelector";
import { useJsonManagement } from "@/hooks/useJsonManagement";
import { TextArea } from "@/components/TextArea";

interface BadgeData {
  icone?: string;
  texto?: string;
  cor?: string;
  visivel?: boolean;
}

interface PalavraAnimada {
  texto?: string;
  cor?: string;
  ordem?: number;
}

interface TituloData {
  chamada?: string;
  palavrasAnimadas?: PalavraAnimada[];
  tituloPrincipal?: string;
  separador?: string;
}

interface BotaoData {
  texto?: string;
  link?: string;
  icone?: string;
  estilo?: string;
  visivel?: boolean;
}

interface AgendaData {
  status?: string;
  mes?: string;
  corStatus?: string;
  texto?: string;
  visivel?: boolean;
}

interface EfeitosData {
  brilhoTitulo?: string;
  spotlight?: boolean;
  grid?: boolean;
  sombraInferior?: boolean;
}

interface ConfiguracoesData {
  intervaloAnimacao?: number;
  corFundo?: string;
  corDestaque?: string;
  efeitos?: EfeitosData;
}

interface HeadlinePageData {
  badge?: BadgeData;
  titulo?: TituloData;
  subtitulo?: string;
  botao?: BotaoData;
  agenda?: AgendaData;
  configuracoes?: ConfiguracoesData;
}

// ESTRUTURA PARA CURSOS
interface CursoTheme {
  accentColor?: string;
  secondaryColor?: string;
  buttonTextColor?: string;
  buttonIconColor?: string;
}

interface CursoHeadline {
  prefix?: string;
  highlight?: string;
}

interface CursoSubheadline {
  main?: string;
  highlight?: string;
  description?: string;
}

interface CursoCTAButton {
  text?: string;
  url?: string;
  bg?: string;
  textColor?: string;
  iconColor?: string;
  glow?: string;
  hoverBg?: string;
  borderColor?: string;
}

interface CursoCTA {
  primary?: CursoCTAButton;
  secondary?: CursoCTAButton;
}

interface CursoSocialProof {
  count?: string;
  label?: string;
}

interface CursoCardItem {
  name?: string;
  status?: "Liberado" | "Bloqueado";
}

interface CursoCardHeader {
  title?: string;
  subtitle?: string;
  tag?: string;
}

interface CursoCardFooter {
  label?: string;
  value?: string;
}

interface CursoCardFloatingBadge {
  label?: string;
  value?: string;
}

interface CursoCardData {
  header?: CursoCardHeader;
  items?: CursoCardItem[];
  footer?: CursoCardFooter;
  floatingBadge?: CursoCardFloatingBadge;
}

interface CursoContent {
  headline?: CursoHeadline;
  subheadline?: CursoSubheadline;
  cta?: CursoCTA;
  socialProof?: CursoSocialProof;
  card?: CursoCardData;
}

interface CursoPageData {
  theme?: CursoTheme;
  content?: CursoContent;
}

// TIPO UNION PARA DADOS DO HEADLINE
type HeadlinePageDataUnion = HeadlinePageData | CursoPageData;

interface HeadlineData {
  home?: HeadlinePageData;
  ecommerce?: HeadlinePageData;
  marketing?: HeadlinePageData;
  sobre?: HeadlinePageData;
  cursos?: CursoPageData;
  defaultTheme?: "home" | "ecommerce" | "marketing" | "sobre" | "cursos";
}

const defaultHeadlinePageData: HeadlinePageData = {
  badge: {
    icone: "",
    texto: "",
    cor: "#FFCC00",
    visivel: true
  },
  titulo: {
    chamada: "",
    palavrasAnimadas: [],
    tituloPrincipal: "",
    separador: ""
  },
  subtitulo: "",
  botao: {
    texto: "",
    link: "",
    icone: "",
    estilo: "gradiente-amarelo",
    visivel: true
  },
  agenda: {
    status: "aberta",
    mes: "",
    corStatus: "#22C55E",
    texto: "",
    visivel: true
  },
  configuracoes: {
    intervaloAnimacao: 2500,
    corFundo: "#020202",
    corDestaque: "#FFCC00",
    efeitos: {
      brilhoTitulo: "",
      spotlight: false,
      grid: false,
      sombraInferior: false
    }
  }
};

const defaultCursoPageData: CursoPageData = {
  theme: {
    accentColor: "#FFD700",
    secondaryColor: "#B8860B",
    buttonTextColor: "#000000",
    buttonIconColor: "#000000"
  },
  content: {
    headline: {
      prefix: "Você não precisa entender de internet para",
      highlight: "começar a vender online."
    },
    subheadline: {
      main: "Descubra o passo a passo completo —",
      highlight: "do zero à sua primeira venda.",
      description: "Produto, fornecedor, loja, tráfego e atendimento: tudo explicado de forma simples."
    },
    cta: {
      primary: {
        text: "COMEÇAR AGORA",
        url: "#cursos",
        bg: "#FFD700",
        textColor: "#000000",
        iconColor: "#000000",
        glow: "rgba(255, 215, 0, 0.3)"
      },
      secondary: {
        text: "Ver Conteúdo",
        url: "#conteudo",
        textColor: "#FFD700",
        hoverBg: "rgba(255, 215, 0, 0.05)",
        borderColor: "rgba(255, 215, 0, 0.2)"
      }
    },
    socialProof: {
      count: "+1.200",
      label: "alunos formados"
    },
    card: {
      header: {
        title: "Ecossistema TegPro",
        subtitle: "Status: Escala Permitida",
        tag: "Sistema Ativo"
      },
      items: [
        { name: "Gestão de Tráfego 3.0", status: "Liberado" },
        { name: "Copywriting Neural", status: "Liberado" },
        { name: "Automação & CRM", status: "Liberado" },
        { name: "Vendas High-Ticket", status: "Bloqueado" }
      ],
      footer: {
        label: "PROGRESSO",
        value: "75%"
      },
      floatingBadge: {
        label: "ROI Mensal",
        value: "+145%"
      }
    }
  }
};

const defaultHeadlineData: HeadlineData = {
  home: { ...defaultHeadlinePageData },
  ecommerce: { ...defaultHeadlinePageData },
  marketing: { ...defaultHeadlinePageData },
  sobre: { ...defaultHeadlinePageData },
  cursos: { ...defaultCursoPageData },
  defaultTheme: "home"
};

// Componente ThemeTab
interface ThemeTabProps {
  themeKey: "home" | "ecommerce" | "marketing" | "sobre" | "cursos";
  label: string;
  isActive: boolean;
  onClick: (theme: "home" | "ecommerce" | "marketing" | "sobre" | "cursos") => void;
  icon: React.ReactNode;
}

const ThemeTab = ({ themeKey, label, isActive, onClick, icon }: ThemeTabProps) => (
  <Button
    type="button"
    onClick={() => onClick(themeKey)}
    variant={isActive ? "primary" : "secondary"}
    className={`px-4 py-2 font-medium rounded-lg transition-all flex items-center gap-2 ${
      isActive
        ? "bg-[var(--color-primary)] text-white shadow-md"
        : "bg-[var(--color-background)] text-[var(--color-secondary)] hover:bg-[var(--color-background)]/80 border border-[var(--color-border)]"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

// Helper function para obter dados seguros com valores padrão
const getSafeData = <T,>(data: T | undefined | null, defaultValue: T): T => {
  if (!data) return defaultValue;
  return data;
};

// Componente SectionCard - substitui o SectionHeader com toggle
const SectionCard = ({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string; 
  icon: any; 
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div 
        className="flex items-center justify-between p-4 bg-[var(--color-background)] rounded-lg cursor-pointer hover:bg-[var(--color-background)]/80 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-secondary)]">{title}</h3>
        </div>
        <button
          type="button"
          className="p-1 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-[var(--color-secondary)]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[var(--color-secondary)]" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

export default function HeadlinePageComponent({ activeTab }: {activeTab: "home" | "ecommerce" | "marketing" | "sobre" | "cursos"}) {
  const [activeTheme, setActiveTheme] = useState<"home" | "ecommerce" | "marketing" | "sobre" | "cursos">(activeTab);
  const [localPalavrasAnimadas, setLocalPalavrasAnimadas] = useState<PalavraAnimada[]>([]);
  const [localCardItems, setLocalCardItems] = useState<CursoCardItem[]>([]);
  const [draggingPalavra, setDraggingPalavra] = useState<number | null>(null);
  const [draggingCardItem, setDraggingCardItem] = useState<number | null>(null);
  
  const {
    data: headlineData,
    loading,
    success,
    errorMsg,
    deleteModal,
    save,
    exists,
    openDeleteAllModal,
    closeDeleteModal,
    confirmDelete,
    updateNested
  } = useJsonManagement<HeadlineData>({
    apiPath: "/api/tegbe-institucional/json/headline",
    defaultData: defaultHeadlineData,
  });

  // Referência para nova palavra animada e card item
  const newPalavraRef = useRef<HTMLDivElement>(null);
  const newCardItemRef = useRef<HTMLDivElement>(null);

  // Controle de planos
  const currentPlanType = 'pro';
  const currentPlanLimit = currentPlanType === 'pro' ? 10 : 5;

  // Resetar estados quando mudar de tema
  useEffect(() => {
    if (activeTheme !== 'cursos') {
      const currentThemeData = getCurrentThemeData() as HeadlinePageData;
      const palavras = currentThemeData.titulo?.palavrasAnimadas || [];
      setLocalPalavrasAnimadas(palavras);
    } else {
      const currentThemeData = getCurrentThemeData() as CursoPageData;
      const items = currentThemeData.content?.card?.items || [];
      setLocalCardItems(items);
    }
  }, [activeTheme, headlineData]);

  // Helper para obter dados do tema atual de forma segura
  const getCurrentThemeData = useCallback((): HeadlinePageDataUnion => {
    const themeData = headlineData?.[activeTheme];
    if (activeTheme === 'cursos') {
      return getSafeData(themeData as CursoPageData, defaultCursoPageData);
    }
    return getSafeData(themeData as HeadlinePageData, defaultHeadlinePageData);
  }, [headlineData, activeTheme]);

  const handleThemeChange = useCallback((path: string, value: any) => {
    updateNested(`${activeTheme}.${path}`, value);
  }, [activeTheme, updateNested]);

  const handleColorChange = (path: string, color: string) => {
    const cleanColor = color.startsWith('#') ? color : `#${color}`;
    handleThemeChange(path, cleanColor);
  };

  // Funções para palavras animadas com drag & drop (apenas para temas não-cursos)
  const handleAddPalavraAnimada = () => {
    if (localPalavrasAnimadas.length >= currentPlanLimit) {
      return false;
    }
    
    const newPalavra: PalavraAnimada = {
      texto: "NOVA PALAVRA",
      cor: "#FFCC00",
      ordem: localPalavrasAnimadas.length + 1
    };
    
    const updated = [...localPalavrasAnimadas, newPalavra];
    setLocalPalavrasAnimadas(updated);
    handleThemeChange('titulo.palavrasAnimadas', updated);
    
    setTimeout(() => {
      newPalavraRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const updatePalavraAnimada = (index: number, updates: Partial<PalavraAnimada>) => {
    const updated = [...localPalavrasAnimadas];
    if (index >= 0 && index < updated.length) {
      updated[index] = { ...updated[index], ...updates };
      setLocalPalavrasAnimadas(updated);
      handleThemeChange('titulo.palavrasAnimadas', updated);
    }
  };

  const removePalavraAnimada = (index: number) => {
    const updated = [...localPalavrasAnimadas];
    
    if (updated.length <= 1) {
      // Mantém pelo menos um item vazio
      const emptyPalavra: PalavraAnimada = {
        texto: "",
        cor: "#FFCC00",
        ordem: 1
      };
      setLocalPalavrasAnimadas([emptyPalavra]);
      handleThemeChange('titulo.palavrasAnimadas', [emptyPalavra]);
    } else {
      updated.splice(index, 1);
      // Atualiza ordens
      updated.forEach((palavra, idx) => {
        palavra.ordem = idx + 1;
      });
      setLocalPalavrasAnimadas(updated);
      handleThemeChange('titulo.palavrasAnimadas', updated);
    }
  };

  // Funções para card items (apenas para cursos)
  const handleAddCardItem = () => {
    if (localCardItems.length >= currentPlanLimit) {
      return false;
    }
    
    const newItem: CursoCardItem = {
      name: "",
      status: "Liberado"
    };
    
    const updated = [...localCardItems, newItem];
    setLocalCardItems(updated);
    handleThemeChange('content.card.items', updated);
    
    setTimeout(() => {
      newCardItemRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 100);
    
    return true;
  };

  const updateCardItem = (index: number, updates: Partial<CursoCardItem>) => {
    const updated = [...localCardItems];
    if (index >= 0 && index < updated.length) {
      updated[index] = { ...updated[index], ...updates };
      setLocalCardItems(updated);
      handleThemeChange('content.card.items', updated);
    }
  };

  const removeCardItem = (index: number) => {
    const updated = [...localCardItems];
    
    if (updated.length <= 1) {
      // Mantém pelo menos um item vazio
      const emptyItem: CursoCardItem = {
        name: "",
        status: "Liberado"
      };
      setLocalCardItems([emptyItem]);
      handleThemeChange('content.card.items', [emptyItem]);
    } else {
      updated.splice(index, 1);
      setLocalCardItems(updated);
      handleThemeChange('content.card.items', updated);
    }
  };

  // Funções de drag & drop para palavras animadas
  const handlePalavraDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingPalavra(index);
  };

  const handlePalavraDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingPalavra === null || draggingPalavra === index) return;
    
    const updated = [...localPalavrasAnimadas];
    const draggedItem = updated[draggingPalavra];
    
    updated.splice(draggingPalavra, 1);
    
    const newIndex = index > draggingPalavra ? index : index;
    updated.splice(newIndex, 0, draggedItem);
    
    updated.forEach((palavra, idx) => {
      palavra.ordem = idx + 1;
    });
    
    setLocalPalavrasAnimadas(updated);
    handleThemeChange('titulo.palavrasAnimadas', updated);
    setDraggingPalavra(index);
  };

  const handlePalavraDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingPalavra(null);
  };

  // Funções de drag & drop para card items
  const handleCardItemDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('dragging');
    setDraggingCardItem(index);
  };

  const handleCardItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggingCardItem === null || draggingCardItem === index) return;
    
    const updated = [...localCardItems];
    const draggedItem = updated[draggingCardItem];
    
    updated.splice(draggingCardItem, 1);
    updated.splice(index, 0, draggedItem);
    
    setLocalCardItems(updated);
    handleThemeChange('content.card.items', updated);
    setDraggingCardItem(index);
  };

  const handleCardItemDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggingCardItem(null);
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
    if (e) {
      e.preventDefault();
    }
    
    try {
      await save();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  // Validações
  const isPalavraAnimadaValid = (palavra: PalavraAnimada): boolean => {
    return palavra.texto?.trim() !== '' && palavra.cor?.trim() !== '';
  };

  const isCardItemValid = (item: CursoCardItem): boolean => {
    return item.name?.trim() !== '' && item.status?.trim() !== '';
  };

  const isPalavrasLimitReached = localPalavrasAnimadas.length >= currentPlanLimit;
  const canAddNewPalavra = !isPalavrasLimitReached;
  const palavrasCompleteCount = localPalavrasAnimadas.filter(isPalavraAnimadaValid).length;
  const palavrasTotalCount = localPalavrasAnimadas.length;

  const isCardItemsLimitReached = localCardItems.length >= currentPlanLimit;
  const canAddNewCardItem = !isCardItemsLimitReached;
  const cardItemsCompleteCount = localCardItems.filter(isCardItemValid).length;
  const cardItemsTotalCount = localCardItems.length;

  const calculateCompletion = () => {
    let completed = 0;
    let total = 0;
    
    if (activeTheme === 'cursos') {
      const currentThemeData = getCurrentThemeData() as CursoPageData;

      // Tema (4 campos)
      total += 4;
      if (currentThemeData.theme?.accentColor?.trim()) completed++;
      if (currentThemeData.theme?.secondaryColor?.trim()) completed++;
      if (currentThemeData.theme?.buttonTextColor?.trim()) completed++;
      if (currentThemeData.theme?.buttonIconColor?.trim()) completed++;

      // Headline (2 campos)
      total += 2;
      if (currentThemeData.content?.headline?.prefix?.trim()) completed++;
      if (currentThemeData.content?.headline?.highlight?.trim()) completed++;

      // Subheadline (3 campos)
      total += 3;
      if (currentThemeData.content?.subheadline?.main?.trim()) completed++;
      if (currentThemeData.content?.subheadline?.highlight?.trim()) completed++;
      if (currentThemeData.content?.subheadline?.description?.trim()) completed++;

      // CTA Primary (6 campos)
      total += 6;
      const primaryCta = currentThemeData.content?.cta?.primary;
      if (primaryCta?.text?.trim()) completed++;
      if (primaryCta?.url?.trim()) completed++;
      if (primaryCta?.bg?.trim()) completed++;
      if (primaryCta?.textColor?.trim()) completed++;
      if (primaryCta?.iconColor?.trim()) completed++;
      if (primaryCta?.glow?.trim()) completed++;

      // CTA Secondary (5 campos)
      total += 5;
      const secondaryCta = currentThemeData.content?.cta?.secondary;
      if (secondaryCta?.text?.trim()) completed++;
      if (secondaryCta?.url?.trim()) completed++;
      if (secondaryCta?.textColor?.trim()) completed++;
      if (secondaryCta?.hoverBg?.trim()) completed++;
      if (secondaryCta?.borderColor?.trim()) completed++;

      // Social Proof (2 campos)
      total += 2;
      if (currentThemeData.content?.socialProof?.count?.trim()) completed++;
      if (currentThemeData.content?.socialProof?.label?.trim()) completed++;

      // Card Header (3 campos)
      total += 3;
      const cardHeader = currentThemeData.content?.card?.header;
      if (cardHeader?.title?.trim()) completed++;
      if (cardHeader?.subtitle?.trim()) completed++;
      if (cardHeader?.tag?.trim()) completed++;

      // Card Items (2 campos cada)
      total += localCardItems.length * 2;
      localCardItems.forEach(item => {
        if (item.name?.trim()) completed++;
        if (item.status?.trim()) completed++;
      });

      // Card Footer (2 campos)
      total += 2;
      const cardFooter = currentThemeData.content?.card?.footer;
      if (cardFooter?.label?.trim()) completed++;
      if (cardFooter?.value?.trim()) completed++;

      // Floating Badge (2 campos)
      total += 2;
      const floatingBadge = currentThemeData.content?.card?.floatingBadge;
      if (floatingBadge?.label?.trim()) completed++;
      if (floatingBadge?.value?.trim()) completed++;
    } else {
      const currentThemeData = getCurrentThemeData() as HeadlinePageData;

      // Badge (4 campos)
      total += 4;
      if (currentThemeData.badge?.icone?.trim()) completed++;
      if (currentThemeData.badge?.texto?.trim()) completed++;
      if (currentThemeData.badge?.cor?.trim()) completed++;
      if (currentThemeData.badge?.visivel !== undefined) completed++;

      // Título (3 campos + palavras animadas)
      total += 3;
      if (currentThemeData.titulo?.chamada?.trim()) completed++;
      if (currentThemeData.titulo?.tituloPrincipal?.trim()) completed++;
      if (currentThemeData.titulo?.separador?.trim()) completed++;

      // Palavras Animadas (2 campos cada)
      total += localPalavrasAnimadas.length * 2;
      localPalavrasAnimadas.forEach(palavra => {
        if (palavra.texto?.trim()) completed++;
        if (palavra.cor?.trim()) completed++;
      });

      // Subtítulo (1 campo)
      total += 1;
      if (currentThemeData.subtitulo?.trim()) completed++;

      // Botão (5 campos)
      total += 5;
      if (currentThemeData.botao?.texto?.trim()) completed++;
      if (currentThemeData.botao?.link?.trim()) completed++;
      if (currentThemeData.botao?.icone?.trim()) completed++;
      if (currentThemeData.botao?.estilo?.trim()) completed++;
      if (currentThemeData.botao?.visivel !== undefined) completed++;

      // Agenda (5 campos)
      total += 5;
      if (currentThemeData.agenda?.status?.trim()) completed++;
      if (currentThemeData.agenda?.mes?.trim()) completed++;
      if (currentThemeData.agenda?.corStatus?.trim()) completed++;
      if (currentThemeData.agenda?.texto?.trim()) completed++;
      if (currentThemeData.agenda?.visivel !== undefined) completed++;

      // Configurações (6 campos)
      total += 6;
      if (currentThemeData.configuracoes?.intervaloAnimacao) completed++;
      if (currentThemeData.configuracoes?.corFundo?.trim()) completed++;
      if (currentThemeData.configuracoes?.corDestaque?.trim()) completed++;
      if (currentThemeData.configuracoes?.efeitos?.brilhoTitulo?.trim() !== undefined) completed++;
      if (currentThemeData.configuracoes?.efeitos?.spotlight !== undefined) completed++;
      if (currentThemeData.configuracoes?.efeitos?.grid !== undefined) completed++;
    }

    return { completed, total };
  };

  const completion = calculateCompletion();

  // RENDERIZAÇÃO PARA CURSOS
  const renderCursoThemeSection = () => {
    const currentThemeData = getCurrentThemeData() as CursoPageData;
    const themeData = currentThemeData.theme;
    
    return (
      <SectionCard title="Tema de Cores" icon={Palette}>
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Cor de Destaque (Primária)
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="#FFD700"
                  value={themeData?.accentColor || "#FFD700"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('theme.accentColor', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                />
                <ColorPicker
                  color={themeData?.accentColor || "#FFD700"}
                  onChange={(color: string) => handleColorChange('theme.accentColor', color)}
                />
              </div>
              <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
                Cor dourada para elementos principais
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Cor Secundária
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="#B8860B"
                  value={themeData?.secondaryColor || "#B8860B"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('theme.secondaryColor', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                />
                <ColorPicker
                  color={themeData?.secondaryColor || "#B8860B"}
                  onChange={(color: string) => handleColorChange('theme.secondaryColor', color)}
                />
              </div>
              <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
                Cor bronze para elementos secundários
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Cor do Texto do Botão
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="#000000"
                  value={themeData?.buttonTextColor || "#000000"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('theme.buttonTextColor', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                />
                <ColorPicker
                  color={themeData?.buttonTextColor || "#000000"}
                  onChange={(color: string) => handleColorChange('theme.buttonTextColor', color)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Cor do Ícone do Botão
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="#000000"
                  value={themeData?.buttonIconColor || "#000000"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('theme.buttonIconColor', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                />
                <ColorPicker
                  color={themeData?.buttonIconColor || "#000000"}
                  onChange={(color: string) => handleColorChange('theme.buttonIconColor', color)}
                />
              </div>
            </div>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderCursoHeadlineSection = () => {
    const currentThemeData = getCurrentThemeData() as CursoPageData;
    const headlineData = currentThemeData.content?.headline;
    
    return (
      <SectionCard title="Headline Principal" icon={Type}>
        <Card className="p-6 bg-[var(--color-background)] space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-secondary)]">
              Prefixo do Headline
            </label>
            <Input
              type="text"
              placeholder="Você não precisa entender de internet para"
              value={headlineData?.prefix || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleThemeChange('content.headline.prefix', e.target.value)
              }
              className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
            />
            <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
              Primeira parte do headline
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-secondary)]">
              Texto em Destaque
            </label>
            <Input
              type="text"
              placeholder="começar a vender online."
              value={headlineData?.highlight || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleThemeChange('content.headline.highlight', e.target.value)
              }
              className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
            />
            <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
              Parte que será destacada em dourado
            </p>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderCursoSubheadlineSection = () => {
    const currentThemeData = getCurrentThemeData() as CursoPageData;
    const subheadlineData = currentThemeData.content?.subheadline;
    
    return (
      <SectionCard title="Subheadline" icon={BookOpen}>
        <Card className="p-6 bg-[var(--color-background)] space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-secondary)]">
              Texto Principal
            </label>
            <Input
              type="text"
              placeholder="Descubra o passo a passo completo —"
              value={subheadlineData?.main || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleThemeChange('content.subheadline.main', e.target.value)
              }
              className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-secondary)]">
              Texto em Destaque
            </label>
            <Input
              type="text"
              placeholder="do zero à sua primeira venda."
              value={subheadlineData?.highlight || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleThemeChange('content.subheadline.highlight', e.target.value)
              }
              className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-secondary)]">
              Descrição Detalhada
            </label>
            <TextArea
              placeholder="Produto, fornecedor, loja, tráfego e atendimento: tudo explicado de forma simples."
              value={subheadlineData?.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                handleThemeChange('content.subheadline.description', e.target.value)
              }
              rows={3}
              className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
            />
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderCursoCtaSection = () => {
    const currentThemeData = getCurrentThemeData() as CursoPageData;
    const ctaData = currentThemeData.content?.cta;
    
    return (
      <SectionCard title="Call to Action" icon={Zap}>
        <Card className="p-6 bg-[var(--color-background)] space-y-8">
          {/* CTA Primário */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
              <Target className="w-5 h-5" />
              Botão Primário (Ação Principal)
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Texto do Botão
                </label>
                <Input
                  type="text"
                  placeholder="COMEÇAR AGORA"
                  value={ctaData?.primary?.text || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.cta.primary.text', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  URL/Link
                </label>
                <Input
                  type="text"
                  placeholder="#cursos"
                  value={ctaData?.primary?.url || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.cta.primary.url', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Cor de Fundo
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="#FFD700"
                    value={ctaData?.primary?.bg || "#FFD700"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleThemeChange('content.cta.primary.bg', e.target.value)
                    }
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                  />
                  <ColorPicker
                    color={ctaData?.primary?.bg || "#FFD700"}
                    onChange={(color: string) => handleThemeChange('content.cta.primary.bg', color)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Cor do Texto
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="#000000"
                    value={ctaData?.primary?.textColor || "#000000"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleThemeChange('content.cta.primary.textColor', e.target.value)
                    }
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                  />
                  <ColorPicker
                    color={ctaData?.primary?.textColor || "#000000"}
                    onChange={(color: string) => handleThemeChange('content.cta.primary.textColor', color)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Cor do Ícone
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="#000000"
                    value={ctaData?.primary?.iconColor || "#000000"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleThemeChange('content.cta.primary.iconColor', e.target.value)
                    }
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                  />
                  <ColorPicker
                    color={ctaData?.primary?.iconColor || "#000000"}
                    onChange={(color: string) => handleThemeChange('content.cta.primary.iconColor', color)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Efeito de Brilho (Glow)
                </label>
                <Input
                  type="text"
                  placeholder="rgba(255, 215, 0, 0.3)"
                  value={ctaData?.primary?.glow || "rgba(255, 215, 0, 0.3)"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.cta.primary.glow', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                />
                <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
                  Efeito de sombra com cor RGBA
                </p>
              </div>
            </div>
          </div>

          {/* CTA Secundário */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Botão Secundário (Ação Alternativa)
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Texto do Botão
                </label>
                <Input
                  type="text"
                  placeholder="Ver Conteúdo"
                  value={ctaData?.secondary?.text || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.cta.secondary.text', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  URL/Link
                </label>
                <Input
                  type="text"
                  placeholder="#conteudo"
                  value={ctaData?.secondary?.url || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.cta.secondary.url', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Cor do Texto
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="#FFD700"
                    value={ctaData?.secondary?.textColor || "#FFD700"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleThemeChange('content.cta.secondary.textColor', e.target.value)
                    }
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                  />
                  <ColorPicker
                    color={ctaData?.secondary?.textColor || "#FFD700"}
                    onChange={(color: string) => handleThemeChange('content.cta.secondary.textColor', color)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Fundo no Hover
                </label>
                <Input
                  type="text"
                  placeholder="rgba(255, 215, 0, 0.05)"
                  value={ctaData?.secondary?.hoverBg || "rgba(255, 215, 0, 0.05)"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.cta.secondary.hoverBg', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Cor da Borda
                </label>
                <Input
                  type="text"
                  placeholder="rgba(255, 215, 0, 0.2)"
                  value={ctaData?.secondary?.borderColor || "rgba(255, 215, 0, 0.2)"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.cta.secondary.borderColor', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono"
                />
              </div>
            </div>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderCursoSocialProofSection = () => {
    const currentThemeData = getCurrentThemeData() as CursoPageData;
    const socialProofData = currentThemeData.content?.socialProof;
    
    return (
      <SectionCard title="Prova Social" icon={Users}>
        <Card className="p-6 bg-[var(--color-background)] space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-secondary)]">
              Contagem/Número
            </label>
            <Input
              type="text"
              placeholder="+1.200"
              value={socialProofData?.count || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleThemeChange('content.socialProof.count', e.target.value)
              }
              className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
            />
            <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
              Número impactante com sinal positivo
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-secondary)]">
              Rótulo/Descrição
            </label>
            <Input
              type="text"
              placeholder="alunos formados"
              value={socialProofData?.label || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                handleThemeChange('content.socialProof.label', e.target.value)
              }
              className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
            />
            <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
              O que o número representa
            </p>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderCursoCardSection = () => {
    const currentThemeData = getCurrentThemeData() as CursoPageData;
    const cardData = currentThemeData.content?.card;
    
    return (
      <SectionCard title="Card do Ecossistema" icon={TrendingUp}>
        <Card className="p-6 bg-[var(--color-background)] space-y-8">
          {/* Card Header */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
              <Award className="w-5 h-5" />
              Cabeçalho do Card
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Título
                </label>
                <Input
                  type="text"
                  placeholder="Ecossistema TegPro"
                  value={cardData?.header?.title || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.card.header.title', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Subtítulo
                </label>
                <Input
                  type="text"
                  placeholder="Status: Escala Permitida"
                  value={cardData?.header?.subtitle || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.card.header.subtitle', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Tag
                </label>
                <Input
                  type="text"
                  placeholder="Sistema Ativo"
                  value={cardData?.header?.tag || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.card.header.tag', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>
            </div>
          </div>

          {/* Card Items */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Itens do Card
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-[var(--color-secondary)]/70">
                    {cardItemsCompleteCount} de {cardItemsTotalCount} completos
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  type="button"
                  onClick={handleAddCardItem}
                  variant="primary"
                  className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                  disabled={!canAddNewCardItem}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Item
                </Button>
                {isCardItemsLimitReached && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Limite do plano atingido
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {localCardItems.map((item, index) => (
                <div 
                  key={index}
                  ref={index === localCardItems.length - 1 ? newCardItemRef : undefined}
                  draggable
                  onDragStart={(e) => handleCardItemDragStart(e, index)}
                  onDragOver={(e) => handleCardItemDragOver(e, index)}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleCardItemDragEnd}
                  onDrop={handleDrop}
                  className={`p-4 border border-[var(--color-border)] rounded-lg space-y-4 transition-all duration-200 ${
                    draggingCardItem === index 
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
                        onDragStart={(e) => handleCardItemDragStart(e, index)}
                      >
                        <GripVertical className="w-5 h-5 text-[var(--color-secondary)]/70" />
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-medium text-[var(--color-secondary)]/70">
                          {index + 1}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-medium text-[var(--color-secondary)]">
                            {item.name || "Item sem nome"}
                          </h5>
                          {isCardItemValid(item) ? (
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
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[var(--color-secondary)]">
                              Nome do Item
                            </label>
                            <Input
                              value={item.name || ""}
                              onChange={(e) => updateCardItem(index, { name: e.target.value })}
                              placeholder="Gestão de Tráfego 3.0"
                              className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-[var(--color-secondary)]">
                              Status
                            </label>
                            <select
                              value={item.status || "Liberado"}
                              onChange={(e) => updateCardItem(index, { status: e.target.value as "Liberado" | "Bloqueado" })}
                              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--color-background-body)] text-[var(--color-secondary)]"
                            >
                              <option value="Liberado">Liberado</option>
                              <option value="Bloqueado">Bloqueado</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        onClick={() => removeCardItem(index)}
                        variant="danger"
                        className="bg-red-600 hover:bg-red-700 border-none flex items-center gap-2"
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

          {/* Card Footer */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Rodapé do Card
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Rótulo
                </label>
                <Input
                  type="text"
                  placeholder="PROGRESSO"
                  value={cardData?.footer?.label || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.card.footer.label', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Valor
                </label>
                <Input
                  type="text"
                  placeholder="75%"
                  value={cardData?.footer?.value || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.card.footer.value', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[var(--color-secondary)] flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badge Flutuante
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Rótulo
                </label>
                <Input
                  type="text"
                  placeholder="ROI Mensal"
                  value={cardData?.floatingBadge?.label || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.card.floatingBadge.label', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Valor
                </label>
                <Input
                  type="text"
                  placeholder="+145%"
                  value={cardData?.floatingBadge?.value || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('content.card.floatingBadge.value', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>
            </div>
          </div>
        </Card>
      </SectionCard>
    );
  };

  // FUNÇÕES DE RENDERIZAÇÃO PARA TEMAS NÃO-CURSOS (home, ecommerce, marketing, sobre)
  const renderBadgeSection = () => {
    const currentThemeData = getCurrentThemeData() as HeadlinePageData;
    const badgeData = currentThemeData.badge || {};
    
    return (
      <SectionCard title="Badge" icon={Tag}>
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-[var(--color-secondary)]">
                Configurações do Badge
              </h4>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-[var(--color-secondary)]/70">
                  {[
                    badgeData.icone?.trim() !== '',
                    badgeData.texto?.trim() !== '',
                    badgeData.cor?.trim() !== ''
                  ].filter(Boolean).length} de 3 campos preenchidos
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <IconSelector
                  value={badgeData.icone || ""}
                  onChange={(value) => handleThemeChange('badge.icone', value)}
                  label="Ícone do Badge"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Texto do Badge
                </label>
                <Input
                  type="text"
                  placeholder="Consultoria Oficial Mercado Livre"
                  value={badgeData.texto || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('badge.texto', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--color-secondary)]">
                  Cor do Texto
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="#FFCC00"
                    value={badgeData.cor || "#FFCC00"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      handleThemeChange('badge.cor', e.target.value)
                    }
                    className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                  />
                  <ColorPicker
                    color={badgeData.cor || "#FFCC00"}
                    onChange={(color: string) => handleColorChange('badge.cor', color)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                    Visibilidade
                  </label>
                  <p className="text-sm text-[var(--color-secondary)]/70">Mostrar ou esconder o badge</p>
                </div>
                <Switch
                  checked={badgeData.visivel !== false}
                  onCheckedChange={(checked: boolean) => 
                    handleThemeChange('badge.visivel', checked)
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderTituloSection = () => {
    const currentThemeData = getCurrentThemeData() as HeadlinePageData;
    const tituloData = currentThemeData.titulo || {};
    
    return (
      <SectionCard title="Título" icon={Type}>
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Chamada Inicial
              </label>
              <Input
                type="text"
                placeholder="O seu negócio não precisa de mais"
                value={tituloData.chamada || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleThemeChange('titulo.chamada', e.target.value)
                }
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
              />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-[var(--color-secondary)] mb-2">
                    Palavras Animadas
                  </h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-[var(--color-secondary)]/70">
                      {palavrasCompleteCount} de {palavrasTotalCount} completas
                    </span>
                    <span className="text-sm text-[var(--color-secondary)]/50">•</span>
                    <span className="text-sm text-[var(--color-secondary)]/70">
                      Limite: {currentPlanType === 'pro' ? '10' : '5'} itens
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    type="button"
                    onClick={handleAddPalavraAnimada}
                    variant="primary"
                    className="whitespace-nowrap bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white border-none flex items-center gap-2"
                    disabled={!canAddNewPalavra}
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Palavra
                  </Button>
                  {isPalavrasLimitReached && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Limite do plano atingido
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {localPalavrasAnimadas.map((palavra, index) => (
                  <div 
                    key={`palavra-${index}`}
                    ref={index === localPalavrasAnimadas.length - 1 ? newPalavraRef : undefined}
                    draggable
                    onDragStart={(e) => handlePalavraDragStart(e, index)}
                    onDragOver={(e) => handlePalavraDragOver(e, index)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handlePalavraDragEnd}
                    onDrop={handleDrop}
                    className={`p-6 border border-[var(--color-border)] rounded-lg space-y-6 transition-all duration-200 ${
                      draggingPalavra === index 
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
                          onDragStart={(e) => handlePalavraDragStart(e, index)}
                        >
                          <GripVertical className="w-5 h-5 text-[var(--color-secondary)]/70" />
                        </div>
                        
                        {/* Indicador de posição */}
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-medium text-[var(--color-secondary)]/70">
                            {palavra.ordem || index + 1}
                          </span>
                          <div className="w-px h-4 bg-[var(--color-border)] mt-1"></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-medium text-[var(--color-secondary)]">
                              {palavra.texto || "Palavra sem texto"}
                            </h4>
                            {palavra.texto && palavra.cor ? (
                              <span className="px-2 py-1 text-xs bg-green-900/30 text-green-300 rounded-full">
                                Completa
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs bg-yellow-900/30 text-yellow-300 rounded-full">
                                Incompleta
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                                Texto
                              </label>
                              <Input
                                value={palavra.texto || ""}
                                onChange={(e) => updatePalavraAnimada(index, { texto: e.target.value })}
                                placeholder="Palavra animada"
                                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                                Cor
                              </label>
                              <div className="flex gap-2">
                                <Input
                                  type="text"
                                  value={palavra.cor || "#FFCC00"}
                                  onChange={(e) => updatePalavraAnimada(index, { cor: e.target.value })}
                                  placeholder="#FFCC00"
                                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                                />
                                <ColorPicker
                                  color={palavra.cor || "#FFCC00"}
                                  onChange={(color: string) => updatePalavraAnimada(index, { cor: color })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          onClick={() => removePalavraAnimada(index)}
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Título Principal (HTML permitido)
              </label>
              <textarea
                placeholder="PRECISA<br/>VENDER MAIS"
                value={tituloData.tituloPrincipal || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  handleThemeChange('titulo.tituloPrincipal', e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--color-background-body)] text-[var(--color-secondary)] font-mono"
              />
              <p className="text-xs text-[var(--color-secondary)]/70 mt-1">Use &lt;br/&gt; para quebras de linha</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Separador Responsivo (HTML)
              </label>
              <Input
                type="text"
                placeholder="<br className='hidden sm:block'/>"
                value={tituloData.separador || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleThemeChange('titulo.separador', e.target.value)
                }
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
              />
            </div>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderSubtituloSection = () => {
    const currentThemeData = getCurrentThemeData() as HeadlinePageData;
    
    return (
      <SectionCard title="Subtítulo" icon={Type}>
        <Card className="p-6 bg-[var(--color-background)]">
          <div>
            <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
              Texto do Subtítulo (HTML permitido)
            </label>
            <textarea
              placeholder="A única assessoria com selo Oficial que..."
              value={currentThemeData.subtitulo || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                handleThemeChange('subtitulo', e.target.value)
              }
              rows={4}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--color-background-body)] text-[var(--color-secondary)]"
            />
            <p className="text-xs text-[var(--color-secondary)]/70 mt-1">
              Use tags HTML como &lt;strong&gt; para destaque
            </p>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderBotaoSection = () => {
    const currentThemeData = getCurrentThemeData() as HeadlinePageData;
    const botaoData = currentThemeData.botao || {};
    
    return (
      <SectionCard title="Botão de Ação" icon={Zap}>
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Texto do Botão
              </label>
              <Input
                type="text"
                placeholder="QUERO VENDER AGORA"
                value={botaoData.texto || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleThemeChange('botao.texto', e.target.value)
                }
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Link
              </label>
              <Input
                type="text"
                placeholder="#planos"
                value={botaoData.link || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleThemeChange('botao.link', e.target.value)
                }
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
              />
            </div>

            <div>
              <IconSelector
                value={botaoData.icone || ""}
                onChange={(value) => handleThemeChange('botao.icone', value)}
                label="Ícone do Botão"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Estilo do Botão
              </label>
              <Input
                type="text"
                placeholder="gradiente-amarelo"
                value={botaoData.estilo || "gradiente-amarelo"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleThemeChange('botao.estilo', e.target.value)
                }
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                  Visibilidade
                </label>
                <p className="text-sm text-[var(--color-secondary)]/70">Mostrar ou esconder o botão</p>
              </div>
              <Switch
                checked={botaoData.visivel !== false}
                onCheckedChange={(checked: boolean) => 
                  handleThemeChange('botao.visivel', checked)
                }
              />
            </div>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderAgendaSection = () => {
    const currentThemeData = getCurrentThemeData() as HeadlinePageData;
    const agendaData = currentThemeData.agenda || {};
    
    return (
      <SectionCard title="Agenda" icon={Eye}>
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Status
              </label>
              <select
                value={agendaData.status || "aberta"}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                  handleThemeChange('agenda.status', e.target.value)
                }
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--color-background-body)] text-[var(--color-secondary)]"
              >
                <option value="aberta">Aberta</option>
                <option value="fechada">Fechada</option>
                <option value="em-breve">Em breve</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Mês
              </label>
              <Input
                type="text"
                placeholder="Janeiro"
                value={agendaData.mes || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleThemeChange('agenda.mes', e.target.value)
                }
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Cor do Status
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="#22C55E"
                  value={agendaData.corStatus || "#22C55E"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('agenda.corStatus', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                />
                <ColorPicker
                  color={agendaData.corStatus || "#22C55E"}
                  onChange={(color: string) => handleColorChange('agenda.corStatus', color)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Texto da Agenda
              </label>
              <Input
                type="text"
                placeholder="Agenda de Janeiro aberta"
                value={agendaData.texto || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleThemeChange('agenda.texto', e.target.value)
                }
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)] md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)] mb-2">
                  Visibilidade
                </label>
                <p className="text-sm text-[var(--color-secondary)]/70">Mostrar ou esconder a agenda</p>
              </div>
              <Switch
                checked={agendaData.visivel !== false}
                onCheckedChange={(checked: boolean) => 
                  handleThemeChange('agenda.visivel', checked)
                }
              />
            </div>
          </div>
        </Card>
      </SectionCard>
    );
  };

  const renderConfiguracoesSection = () => {
    const currentThemeData = getCurrentThemeData() as HeadlinePageData;
    const configuracoesData = currentThemeData.configuracoes || {};
    const efeitosData = configuracoesData.efeitos || {};
    
    return (
      <SectionCard title="Configurações" icon={Palette}>
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Intervalo da Animação (ms)
              </label>
              <Input
                type="number"
                min="500"
                step="100"
                value={configuracoesData.intervaloAnimacao?.toString() || "2500"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    handleThemeChange('configuracoes.intervaloAnimacao', value);
                  }
                }}
                className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)]"
              />
              <p className="text-xs text-[var(--color-secondary)]/70 mt-1">Tempo entre animações das palavras (em milissegundos)</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Cor de Fundo
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="#020202"
                  value={configuracoesData.corFundo || "#020202"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('configuracoes.corFundo', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                />
                <ColorPicker
                  color={configuracoesData.corFundo || "#020202"}
                  onChange={(color: string) => handleColorChange('configuracoes.corFundo', color)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Cor de Destaque
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="#FFCC00"
                  value={configuracoesData.corDestaque || "#FFCC00"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleThemeChange('configuracoes.corDestaque', e.target.value)
                  }
                  className="bg-[var(--color-background-body)] border-[var(--color-border)] text-[var(--color-secondary)] font-mono flex-1"
                />
                <ColorPicker
                  color={configuracoesData.corDestaque || "#FFCC00"}
                  onChange={(color: string) => handleColorChange('configuracoes.corDestaque', color)}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
              <label className="block text-sm font-medium text-[var(--color-secondary)]">
                Efeitos Visuais
              </label>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm text-[var(--color-secondary)]">Brilho no Título</label>
                    <p className="text-xs text-[var(--color-secondary)]/70">Drop shadow no texto principal</p>
                  </div>
                  <Switch
                    checked={efeitosData.brilhoTitulo !== ''}
                    onCheckedChange={(checked: boolean) => 
                      handleThemeChange('configuracoes.efeitos.brilhoTitulo', 
                        checked ? "drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]" : ""
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm text-[var(--color-secondary)]">Spotlight</label>
                    <p className="text-xs text-[var(--color-secondary)]/70">Efeito de foco no conteúdo</p>
                  </div>
                  <Switch
                    checked={efeitosData.spotlight || false}
                    onCheckedChange={(checked: boolean) => 
                      handleThemeChange('configuracoes.efeitos.spotlight', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm text-[var(--color-secondary)]">Grid Background</label>
                    <p className="text-xs text-[var(--color-secondary)]/70">Fundo com padrão de grid</p>
                  </div>
                  <Switch
                    checked={efeitosData.grid || false}
                    onCheckedChange={(checked: boolean) => 
                      handleThemeChange('configuracoes.efeitos.grid', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm text-[var(--color-secondary)]">Sombra Inferior</label>
                    <p className="text-xs text-[var(--color-secondary)]/70">Degradê na parte inferior</p>
                  </div>
                  <Switch
                    checked={efeitosData.sombraInferior || false}
                    onCheckedChange={(checked: boolean) => 
                      handleThemeChange('configuracoes.efeitos.sombraInferior', checked)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </SectionCard>
    );
  };

  // Renderização condicional baseada no tema ativo
  const renderContent = () => {
    if (activeTheme === 'cursos') {
      return (
        <div className="space-y-6">
          {renderCursoThemeSection()}
          {renderCursoHeadlineSection()}
          {renderCursoSubheadlineSection()}
          {renderCursoCtaSection()}
          {renderCursoSocialProofSection()}
          {renderCursoCardSection()}
        </div>
      );
    } else {
      // Renderização para as outras abas (home, ecommerce, marketing, sobre)
      return (
        <div className="space-y-6">
          {renderBadgeSection()}
          {renderTituloSection()}
          {renderSubtituloSection()}
          {renderBotaoSection()}
          {renderAgendaSection()}
          {renderConfiguracoesSection()}
        </div>
      );
    }
  };

  if (loading && !exists) {
    return (
      <ManageLayout
        headerIcon={Layers}
        title="Headline - Seção Hero"
        description="Configure o conteúdo principal da seção hero para cada página"
        exists={!!exists}
        itemName="Headline"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando configurações...</p>
          </div>
        </div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      headerIcon={Layers}
      title="Headline - Seção Hero"
      description="Configure o conteúdo principal da seção hero para cada página"
      exists={!!exists}
      itemName="Headline"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-32">
        {/* Tabs de Temas */}
        <Card className="p-6 bg-[var(--color-background)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-secondary)]">Selecione o Tema</h3>
            <p className="text-sm text-[var(--color-secondary)]/70">
              Configure diferentes versões para cada tipo de página
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <ThemeTab 
              themeKey="home" 
              label="Home" 
              isActive={activeTheme === "home"} 
              onClick={setActiveTheme}
              icon={<Home className="w-4 h-4" />}
            />
            <ThemeTab 
              themeKey="ecommerce" 
              label="E-commerce" 
              isActive={activeTheme === "ecommerce"} 
              onClick={setActiveTheme}
              icon={<ShoppingCart className="w-4 h-4" />}
            />
            <ThemeTab 
              themeKey="marketing" 
              label="Marketing" 
              isActive={activeTheme === "marketing"} 
              onClick={setActiveTheme}
              icon={<Megaphone className="w-4 h-4" />}
            />
            <ThemeTab 
              themeKey="sobre" 
              label="Sobre" 
              isActive={activeTheme === "sobre"} 
              onClick={setActiveTheme}
              icon={<Info className="w-4 h-4" />}
            />
            <ThemeTab 
              themeKey="cursos" 
              label="Cursos" 
              isActive={activeTheme === "cursos"} 
              onClick={setActiveTheme}
              icon={<GraduationCap className="w-4 h-4" />}
            />
          </div>
          
          {/* Indicador visual da seção ativa */}
          <div className="mt-4 p-3 rounded-lg bg-[var(--color-background-body)] border border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeTheme === "home" && <Home className="w-5 h-5 text-blue-500" />}
                {activeTheme === "ecommerce" && <ShoppingCart className="w-5 h-5 text-green-500" />}
                {activeTheme === "marketing" && <Megaphone className="w-5 h-5 text-purple-500" />}
                {activeTheme === "sobre" && <Info className="w-5 h-5 text-orange-500" />}
                {activeTheme === "cursos" && <GraduationCap className="w-5 h-5 text-amber-500" />}
                <span className="font-medium text-[var(--color-secondary)]">
                  Configurando: {activeTheme.charAt(0).toUpperCase() + activeTheme.slice(1)}
                </span>
              </div>
              <div className="text-xs text-[var(--color-secondary)]/70">
                {activeTheme === "cursos" ? "Foco em infoprodutos premium" : "Tema padrão"}
              </div>
            </div>
          </div>
        </Card>

        {/* Conteúdo baseado no tema ativo */}
        {renderContent()}

        <FixedActionBar
          onDeleteAll={openDeleteAllModal}
          onSubmit={handleSubmit}
          isAddDisabled={false}
          isSaving={loading}
          exists={!!exists}
          completeCount={completion.completed}
          totalCount={completion.total}
          itemName="Headline"
          icon={Layers}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={5}
        itemName="Configuração do Headline"
      />

      <FeedbackMessages success={success} errorMsg={errorMsg} />
    </ManageLayout>
  );
}