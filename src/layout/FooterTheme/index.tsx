/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ManageLayout } from "@/components/Manage/ManageLayout";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { ImageUpload } from "@/components/ImageUpload";
import { Palette, Layout, Settings, Link as LinkIcon, Mail, Phone, MapPin, Building, Globe, Instagram, Linkedin, Youtube, FileText } from "lucide-react";
import { FeedbackMessages } from "@/components/Manage/FeedbackMessages";
import { FixedActionBar } from "@/components/Manage/FixedActionBar";
import { DeleteConfirmationModal } from "@/components/Manage/DeleteConfirmationModal";
import { SectionHeader } from "@/components/SectionHeader";
import { ThemePropertyInput } from "@/components/ThemePropertyInput";
import { extractHexFromTailwind, hexToTailwindClass } from "@/lib/colorUtils";
import Loading from "@/components/Loading";
import { useJsonManagement } from "@/hooks/useJsonManagement";

// Tipos baseados no novo JSON
interface SocialLinks {
  instagram: string;
  linkedin: string;
  youtube: string;
}

interface NavigationItem {
  name: string;
  href: string;
}

interface StatsItem {
  val: string;
  label: string;
}

interface PageContent {
  badgeImage: string;
  badgeTitle: string;
  badgeDesc: string;
  stats1: StatsItem;
  stats2: StatsItem;
  columnTitle: string;
  links: string[];
  email: string;
  desc: string;
}

interface ThemeVariant {
  primary: string;
  hoverText: string;
  decoration: string;
  bgHover: string;
  borderHover: string;
  glowGradient: string;
  glowAmbient: string;
  iconBg: string;
  iconHoverText: string;
  iconHoverBg: string;
  topBorder: string;
}

type FooterData = {
  id?: string;
  general: {
    logo: string;
    poweredByLogo: string;
    cnpj: string;
    address: string;
    phone: string;
    whatsappLink: string;
    socials: SocialLinks;
  };
  navigation: NavigationItem[];
  content: {
    ecommerce: PageContent;
    marketing: PageContent;
    sobre: PageContent;
    cursos: PageContent;
  };
  variants: {
    ecommerce: ThemeVariant;
    marketing: ThemeVariant;
    sobre: ThemeVariant;
    cursos: ThemeVariant;
  };
};

