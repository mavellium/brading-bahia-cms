/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/Input";
import { ColorPropertyInput } from "../ColorPropertyInput";

interface GeralSectionProps {
  data: {
    id: string;
    title: string;
    subtitle: string;
    backgroundColor: string;
  };
  onChange: (field: string, value: any) => void;
}

export const GeralSection: React.FC<GeralSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          ID da Seção
        </label>
        <Input
          type="text"
          value={data.id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("id", e.target.value)
          }
          placeholder="roi-section"
        />
      </div>

      {/* Título e Subtítulo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Título 
          </label>
          <Input
            type="text"
            value={data.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange("title", e.target.value)
            }
            placeholder="Nossas Soluções"
          />
        </div>

        <div>
          <ColorPropertyInput
            label="Cor de Fundo da Seção"
            value={data.backgroundColor}
            onChange={(color: any) => onChange("backgroundColor", color)}
            description="Cor de fundo da seção completa"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Subtítulo
        </label>
        <Input
          type="text"
          value={data.subtitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("subtitle", e.target.value)
          }
          placeholder="Estratégias personalizadas para cada marketplace"
        />
      </div>
    </div>
  );
};