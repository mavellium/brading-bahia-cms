import { Check, Plus } from "lucide-react";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Trash2 } from "lucide-react";

interface Feature {
  text: string;
  icon: string;
}

interface FeaturesEditorProps {
  features: Feature[];
  onChange: (features: Feature[]) => void;
}

export const FeaturesEditor = ({ features, onChange }: FeaturesEditorProps) => {
  const addFeature = () => {
    onChange([...features, { text: "", icon: "mdi:check" }]);
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onChange(newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    onChange(newFeatures);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
          <Check className="w-5 h-5" />
          Benefícios ({features.length})
        </h4>
        <Button
          type="button"
          onClick={addFeature}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Benefício
        </Button>
      </div>

      {features.length === 0 ? (
        <Card className="p-8 text-center">
          <Check className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-zinc-300 mb-2">
            Nenhum benefício adicionado
          </h4>
          <p className="text-zinc-400 mb-4">
            Adicione os benefícios desta solução
          </p>
          <Button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Benefício
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {features.map((feature, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={feature.text}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      updateFeature(index, "text", e.target.value)
                    }
                    placeholder="Ex: Análise completa do marketplace"
                  />
                </div>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};