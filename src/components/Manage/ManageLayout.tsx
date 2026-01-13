"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ManageLayoutProps {
  children: ReactNode;
  headerIcon: LucideIcon;
  title: string;
  description: string;
  exists: boolean;
  itemName: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function ManageLayout({
  children,
  headerIcon: HeaderIcon,
  title,
  description,
  exists,
  itemName,
  gradientFrom = "from-gray-50",
  gradientTo = "to-gray-100"
}: ManageLayoutProps) {
  return (
    <div className={`min-h-screen p-4 md:p-6 bg-gradient-to-br from-zinc-900 to-zinc-800`}>
      <div className="max-w-6xl mx-auto pb-6 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8 flex flex-wrap gap-5">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-[var(--color-primary)] rounded-2xl">
              <HeaderIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex flex-wrap flex-col flex-start justify-start text-start">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-[var(--color-secondary)]"
            >
              {exists ? `Gerenciar ${itemName}` : `Criar ${itemName}`}
            </motion.h1>
            <p className="text-[var(--color-secondary)]/70 mt-1">
              {description}
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}