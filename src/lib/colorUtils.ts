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

// Função para extrair hex da classe Tailwind
export const extractHexFromTailwind = (tailwindClass: string): string => {
  if (!tailwindClass) return "#000000";
  
  if (tailwindClass.startsWith("#")) {
    return tailwindClass;
  }
  
  const hexMatch = tailwindClass.match(/#([0-9A-Fa-f]{6})/);
  if (hexMatch) {
    return `#${hexMatch[1]}`;
  }
  
  const rgbaMatch = tailwindClass.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbaMatch) {
    const [_, r, g, b] = rgbaMatch;
    return `#${parseInt(r).toString(16).padStart(2, "0")}${parseInt(g)
      .toString(16)
      .padStart(2, "0")}${parseInt(b).toString(16).padStart(2, "0")}`;
  }
  
  if (tailwindClass.includes("black")) return "#000000";
  if (tailwindClass.includes("white")) return "#FFFFFF";
  if (tailwindClass.includes("yellow-500")) return "#F59E0B";
  
  return "#000000";
};

// Função para converter hex para classe Tailwind baseada na propriedade
export const hexToTailwindClass = (property: keyof ThemeColors, hex: string): string => {
  const cleanHex = hex.replace("#", "");
  
  switch (property) {
    case "primary":
      return `bg-[#${cleanHex}]`;
    case "hoverBg":
      return `hover:bg-[#${cleanHex}]`;
    case "textOnPrimary":
      if (hex === "#000000") return "text-black";
      if (hex === "#FFFFFF") return "text-white";
      return `text-[#${cleanHex}]`;
    case "accentText":
      return `text-[#${cleanHex}]`;
    case "hoverText":
      return `group-hover:text-[#${cleanHex}]`;
    case "border":
      return `border-[#${cleanHex}]/30`;
    case "glow":
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      return `shadow-[0_0_20px_rgba(${r},${g},${b},0.4)]`;
    case "underline":
      return `bg-[#${cleanHex}]`;
    default:
      return hex;
  }
};