const defaultFooterData: FooterData = {
  general: {
    logo: "",
    poweredByLogo: "",
    cnpj: "",
    address: "",
    phone: "",
    whatsappLink: "",
    socials: {
      instagram: "#",
      linkedin: "#",
      youtube: "#"
    }
  },
  navigation: [
    { name: "Home", href: "/" },
  ],
  content: {
    ecommerce: {
      badgeImage: "",
      badgeTitle: "",
      badgeDesc: "",
      stats1: { val: "", label: "" },
      stats2: { val: "", label: "" },
      columnTitle: "",
      links: ["Gestão Full Commerce", "Consultoria Oficial", "Ads & Performance", "Design & Branding"],
      email: "",
      desc: ""
    },
    marketing: {
      badgeImage: "",
      badgeTitle: "",
      badgeDesc: "",
      stats1: { val: "", label: "" },
      stats2: { val: "", label: "" },
      columnTitle: "",
      links: ["Gestão Full Commerce", "Consultoria Oficial", "Ads & Performance", "Design & Branding"],
      email: "",
      desc: ""
    },
    sobre: {
      badgeImage: "",
      badgeTitle: "",
      badgeDesc: "",
      stats1: { val: "", label: "" },
      stats2: { val: "", label: "" },
      columnTitle: "",
      links: ["Gestão Full Commerce", "Consultoria Oficial", "Ads & Performance", "Design & Branding"],
      email: "",
      desc: ""
    },
    cursos: {
      badgeImage: "",
      badgeTitle: "",
      badgeDesc: "",
      stats1: { val: "", label: "" },
      stats2: { val: "", label: "" },
      columnTitle: "",
      links: ["Gestão Full Commerce", "Consultoria Oficial", "Ads & Performance", "Design & Branding"],
      email: "",
      desc: ""
    }
  },
  variants: {
    ecommerce: {
      primary: "text-[#FFCC00]",
      hoverText: "hover:text-[#FFCC00]",
      decoration: "decoration-[#FFCC00]",
      bgHover: "hover:bg-[#FFCC00]",
      borderHover: "hover:border-[#FFCC00]/30",
      glowGradient: "from-[#FFCC00]/0 via-[#FFCC00]/5 to-[#FFCC00]/0",
      glowAmbient: "bg-[#FFCC00]/5",
      iconBg: "text-[#FFCC00]",
      iconHoverText: "group-hover:text-black",
      iconHoverBg: "group-hover:bg-[#FFCC00]",
      topBorder: "border-white/10"
    },
    marketing: {
      primary: "text-[#E31B63]",
      hoverText: "hover:text-[#E31B63]",
      decoration: "decoration-[#E31B63]",
      bgHover: "hover:bg-[#E31B63]",
      borderHover: "hover:border-[#E31B63]/30",
      glowGradient: "from-[#E31B63]/0 via-[#E31B63]/10 to-[#E31B63]/0",
      glowAmbient: "bg-[#E31B63]/10",
      iconBg: "text-[#E31B63]",
      iconHoverText: "group-hover:text-white",
      iconHoverBg: "group-hover:bg-[#E31B63]",
      topBorder: "border-rose-900/20"
    },
    sobre: {
      primary: "text-[#0071E3]",
      hoverText: "hover:text-[#0071E3]",
      decoration: "decoration-[#0071E3]",
      bgHover: "hover:bg-[#0071E3]",
      borderHover: "hover:border-[#0071E3]/30",
      glowGradient: "from-[#0071E3]/0 via-[#0071E3]/10 to-[#0071E3]/0",
      glowAmbient: "bg-[#0071E3]/10",
      iconBg: "text-[#0071E3]",
      iconHoverText: "group-hover:text-white",
      iconHoverBg: "group-hover:bg-[#0071E3]",
      topBorder: "border-blue-900/20"
    },
    cursos: {
      primary: "text-[#FFD700]",
      hoverText: "hover:text-[#FFD700]",
      decoration: "decoration-[#FFD700]",
      bgHover: "hover:bg-[#FFD700]",
      borderHover: "hover:border-[#FFD700]/30",
      glowGradient: "from-[#FFD700]/0 via-[#FFD700]/10 to-[#FFD700]/0",
      glowAmbient: "bg-[#FFD700]/5",
      iconBg: "text-[#FFD700]",
      iconHoverText: "group-hover:text-black",
      iconHoverBg: "group-hover:bg-[#FFD700]",
      topBorder: "border-[#FFD700]/20"
    }
  }
};

