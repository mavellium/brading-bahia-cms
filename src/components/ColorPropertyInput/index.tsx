import { Input } from "@/components/Input";
import ColorPicker from "@/components/ColorPicker";

interface ColorPropertyInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

export const ColorPropertyInput = ({ 
  label, 
  value, 
  onChange, 
  description 
}: ColorPropertyInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      </div>
      {description && (
        <p className="text-xs text-zinc-500">{description}</p>
      )}
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder="#000000"
          className="flex-1 font-mono"
        />
        <ColorPicker
          color={value}
          onChange={onChange}
        />
        <div 
          className="w-10 h-10 rounded-lg border border-zinc-600"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
};