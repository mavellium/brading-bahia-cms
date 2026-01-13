// /lib/colors.ts

// Função melhorada para converter classes Tailwind para hex
export const tailwindToHex = (tailwindClass: string): string => {
  if (!tailwindClass) return "#3B82F6"; // blue-500 como default
  
  // Se já for um hex, retorna
  if (tailwindClass.startsWith("#")) {
    return tailwindClass.length === 4 
      ? `#${tailwindClass[1]}${tailwindClass[1]}${tailwindClass[2]}${tailwindClass[2]}${tailwindClass[3]}${tailwindClass[3]}`
      : tailwindClass;
  }

  // Mapeamento completo de cores Tailwind para HEX
  const colorMap: Record<string, string> = {
    // Cores principais
    "black": "#000000",
    "white": "#FFFFFF",
    "transparent": "transparent",
    "current": "currentColor",
    
    // Slate
    "slate-50": "#F8FAFC", "slate-100": "#F1F5F9", "slate-200": "#E2E8F0", "slate-300": "#CBD5E1",
    "slate-400": "#94A3B8", "slate-500": "#64748B", "slate-600": "#475569", "slate-700": "#334155",
    "slate-800": "#1E293B", "slate-900": "#0F172A", "slate-950": "#020617",
    
    // Gray (mantenha as existentes e adicione mais precisão)
    "gray-50": "#F9FAFB", "gray-100": "#F3F4F6", "gray-200": "#E5E7EB", "gray-300": "#D1D5DB",
    "gray-400": "#9CA3AF", "gray-500": "#6B7280", "gray-600": "#4B5563", "gray-700": "#374151",
    "gray-800": "#1F2937", "gray-900": "#111827", "gray-950": "#030712",
    
    // Zinc
    "zinc-50": "#FAFAFA", "zinc-100": "#F4F4F5", "zinc-200": "#E4E4E7", "zinc-300": "#D4D4D8",
    "zinc-400": "#A1A1AA", "zinc-500": "#71717A", "zinc-600": "#52525B", "zinc-700": "#3F3F46",
    "zinc-800": "#27272A", "zinc-900": "#18181B", "zinc-950": "#09090B",
    
    // Red (cores mais comuns para warning words)
    "red-50": "#FEF2F2", "red-100": "#FEE2E2", "red-200": "#FECACA", "red-300": "#FCA5A5",
    "red-400": "#F87171", "red-500": "#EF4444", "red-600": "#DC2626", "red-700": "#B91C1C",
    "red-800": "#991B1B", "red-900": "#7F1D1D", "red-950": "#450A0A",
    
    // Orange
    "orange-50": "#FFF7ED", "orange-100": "#FFEDD5", "orange-200": "#FED7AA", "orange-300": "#FDBA74",
    "orange-400": "#FB923C", "orange-500": "#F97316", "orange-600": "#EA580C", "orange-700": "#C2410C",
    "orange-800": "#9A3412", "orange-900": "#7C2D12", "orange-950": "#431407",
    
    // Amber
    "amber-50": "#FFFBEB", "amber-100": "#FEF3C7", "amber-200": "#FDE68A", "amber-300": "#FCD34D",
    "amber-400": "#FBBF24", "amber-500": "#F59E0B", "amber-600": "#D97706", "amber-700": "#B45309",
    "amber-800": "#92400E", "amber-900": "#78350F", "amber-950": "#451A03",
    
    // Yellow
    "yellow-50": "#FEFCE8", "yellow-100": "#FEF9C3", "yellow-200": "#FEF08A", "yellow-300": "#FDE047",
    "yellow-400": "#FACC15", "yellow-500": "#EAB308", "yellow-600": "#CA8A04", "yellow-700": "#A16207",
    "yellow-800": "#854D0E", "yellow-900": "#713F12", "yellow-950": "#422006",
    
    // Green
    "green-50": "#F0FDF4", "green-100": "#DCFCE7", "green-200": "#BBF7D0", "green-300": "#86EFAC",
    "green-400": "#4ADE80", "green-500": "#22C55E", "green-600": "#16A34A", "green-700": "#15803D",
    "green-800": "#166534", "green-900": "#14532D", "green-950": "#052E16",
    
    // Blue
    "blue-50": "#EFF6FF", "blue-100": "#DBEAFE", "blue-200": "#BFDBFE", "blue-300": "#93C5FD",
    "blue-400": "#60A5FA", "blue-500": "#3B82F6", "blue-600": "#2563EB", "blue-700": "#1D4ED8",
    "blue-800": "#1E40AF", "blue-900": "#1E3A8A", "blue-950": "#172554",
    
    // Indigo
    "indigo-50": "#EEF2FF", "indigo-100": "#E0E7FF", "indigo-200": "#C7D2FE", "indigo-300": "#A5B4FC",
    "indigo-400": "#818CF8", "indigo-500": "#6366F1", "indigo-600": "#4F46E5", "indigo-700": "#4338CA",
    "indigo-800": "#3730A3", "indigo-900": "#312E81", "indigo-950": "#1E1B4B",
    
    // Purple
    "purple-50": "#FAF5FF", "purple-100": "#F3E8FF", "purple-200": "#E9D5FF", "purple-300": "#D8B4FE",
    "purple-400": "#C084FC", "purple-500": "#A855F7", "purple-600": "#9333EA", "purple-700": "#7E22CE",
    "purple-800": "#6B21A8", "purple-900": "#581C87", "purple-950": "#3B0764",
    
    // Pink
    "pink-50": "#FDF2F8", "pink-100": "#FCE7F3", "pink-200": "#FBCFE8", "pink-300": "#F9A8D4",
    "pink-400": "#F472B6", "pink-500": "#EC4899", "pink-600": "#DB2777", "pink-700": "#BE185D",
    "pink-800": "#9D174D", "pink-900": "#831843", "pink-950": "#500724",
    
    // Rose (adicionando para completar)
    "rose-50": "#FFF1F2", "rose-100": "#FFE4E6", "rose-200": "#FECDD3", "rose-300": "#FDA4AF",
    "rose-400": "#FB7185", "rose-500": "#F43F5E", "rose-600": "#E11D48", "rose-700": "#BE123C",
    "rose-800": "#9F1239", "rose-900": "#881337", "rose-950": "#4C0519",
  };

  // Remove prefixos como 'bg-', 'text-', 'border-', etc.
  const cleanClass = tailwindClass
    .replace(/^(bg-|text-|border-|from-|to-|via-|ring-|shadow-|fill-|stroke-|accent-|outline-|decoration-|divide-|placeholder-|caret-)/, '')
    .replace(/^(hover:|focus:|active:|disabled:|dark:|light:|md:|sm:|lg:|xl:|2xl:)/, '')
    .replace(/^(\[#[a-fA-F0-9]{3,6}\])/, ''); // Remove classes hex customizadas

  // Para cores como "text-amber-600" -> "amber-600"
  const finalClass = cleanClass.replace(/^\/+|\/+$/g, ''); // Remove barras extras

  return colorMap[finalClass] || "#3B82F6"; // blue-500 como fallback
};

// Função para extrair hex de qualquer classe Tailwind
export const extractHexFromTailwind = (tailwindClass: string): string => {
  if (!tailwindClass) return "#3B82F6";
  
  // Se já for hex, retorna formatado
  if (tailwindClass.startsWith("#")) {
    // Normaliza hex shorthand
    if (tailwindClass.length === 4) {
      return `#${tailwindClass[1]}${tailwindClass[1]}${tailwindClass[2]}${tailwindClass[2]}${tailwindClass[3]}${tailwindClass[3]}`;
    }
    return tailwindClass;
  }
  
  // Se for uma classe customizada [hex]
  const hexMatch = tailwindClass.match(/\[#([0-9A-Fa-f]{6})\]/);
  if (hexMatch) {
    return `#${hexMatch[1]}`;
  }
  
  const hexMatch3 = tailwindClass.match(/\[#([0-9A-Fa-f]{3})\]/);
  if (hexMatch3) {
    const hex = hexMatch3[1];
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  
  // Converte classe Tailwind para hex
  return tailwindToHex(tailwindClass);
};

// Função para converter hex para classe Tailwind de background
export const hexToTailwindBgClass = (hex: string): string => {
  const cleanHex = hex.replace("#", "").toUpperCase();
  
  // Mapeamento inverso
  const hexToColorMap: Record<string, string> = {
    "000000": "black",
    "FFFFFF": "white",
    "FEF2F2": "red-50", "FEE2E2": "red-100", "FECACA": "red-200", "FCA5A5": "red-300",
    "F87171": "red-400", "EF4444": "red-500", "DC2626": "red-600", "B91C1C": "red-700",
    "991B1B": "red-800", "7F1D1D": "red-900", "450A0A": "red-950",
    
    "FFFBEB": "amber-50", "FEF3C7": "amber-100", "FDE68A": "amber-200", "FCD34D": "amber-300",
    "FBBF24": "amber-400", "F59E0B": "amber-500", "D97706": "amber-600", "B45309": "amber-700",
    "92400E": "amber-800", "78350F": "amber-900", "451A03": "amber-950",
    
    "FEFCE8": "yellow-50", "FEF9C3": "yellow-100", "FEF08A": "yellow-200", "FDE047": "yellow-300",
    "FACC15": "yellow-400", "EAB308": "yellow-500", "CA8A04": "yellow-600", "A16207": "yellow-700",
    "854D0E": "yellow-800", "713F12": "yellow-900", "422006": "yellow-950",
    
    "F0FDF4": "green-50", "DCFCE7": "green-100", "BBF7D0": "green-200", "86EFAC": "green-300",
    "4ADE80": "green-400", "22C55E": "green-500", "16A34A": "green-600", "15803D": "green-700",
    "166534": "green-800", "14532D": "green-900", "052E16": "green-950",
    
    "EFF6FF": "blue-50", "DBEAFE": "blue-100", "BFDBFE": "blue-200", "93C5FD": "blue-300",
    "60A5FA": "blue-400", "3B82F6": "blue-500", "2563EB": "blue-600", "1D4ED8": "blue-700",
    "1E40AF": "blue-800", "1E3A8A": "blue-900", "172554": "blue-950",
    
    "F9FAFB": "gray-50", "F3F4F6": "gray-100", "E5E7EB": "gray-200", "D1D5DB": "gray-300",
    "9CA3AF": "gray-400", "6B7280": "gray-500", "4B5563": "gray-600", "374151": "gray-700",
    "1F2937": "gray-800", "111827": "gray-900", "030712": "gray-950",
  };

  const colorName = hexToColorMap[cleanHex];
  return colorName ? `bg-${colorName}` : `bg-[#${cleanHex}]`;
};

// Função para converter hex para classe Tailwind de texto
export const hexToTailwindTextClass = (hex: string): string => {
  const cleanHex = hex.replace("#", "").toUpperCase();
  
  // Mapeamento inverso
  const hexToColorMap: Record<string, string> = {
    "000000": "black",
    "FFFFFF": "white",
    "FEF2F2": "red-50", "FEE2E2": "red-100", "FECACA": "red-200", "FCA5A5": "red-300",
    "F87171": "red-400", "EF4444": "red-500", "DC2626": "red-600", "B91C1C": "red-700",
    "991B1B": "red-800", "7F1D1D": "red-900", "450A0A": "red-950",
    
    "FFFBEB": "amber-50", "FEF3C7": "amber-100", "FDE68A": "amber-200", "FCD34D": "amber-300",
    "FBBF24": "amber-400", "F59E0B": "amber-500", "D97706": "amber-600", "B45309": "amber-700",
    "92400E": "amber-800", "78350F": "amber-900", "451A03": "amber-950",
    
    "FEFCE8": "yellow-50", "FEF9C3": "yellow-100", "FEF08A": "yellow-200", "FDE047": "yellow-300",
    "FACC15": "yellow-400", "EAB308": "yellow-500", "CA8A04": "yellow-600", "A16207": "yellow-700",
    "854D0E": "yellow-800", "713F12": "yellow-900", "422006": "yellow-950",
    
    "F0FDF4": "green-50", "DCFCE7": "green-100", "BBF7D0": "green-200", "86EFAC": "green-300",
    "4ADE80": "green-400", "22C55E": "green-500", "16A34A": "green-600", "15803D": "green-700",
    "166534": "green-800", "14532D": "green-900", "052E16": "green-950",
    
    "EFF6FF": "blue-50", "DBEAFE": "blue-100", "BFDBFE": "blue-200", "93C5FD": "blue-300",
    "60A5FA": "blue-400", "3B82F6": "blue-500", "2563EB": "blue-600", "1D4ED8": "blue-700",
    "1E40AF": "blue-800", "1E3A8A": "blue-900", "172554": "blue-950",
    
    "F9FAFB": "gray-50", "F3F4F6": "gray-100", "E5E7EB": "gray-200", "D1D5DB": "gray-300",
    "9CA3AF": "gray-400", "6B7280": "gray-500", "4B5563": "gray-600", "374151": "gray-700",
    "1F2937": "gray-800", "111827": "gray-900", "030712": "gray-950",
  };

  const colorName = hexToColorMap[cleanHex];
  return colorName ? `text-${colorName}` : `text-[#${cleanHex}]`;
};

// Função para normalizar hex color
export const normalizeHexColor = (color: string): string => {
  if (!color) return "#3B82F6";
  
  let hex = color.replace("#", "").toUpperCase();
  
  // Expande shorthand
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // Garante 6 caracteres
  if (hex.length === 6) {
    return `#${hex}`;
  }
  
  // Fallback
  return "#3B82F6";
};