// Função para mesclar dados com padrão
const mergeWithDefaults = (apiData: any, defaultData: FooterData): FooterData => {
  if (!apiData) return defaultData;
  
  return {
    id: apiData.id,
    general: {
      logo: apiData.general?.logo || defaultData.general.logo,
      poweredByLogo: apiData.general?.poweredByLogo || defaultData.general.poweredByLogo,
      cnpj: apiData.general?.cnpj || defaultData.general.cnpj,
      address: apiData.general?.address || defaultData.general.address,
      phone: apiData.general?.phone || defaultData.general.phone,
      whatsappLink: apiData.general?.whatsappLink || defaultData.general.whatsappLink,
      socials: {
        instagram: apiData.general?.socials?.instagram || defaultData.general.socials.instagram,
        linkedin: apiData.general?.socials?.linkedin || defaultData.general.socials.linkedin,
        youtube: apiData.general?.socials?.youtube || defaultData.general.socials.youtube,
      }
    },
    navigation: apiData.navigation || defaultData.navigation,
    content: {
      ecommerce: {
        badgeImage: apiData.content?.ecommerce?.badgeImage || defaultData.content.ecommerce.badgeImage,
        badgeTitle: apiData.content?.ecommerce?.badgeTitle || defaultData.content.ecommerce.badgeTitle,
        badgeDesc: apiData.content?.ecommerce?.badgeDesc || defaultData.content.ecommerce.badgeDesc,
        stats1: {
          val: apiData.content?.ecommerce?.stats1?.val || defaultData.content.ecommerce.stats1.val,
          label: apiData.content?.ecommerce?.stats1?.label || defaultData.content.ecommerce.stats1.label,
        },
        stats2: {
          val: apiData.content?.ecommerce?.stats2?.val || defaultData.content.ecommerce.stats2.val,
          label: apiData.content?.ecommerce?.stats2?.label || defaultData.content.ecommerce.stats2.label,
        },
        columnTitle: apiData.content?.ecommerce?.columnTitle || defaultData.content.ecommerce.columnTitle,
        links: apiData.content?.ecommerce?.links || defaultData.content.ecommerce.links,
        email: apiData.content?.ecommerce?.email || defaultData.content.ecommerce.email,
        desc: apiData.content?.ecommerce?.desc || defaultData.content.ecommerce.desc,
      },
      marketing: {
        badgeImage: apiData.content?.marketing?.badgeImage || defaultData.content.marketing.badgeImage,
        badgeTitle: apiData.content?.marketing?.badgeTitle || defaultData.content.marketing.badgeTitle,
        badgeDesc: apiData.content?.marketing?.badgeDesc || defaultData.content.marketing.badgeDesc,
        stats1: {
          val: apiData.content?.marketing?.stats1?.val || defaultData.content.marketing.stats1.val,
          label: apiData.content?.marketing?.stats1?.label || defaultData.content.marketing.stats1.label,
        },
        stats2: {
          val: apiData.content?.marketing?.stats2?.val || defaultData.content.marketing.stats2.val,
          label: apiData.content?.marketing?.stats2?.label || defaultData.content.marketing.stats2.label,
        },
        columnTitle: apiData.content?.marketing?.columnTitle || defaultData.content.marketing.columnTitle,
        links: apiData.content?.marketing?.links || defaultData.content.marketing.links,
        email: apiData.content?.marketing?.email || defaultData.content.marketing.email,
        desc: apiData.content?.marketing?.desc || defaultData.content.marketing.desc,
      },
      sobre: {
        badgeImage: apiData.content?.sobre?.badgeImage || defaultData.content.sobre.badgeImage,
        badgeTitle: apiData.content?.sobre?.badgeTitle || defaultData.content.sobre.badgeTitle,
        badgeDesc: apiData.content?.sobre?.badgeDesc || defaultData.content.sobre.badgeDesc,
        stats1: {
          val: apiData.content?.sobre?.stats1?.val || defaultData.content.sobre.stats1.val,
          label: apiData.content?.sobre?.stats1?.label || defaultData.content.sobre.stats1.label,
        },
        stats2: {
          val: apiData.content?.sobre?.stats2?.val || defaultData.content.sobre.stats2.val,
          label: apiData.content?.sobre?.stats2?.label || defaultData.content.sobre.stats2.label,
        },
        columnTitle: apiData.content?.sobre?.columnTitle || defaultData.content.sobre.columnTitle,
        links: apiData.content?.sobre?.links || defaultData.content.sobre.links,
        email: apiData.content?.sobre?.email || defaultData.content.sobre.email,
        desc: apiData.content?.sobre?.desc || defaultData.content.sobre.desc,
      },
      cursos: {
        badgeImage: apiData.content?.cursos?.badgeImage || defaultData.content.cursos.badgeImage,
        badgeTitle: apiData.content?.cursos?.badgeTitle || defaultData.content.cursos.badgeTitle,
        badgeDesc: apiData.content?.cursos?.badgeDesc || defaultData.content.cursos.badgeDesc,
        stats1: {
          val: apiData.content?.cursos?.stats1?.val || defaultData.content.cursos.stats1.val,
          label: apiData.content?.cursos?.stats1?.label || defaultData.content.cursos.stats1.label,
        },
        stats2: {
          val: apiData.content?.cursos?.stats2?.val || defaultData.content.cursos.stats2.val,
          label: apiData.content?.cursos?.stats2?.label || defaultData.content.cursos.stats2.label,
        },
        columnTitle: apiData.content?.cursos?.columnTitle || defaultData.content.cursos.columnTitle,
        links: apiData.content?.cursos?.links || defaultData.content.cursos.links,
        email: apiData.content?.cursos?.email || defaultData.content.cursos.email,
        desc: apiData.content?.cursos?.desc || defaultData.content.cursos.desc,
      }
    },
    variants: {
      ecommerce: {
        primary: apiData.variants?.ecommerce?.primary || defaultData.variants.ecommerce.primary,
        hoverText: apiData.variants?.ecommerce?.hoverText || defaultData.variants.ecommerce.hoverText,
        decoration: apiData.variants?.ecommerce?.decoration || defaultData.variants.ecommerce.decoration,
        bgHover: apiData.variants?.ecommerce?.bgHover || defaultData.variants.ecommerce.bgHover,
        borderHover: apiData.variants?.ecommerce?.borderHover || defaultData.variants.ecommerce.borderHover,
        glowGradient: apiData.variants?.ecommerce?.glowGradient || defaultData.variants.ecommerce.glowGradient,
        glowAmbient: apiData.variants?.ecommerce?.glowAmbient || defaultData.variants.ecommerce.glowAmbient,
        iconBg: apiData.variants?.ecommerce?.iconBg || defaultData.variants.ecommerce.iconBg,
        iconHoverText: apiData.variants?.ecommerce?.iconHoverText || defaultData.variants.ecommerce.iconHoverText,
        iconHoverBg: apiData.variants?.ecommerce?.iconHoverBg || defaultData.variants.ecommerce.iconHoverBg,
        topBorder: apiData.variants?.ecommerce?.topBorder || defaultData.variants.ecommerce.topBorder,
      },
      marketing: {
        primary: apiData.variants?.marketing?.primary || defaultData.variants.marketing.primary,
        hoverText: apiData.variants?.marketing?.hoverText || defaultData.variants.marketing.hoverText,
        decoration: apiData.variants?.marketing?.decoration || defaultData.variants.marketing.decoration,
        bgHover: apiData.variants?.marketing?.bgHover || defaultData.variants.marketing.bgHover,
        borderHover: apiData.variants?.marketing?.borderHover || defaultData.variants.marketing.borderHover,
        glowGradient: apiData.variants?.marketing?.glowGradient || defaultData.variants.marketing.glowGradient,
        glowAmbient: apiData.variants?.marketing?.glowAmbient || defaultData.variants.marketing.glowAmbient,
        iconBg: apiData.variants?.marketing?.iconBg || defaultData.variants.marketing.iconBg,
        iconHoverText: apiData.variants?.marketing?.iconHoverText || defaultData.variants.marketing.iconHoverText,
        iconHoverBg: apiData.variants?.marketing?.iconHoverBg || defaultData.variants.marketing.iconHoverBg,
        topBorder: apiData.variants?.marketing?.topBorder || defaultData.variants.marketing.topBorder,
      },
      sobre: {
        primary: apiData.variants?.sobre?.primary || defaultData.variants.sobre.primary,
        hoverText: apiData.variants?.sobre?.hoverText || defaultData.variants.sobre.hoverText,
        decoration: apiData.variants?.sobre?.decoration || defaultData.variants.sobre.decoration,
        bgHover: apiData.variants?.sobre?.bgHover || defaultData.variants.sobre.bgHover,
        borderHover: apiData.variants?.sobre?.borderHover || defaultData.variants.sobre.borderHover,
        glowGradient: apiData.variants?.sobre?.glowGradient || defaultData.variants.sobre.glowGradient,
        glowAmbient: apiData.variants?.sobre?.glowAmbient || defaultData.variants.sobre.glowAmbient,
        iconBg: apiData.variants?.sobre?.iconBg || defaultData.variants.sobre.iconBg,
        iconHoverText: apiData.variants?.sobre?.iconHoverText || defaultData.variants.sobre.iconHoverText,
        iconHoverBg: apiData.variants?.sobre?.iconHoverBg || defaultData.variants.sobre.iconHoverBg,
        topBorder: apiData.variants?.sobre?.topBorder || defaultData.variants.sobre.topBorder,
      },
      cursos: {
        primary: apiData.variants?.cursos?.primary || defaultData.variants.cursos.primary,
        hoverText: apiData.variants?.cursos?.hoverText || defaultData.variants.cursos.hoverText,
        decoration: apiData.variants?.cursos?.decoration || defaultData.variants.cursos.decoration,
        bgHover: apiData.variants?.cursos?.bgHover || defaultData.variants.cursos.bgHover,
        borderHover: apiData.variants?.cursos?.borderHover || defaultData.variants.cursos.borderHover,
        glowGradient: apiData.variants?.cursos?.glowGradient || defaultData.variants.cursos.glowGradient,
        glowAmbient: apiData.variants?.cursos?.glowAmbient || defaultData.variants.cursos.glowAmbient,
        iconBg: apiData.variants?.cursos?.iconBg || defaultData.variants.cursos.iconBg,
        iconHoverText: apiData.variants?.cursos?.iconHoverText || defaultData.variants.cursos.iconHoverText,
        iconHoverBg: apiData.variants?.cursos?.iconHoverBg || defaultData.variants.cursos.iconHoverBg,
        topBorder: apiData.variants?.cursos?.topBorder || defaultData.variants.cursos.topBorder,
      }
    }
  };
};

