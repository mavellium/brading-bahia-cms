/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Trash2, Phone, Target, MessageCircle, LinkIcon, ChevronUp, ChevronDown, ShoppingBag } from "lucide-react";
import IconSelector from "@/components/IconSelector";
import { ColorPropertyInput } from "../ColorPropertyInput";
import { ImageUpload } from "../ImageUpload";
import { FeaturesEditor } from "../FeaturesEditor";

interface Feature {
  text: string;
  icon: string;
}

interface CTA {
  text: string;
  action: "whatsapp" | "link" | "email" | "phone";
  value: string;
}

interface CardData {
  id: number;
  title: string;
  highlightedText: string;
  description: string;
  icon: string;
  iconBgColor: string;
  backgroundColor: string;
  primaryColor: string;
  backgroundImage: string;
  features: Feature[];
  cta: CTA;
  hasPhoneImage?: boolean;
  phoneImage?: string;
  phoneImageSize?: {
    width: number;
    height: number;
  };
}

interface CardEditorProps {
  card: CardData;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (field: string, value: any) => void;
  onRemove: () => void;
  selectedFiles: {
    backgroundImage: File | null;
    phoneImage: File | null;
  };
  onFileChange: (type: "backgroundImage" | "phoneImage", file: File | null) => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({
  card,
  index,
  isExpanded,
  onToggle,
  onChange,
  onRemove,
  selectedFiles,
  onFileChange
}) => {
  return (
    <div className="space-y-4">
      <div
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-zinc-300" />
          <div>
            <h3 className="text-lg font-semibold text-zinc-200">
              Card {index + 1}: {card.title || "Sem título"}
            </h3>
            <p className="text-sm text-zinc-400">
              {card.highlightedText ? `Destaque: ${card.highlightedText}` : "Sem destaque"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-zinc-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-300" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 space-y-8">
              {/* Conteúdo do Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna 1: Informações básicas */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Título
                      </label>
                      <Input
                        type="text"
                        value={card.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange("title", e.target.value)
                        }
                        placeholder="Ex: Consultoria Oficial"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Texto Destacado
                      </label>
                      <Input
                        type="text"
                        value={card.highlightedText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onChange("highlightedText", e.target.value)
                        }
                        placeholder="Ex: Mercado Livre"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={card.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        onChange("description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-800 text-zinc-100 min-h-[100px]"
                      rows={3}
                      placeholder="Descrição detalhada do serviço..."
                    />
                  </div>

                  {/* Ícone e cores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Ícone
                      </label>
                      <IconSelector
                        value={card.icon}
                        onChange={(value) => onChange("icon", value)}
                        label="Selecione um ícone"
                      />
                    </div>

                    <div>
                      <ColorPropertyInput
                        label="Cor do Ícone"
                        value={card.iconBgColor}
                        onChange={(color: any) => onChange("iconBgColor", color)}
                        description="Cor de fundo do ícone"
                      />
                    </div>

                    <div>
                      <ColorPropertyInput
                        label="Cor Primária"
                        value={card.primaryColor}
                        onChange={(color: any) => onChange("primaryColor", color)}
                        description="Cor principal para textos e bordas"
                      />
                    </div>
                  </div>

                  <div>
                    <ColorPropertyInput
                      label="Cor de Fundo do Card"
                      value={card.backgroundColor}
                      onChange={(color: any) => onChange("backgroundColor", color)}
                      description="Cor de fundo do card completo"
                    />
                  </div>
                </div>

                {/* Coluna 2: Imagens e CTA */}
                <div className="space-y-6">
                  {/* Imagem de Fundo */}
                  <ImageUpload
                    label="Imagem de Fundo do Card"
                    currentImage={card.backgroundImage || ""}
                    selectedFile={selectedFiles.backgroundImage}
                    onFileChange={(file: File | null) => onFileChange("backgroundImage", file)}
                    aspectRatio="aspect-video"
                  />

                  {/* Phone Image */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-zinc-200 flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Imagem de Telefone
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">Ativar:</span>
                        <div
                          onClick={() => onChange("hasPhoneImage", !card.hasPhoneImage)}
                          className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors cursor-pointer ${
                            card.hasPhoneImage ? "bg-green-500" : "bg-gray-700"
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${
                            card.hasPhoneImage ? "translate-x-5" : ""
                          }`} />
                        </div>
                      </div>
                    </div>

                    {card.hasPhoneImage && (
                      <div className="space-y-4">
                        <ImageUpload
                          label="Imagem do Telefone"
                          currentImage={card.phoneImage || ""}
                          selectedFile={selectedFiles.phoneImage}
                          onFileChange={(file: File | null) => onFileChange("phoneImage", file)}
                          aspectRatio="aspect-[2/3]"
                        />

                        {card.phoneImageSize && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Largura (px)
                              </label>
                              <Input
                                type="number"
                                value={card.phoneImageSize.width.toString()}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  onChange("phoneImageSize", {
                                    ...card.phoneImageSize,
                                    width: parseInt(e.target.value)
                                  })
                                }
                                placeholder="400"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Altura (px)
                              </label>
                              <Input
                                type="number"
                                value={card.phoneImageSize.height.toString()}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  onChange("phoneImageSize", {
                                    ...card.phoneImageSize,
                                    height: parseInt(e.target.value)
                                  })
                                }
                                placeholder="600"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-6">
                <FeaturesEditor
                  features={card.features}
                  onChange={(features: any) => onChange("features", features)}
                />
              </div>

              {/* CTA */}
              <div className="space-y-6 p-4 border border-zinc-700 rounded-lg">
                <h4 className="font-semibold text-zinc-200 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Call to Action (CTA)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Texto do Botão
                    </label>
                    <Input
                      type="text"
                      value={card.cta.text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange("cta.text", e.target.value)
                      }
                      placeholder="Ex: Contratar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Ação
                    </label>
                    <select
                      value={card.cta.action}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        onChange("cta.action", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-800 text-zinc-100"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="link">Link</option>
                      <option value="email">Email</option>
                      <option value="phone">Telefone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Valor
                    </label>
                    <Input
                      type="text"
                      value={card.cta.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onChange("cta.value", e.target.value)
                      }
                      placeholder={card.cta.action === "whatsapp" ? "https://wa.me/5514991779502" : "/casos-de-sucesso"}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  {card.cta.action === "whatsapp" && <MessageCircle className="w-4 h-4" />}
                  {card.cta.action === "link" && <LinkIcon className="w-4 h-4" />}
                  {card.cta.action === "email" && <span>@</span>}
                  {card.cta.action === "phone" && <Phone className="w-4 h-4" />}
                  <span>
                    Ação: {card.cta.action === "whatsapp" ? "Abrir WhatsApp" : 
                          card.cta.action === "link" ? "Navegar para URL" :
                          card.cta.action === "email" ? "Enviar Email" : "Ligar"}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};