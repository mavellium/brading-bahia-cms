/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  section: any;
  icon: LucideIcon;
  isExpanded: boolean;
  onToggle: (section: any) => void;
}

export const SectionHeader = ({
  title,
  section,
  icon: Icon,
  isExpanded,
  onToggle
}: SectionHeaderProps) => (
  <div
    onClick={() => onToggle(section)}
    className="w-full flex items-center justify-between p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-zinc-300" />
      <h3 className="text-lg font-semibold text-zinc-200">
        {title}
      </h3>
    </div>
    {isExpanded ? (
      <ChevronUp className="w-5 h-5 text-zinc-300" />
    ) : (
      <ChevronDown className="w-5 h-5 text-zinc-300" />
    )}
  </div>
);