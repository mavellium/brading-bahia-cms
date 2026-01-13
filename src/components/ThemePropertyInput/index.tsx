/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/Input";
import ColorPicker from "@/components/ColorPicker";

export interface ThemeColors {
  primary: string;
  hoverBg: string;
  textOnPrimary: string;
  accentText: string;
  hoverText: string;
  border: string;
  glow: string;
  underline: string;
}

interface ThemePropertyInputProps {
  property: any;
  label: string;
  description?: string;
  currentHex: string;
  tailwindClass: string;
  onThemeChange: (property: keyof ThemeColors, hexColor: string) => void;
}

export const ThemePropertyInput = ({
  property,
  label,
  description,
  currentHex,
  tailwindClass,
  onThemeChange,
}: ThemePropertyInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      </div>
      <p className="text-xs text-zinc-500">{description}</p>
      <div className="flex gap-2">
        <Input
          type="text"
          value={currentHex}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onThemeChange(property, e.target.value)
          }
          placeholder="#000000"
          className="flex-1 font-mono"
        />
        <ColorPicker
          color={currentHex}
          onChange={(color: string) => onThemeChange(property, color)}
        />
      </div>
    </div>
  );
};