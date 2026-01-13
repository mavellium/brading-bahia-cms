/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ShoppingBag, Plus } from "lucide-react";
import { CardEditor } from "../CardEditor";

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

interface CardsSectionProps {
  cards: CardData[];
  expandedCards: number[];
  onToggleCard: (cardId: number) => void;
  onAddCard: () => void;
  onCardChange: (cardIndex: number, field: string, value: any) => void;
  onRemoveCard: (cardIndex: number) => void;
  files: {
    [cardId: number]: {
      backgroundImage: File | null;
      phoneImage: File | null;
    };
  };
  onFileChange: (cardId: number, type: "backgroundImage" | "phoneImage", file: File | null) => void;
}

export const CardsSection: React.FC<CardsSectionProps> = ({
  cards,
  expandedCards,
  onToggleCard,
  onAddCard,
  onCardChange,
  onRemoveCard,
  files,
  onFileChange
}) => {
  return (
    <div className="space-y-6">
      {cards.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-zinc-300 mb-2">
            Nenhum card de solução adicionado
          </h4>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Comece adicionando cards para mostrar suas soluções e casos de ROI
          </p>
          <Button
            type="button"
            onClick={onAddCard}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Card
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {cards.map((card, index) => (
            <CardEditor
              key={card.id}
              card={card}
              index={index}
              isExpanded={expandedCards.includes(card.id)}
              onToggle={() => onToggleCard(card.id)}
              onChange={(field: string, value: any) => onCardChange(index, field, value)}
              onRemove={() => onRemoveCard(index)}
              selectedFiles={files[card.id] || { backgroundImage: null, phoneImage: null }}
              onFileChange={(type: any, file: any) => onFileChange(card.id, type, file)}
            />
          ))}
        </div>
      )}
    </div>
  );
};