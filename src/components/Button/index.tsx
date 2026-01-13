import { ButtonProps } from "@/types";
import { Loader2 } from "lucide-react";

export const Button = ({ 
  children, 
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  ...props 
}: ButtonProps) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "shadow-button hover:shadow-primary bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-secondary)] hover:text-[var(--color-primary)] border border-[var(--color-primary)]",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};