const pageKeys = ['ecommerce', 'marketing', 'sobre', 'cursos'] as const;
type PageKey = typeof pageKeys[number];

export const FooterPageComponent: React.FC = () => {
  const {
    data: footerData,
    setData: setFooterData,
    exists,
    loading,
    success,
    errorMsg,
    deleteModal,
    fileStates,
    updateNested,
    setFileState,
    save,
    openDeleteAllModal,
    closeDeleteModal,
    confirmDelete,
  } = useJsonManagement<FooterData>({
    apiPath: "/api/tegbe-institucional/json/footer",
    defaultData: defaultFooterData,
    mergeFunction: mergeWithDefaults,
  });

  const [expandedSections, setExpandedSections] = useState({
    general: true,
    navigation: false,
    content: false,
    variants: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const completeCount = 17 + footerData.navigation.length * 2 + 8;
  const totalCount = 17 + 10 * 2 + 8;
  const canAddNewItem = true;
  const isLimitReached = false;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await save();
    } catch (err) {
      // Erro já tratado no hook
    }
  };

  const handleNavChange = (index: number, field: 'name' | 'href', value: string) => {
    const newNav = [...footerData.navigation];
    newNav[index] = { ...newNav[index], [field]: value };
    updateNested('navigation', newNav);
  };

  const handleAddNav = () => {
    const newNav = [...footerData.navigation, { name: "", href: "" }];
    updateNested('navigation', newNav);
  };

  const handleRemoveNav = (index: number) => {
    const newNav = footerData.navigation.filter((_, i) => i !== index);
    updateNested('navigation', newNav);
  };

  const handleContentLinksChange = (index: number, value: string) => {
    const newLinks = [...footerData.content.ecommerce.links];
    newLinks[index] = value;
    
    pageKeys.forEach((page) => {
      updateNested(`content.${page}.links`, newLinks);
    });
  };

  const handleAddContentLink = () => {
    const newLinks = [...footerData.content.ecommerce.links, ""];
    
    // Replica automaticamente para todas as páginas
    pageKeys.forEach((page) => {
      updateNested(`content.${page}.links`, newLinks);
    });
  };

  const handleRemoveContentLink = (index: number) => {
    const newLinks = footerData.content.ecommerce.links.filter((_, i) => i !== index);
    
    // Replica automaticamente para todas as páginas
    pageKeys.forEach((page) => {
      updateNested(`content.${page}.links`, newLinks);
    });
  };

  // Funções para replicar conteúdo automaticamente para todas as páginas
  const updateContentForAllPages = (path: string, value: any) => {
    pageKeys.forEach((page) => {
      updateNested(`content.${page}.${path}`, value);
    });
  };

  const updateVariantForAllPages = (property: keyof ThemeVariant, hexColor: string) => {
    const tailwindClass = hexToTailwindClass(property as any, hexColor);
    pageKeys.forEach((page) => {
      updateNested(`variants.${page}.${property}`, tailwindClass);
    });
  };

  // Configuração de upload de imagens (aplica automaticamente a todas as páginas)
  const handleBadgeImageUpload = (file: File | null) => {
    // Aplica automaticamente a todas as páginas
    pageKeys.forEach((page) => {
      setFileState(`content.${page}.badgeImage`, file);
    });
  };

  if (loading && !exists) {
    return (
      <Loading layout={Layout} exists={!!exists}></Loading>
    );
  }

  return (
    <ManageLayout
      headerIcon={Layout}
      title="Personalização do Footer"
      description="Configure o footer do site incluindo informações gerais, navegação e conteúdo. Todas as configurações serão aplicadas automaticamente a todas as páginas (E-commerce, Marketing, Sobre, Cursos)."
      exists={!!exists}
      itemName="Footer"
    >
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6 pb-32">
        <div className="space-y-4">
          <SectionHeader
            title="Configurações Gerais"
            section="general"
            icon={Settings}
            isExpanded={expandedSections.general}
            onToggle={() => toggleSection("general")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.general ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Logos
                  </h3>
                  
                  <ImageUpload
                    label="Logo do Footer"
                    description="Logo principal no rodapé"
                    currentImage={footerData.general.logo}
                    selectedFile={fileStates['general.logo'] || null}
                    onFileChange={(file) => setFileState('general.logo', file)}
                    aspectRatio="aspect-[4/1]"
                    previewWidth={200}
                    previewHeight={200}
                  />

                  <ImageUpload
                    label="Logo Powered By"
                    description="Logo da empresa parceira (ex: Mavellium)"
                    currentImage={footerData.general.poweredByLogo}
                    selectedFile={fileStates['general.poweredByLogo'] || null}
                    onFileChange={(file) => setFileState('general.poweredByLogo', file)}
                    aspectRatio="aspect-[3/1]"
                    previewWidth={200}
                    previewHeight={200}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Dados da Empresa
                  </h3>
                  
                  <Input
                    label="CNPJ"
                    value={footerData.general.cnpj}
                    onChange={(e) => updateNested('general.cnpj', e.target.value)}
                    placeholder="Ex: 48.802.866/0001-42"
                  />

                  <TextArea
                    label="Endereço"
                    value={footerData.general.address}
                    onChange={(e) => updateNested('general.address', e.target.value)}
                    placeholder="Ex: R. Santos Dumont, 133\nGarça - SP\nOperação Global"
                    rows={3}
                  />

                  <Input
                    label="Telefone"
                    value={footerData.general.phone}
                    onChange={(e) => updateNested('general.phone', e.target.value)}
                    placeholder="Ex: (14) 99177-9502"
                  />

                  <Input
                    label="Link do WhatsApp"
                    value={footerData.general.whatsappLink}
                    onChange={(e) => updateNested('general.whatsappLink', e.target.value)}
                    placeholder="Ex: https://api.whatsapp.com/send?phone=5514991779502"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Redes Sociais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <Input
                        label="Instagram"
                        value={footerData.general.socials.instagram}
                        onChange={(e) => updateNested('general.socials.instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-blue-700" />
                      <Input
                        label="LinkedIn"
                        value={footerData.general.socials.linkedin}
                        onChange={(e) => updateNested('general.socials.linkedin', e.target.value)}
                        placeholder="https://linkedin.com/..."
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <Input
                        label="YouTube"
                        value={footerData.general.socials.youtube}
                        onChange={(e) => updateNested('general.socials.youtube', e.target.value)}
                        placeholder="https://youtube.com/..."
                      />
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
            title="Links de Navegação"
            section="navigation"
            icon={LinkIcon}
            isExpanded={expandedSections.navigation}
            onToggle={() => toggleSection("navigation")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.navigation ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6">
              <div className="space-y-6">
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-zinc-200 mb-2">
                    Menu de Navegação do Footer
                  </h4>
                  <p className="text-sm text-zinc-400">
                    Configure os links do menu de navegação no rodapé.
                  </p>
                </div>

                <div className="space-y-4">
                  {footerData.navigation.map((nav, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-zinc-900 rounded-lg">
                      <div className="flex-1 space-y-3">
                        <Input
                          label="Nome do Link"
                          value={nav.name}
                          onChange={(e) => handleNavChange(index, 'name', e.target.value)}
                          placeholder="Ex: Home"
                        />
                        <Input
                          label="URL do Link"
                          value={nav.href}
                          onChange={(e) => handleNavChange(index, 'href', e.target.value)}
                          placeholder="Ex: /"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNav(index)}
                        className="mt-6 px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors h-fit"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleAddNav}
                    className="w-full py-3 border-2 border-dashed border-zinc-700 rounded-lg text-zinc-400 hover:border-zinc-600 transition-colors"
                  >
                    + Adicionar Novo Link de Navegação
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Conteúdo do Footer"
            section="content"
            icon={FileText}
            isExpanded={expandedSections.content}
            onToggle={() => toggleSection("content")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.content ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6">
              <div className="space-y-8">
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-zinc-200 mb-2">
                    Configuração do Conteúdo
                  </h4>
                  <p className="text-sm text-zinc-400">
                    Todas as configurações serão aplicadas automaticamente a todas as páginas (E-commerce, Marketing, Sobre, Cursos).
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Badge e Estatísticas
                  </h3>
                  
                  <ImageUpload
                    label="Imagem do Badge"
                    description="Selo/logo que aparece no footer (aplica a todas as páginas)"
                    currentImage={footerData.content.ecommerce.badgeImage}
                    selectedFile={fileStates['content.ecommerce.badgeImage'] || null}
                    onFileChange={handleBadgeImageUpload}
                    aspectRatio="aspect-square"
                    previewWidth={100}
                    previewHeight={100}
                  />

                  <Input
                    label="Título do Badge"
                    value={footerData.content.ecommerce.badgeTitle}
                    onChange={(e) => updateContentForAllPages('badgeTitle', e.target.value)}
                    placeholder="Ex: Consultoria Certificada"
                  />

                  <TextArea
                    label="Descrição do Badge"
                    value={footerData.content.ecommerce.badgeDesc}
                    onChange={(e) => updateContentForAllPages('badgeDesc', e.target.value)}
                    placeholder="Ex: Selo oficial de qualidade e segurança Mercado Livre."
                    rows={3}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-zinc-300">
                        Estatística 1
                      </label>
                      <Input
                        label="Valor"
                        value={footerData.content.ecommerce.stats1.val}
                        onChange={(e) => updateContentForAllPages('stats1.val', e.target.value)}
                        placeholder="Ex: +100M"
                      />
                      <Input
                        label="Rótulo"
                        value={footerData.content.ecommerce.stats1.label}
                        onChange={(e) => updateContentForAllPages('stats1.label', e.target.value)}
                        placeholder="Ex: Gerenciados"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-zinc-300">
                        Estatística 2
                      </label>
                      <Input
                        label="Valor"
                        value={footerData.content.ecommerce.stats2.val}
                        onChange={(e) => updateContentForAllPages('stats2.val', e.target.value)}
                        placeholder="Ex: Top 1%"
                      />
                      <Input
                        label="Rótulo"
                        value={footerData.content.ecommerce.stats2.label}
                        onChange={(e) => updateContentForAllPages('stats2.label', e.target.value)}
                        placeholder="Ex: Performance"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Coluna de Links
                  </h3>
                  
                  <Input
                    label="Título da Coluna"
                    value={footerData.content.ecommerce.columnTitle}
                    onChange={(e) => updateContentForAllPages('columnTitle', e.target.value)}
                    placeholder="Ex: Expertise"
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-zinc-300">
                        Links da Coluna (aplicam a todas as páginas)
                      </label>
                      <button
                        type="button"
                        onClick={handleAddContentLink}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Adicionar Link
                      </button>
                    </div>
                    
                    {footerData.content.ecommerce.links.map((link, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <LinkIcon className="w-4 h-4 text-zinc-500" />
                        <Input
                          value={link}
                          onChange={(e) => handleContentLinksChange(index, e.target.value)}
                          placeholder="Ex: Gestão Full Commerce"
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveContentLink(index)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contato e Descrição
                  </h3>
                  
                  <Input
                    label="Email de Contato"
                    type="email"
                    value={footerData.content.ecommerce.email}
                    onChange={(e) => updateContentForAllPages('email', e.target.value)}
                    placeholder="Ex: contato@tegbe.com.br"
                  />

                  <TextArea
                    label="Descrição da Empresa"
                    value={footerData.content.ecommerce.desc}
                    onChange={(e) => updateContentForAllPages('desc', e.target.value)}
                    placeholder="Descrição da empresa que aparece no footer (aplica a todas as páginas)..."
                    rows={4}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-4">
          <SectionHeader
            title="Tema Visual do Footer"
            section="variants"
            icon={Palette}
            isExpanded={expandedSections.variants}
            onToggle={() => toggleSection("variants")}
          />

          <motion.div
            initial={false}
            animate={{ height: expandedSections.variants ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6">
              <div className="space-y-6">
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-zinc-200 mb-2">
                    Configuração das Cores
                  </h4>
                  <p className="text-sm text-zinc-400">
                    As cores configuradas aqui serão aplicadas automaticamente a todas as páginas (E-commerce, Marketing, Sobre, Cursos).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ThemePropertyInput
                    property="primary"
                    label="Cor Primária (Texto)"
                    description="Cor primária para textos e elementos"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.primary)}
                    tailwindClass={footerData.variants.ecommerce.primary}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="hoverText"
                    label="Texto no Hover"
                    description="Cor do texto quando o usuário passa o mouse"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.hoverText)}
                    tailwindClass={footerData.variants.ecommerce.hoverText}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="decoration"
                    label="Decoração"
                    description="Cor para sublinhados e decorações"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.decoration)}
                    tailwindClass={footerData.variants.ecommerce.decoration}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="bgHover"
                    label="Background no Hover"
                    description="Cor de fundo quando o usuário passa o mouse"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.bgHover)}
                    tailwindClass={footerData.variants.ecommerce.bgHover}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="borderHover"
                    label="Borda no Hover"
                    description="Cor da borda quando o usuário passa o mouse"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.borderHover)}
                    tailwindClass={footerData.variants.ecommerce.borderHover}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="glowGradient"
                    label="Gradiente Glow"
                    description="Gradiente para efeitos de brilho"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.glowGradient)}
                    tailwindClass={footerData.variants.ecommerce.glowGradient}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="glowAmbient"
                    label="Brilho Ambiental"
                    description="Cor do brilho ambiental de fundo"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.glowAmbient)}
                    tailwindClass={footerData.variants.ecommerce.glowAmbient}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="iconBg"
                    label="Ícone (Cor)"
                    description="Cor para ícones"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.iconBg)}
                    tailwindClass={footerData.variants.ecommerce.iconBg}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="iconHoverText"
                    label="Texto no Hover do Ícone"
                    description="Cor do texto quando o usuário passa o mouse no ícone"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.iconHoverText)}
                    tailwindClass={footerData.variants.ecommerce.iconHoverText}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="iconHoverBg"
                    label="Background no Hover do Ícone"
                    description="Cor de fundo quando o usuário passa o mouse no ícone"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.iconHoverBg)}
                    tailwindClass={footerData.variants.ecommerce.iconHoverBg}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />

                  <ThemePropertyInput
                    property="topBorder"
                    label="Borda Superior"
                    description="Cor da borda superior"
                    currentHex={extractHexFromTailwind(footerData.variants.ecommerce.topBorder)}
                    tailwindClass={footerData.variants.ecommerce.topBorder}
                    onThemeChange={(prop, hex) => updateVariantForAllPages(prop as keyof ThemeVariant, hex)}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <FixedActionBar
          onDeleteAll={openDeleteAllModal}
          onSubmit={handleSubmit}
          isAddDisabled={!canAddNewItem || isLimitReached}
          isSaving={loading}
          exists={!!exists}
          completeCount={completeCount}
          totalCount={totalCount}
          itemName="Footer"
          icon={Layout}
        />
      </form>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        type={deleteModal.type}
        itemTitle={deleteModal.title}
        totalItems={1}
        itemName="Footer"
      />

      <FeedbackMessages success={success} errorMsg={errorMsg} />
    </ManageLayout>
  );
};