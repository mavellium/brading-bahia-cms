"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Palette, Check } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const presetColors = [
  "#EF4444", "#22C55E", "#3B82F6",
  "#EC4899", "#06B6D4", "#F59E0B", "#84CC16",
  "#111827", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB", "#F3F4F6",
  "#F0FDF4", "#FEF3C7",
];

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const [showPicker, setShowPicker] = useState(false);

  // Sincroniza o estado interno com a prop color sempre que ela mudar
  const normalizedColor = useMemo(() => {
    if (!color) return "#000000";
    const normalized = color.startsWith("#") ? color : `#${color}`;
    return normalized;
  }, [color]);

  const [selectedColor, setSelectedColor] = useState(normalizedColor);
  const [inputColor, setInputColor] = useState(normalizedColor);

  // Atualiza o estado interno quando a prop muda
  useEffect(() => {
    const normalized = color?.startsWith("#") ? color : `#${color}` || "#000000";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedColor(normalized);
    setInputColor(normalized);
  }, [color]);

  /* Fecha ao clicar fora */
  useEffect(() => {
    if (!showPicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  /* Calcula e aplica posição DIRETO NO DOM */
  const applyPickerPosition = () => {
    const button = buttonRef.current;
    const picker = pickerRef.current;

    if (!button || !picker) return;

    const rect = button.getBoundingClientRect();
    const pickerWidth = 272;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = rect.left + rect.width / 2 - pickerWidth / 2;
    let top = rect.bottom + 8;

    if (left + pickerWidth > viewportWidth - 16) {
      left = viewportWidth - pickerWidth - 16;
    }

    if (left < 16) {
      left = 16;
    }

    if (top + 320 > viewportHeight) {
      top = rect.top - 320;
    }

    picker.style.left = `${left}px`;
    picker.style.top = `${top}px`;
  };

  const togglePicker = () => {
    setShowPicker((open) => {
      const next = !open;

      if (next) {
        // Espera o DOM montar antes de posicionar
        requestAnimationFrame(applyPickerPosition);
      }

      return next;
    });
  };

  const applyColor = (newColor: string) => {
    const normalized = newColor.startsWith("#")
      ? newColor
      : `#${newColor}`;

    setSelectedColor(normalized);
    setInputColor(normalized);
    onChange(normalized);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputColor(value);

    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      applyColor(value);
    }
  };

  const handleInputBlur = () => {
    const value = inputColor.startsWith("#")
      ? inputColor
      : `#${inputColor}`;

    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      setInputColor(selectedColor);
    } else {
      applyColor(value);
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={togglePicker}
        className="p-2 rounded-lg border border-zinc-600 hover:bg-zinc-800 transition-colors flex items-center gap-2"
      >
        <Palette className="w-4 h-4 text-zinc-300" />
        <div className="flex flex-col items-start">
          <div
            className="w-8 h-4 rounded border"
            style={{ backgroundColor: normalizedColor }}
          />
          <span className="text-xs font-mono text-zinc-500 mt-1">
            {normalizedColor}
          </span>
        </div>
      </button>

      {showPicker && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />

          <div
            ref={pickerRef}
            className="fixed z-50 p-4 bg-zinc-800 border rounded-lg shadow-lg w-68 space-y-4"
          >
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => applyColor(e.target.value)}
              className="w-full h-10 rounded"
            />

            <input
              type="text"
              value={inputColor}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-full px-3 py-2 border rounded font-mono bg-zinc-700 text-white"
            />

            <div className="grid grid-cols-8 gap-1">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    applyColor(c);
                    setShowPicker(false);
                  }}
                  className="w-6 h-6 rounded border relative"
                  style={{ backgroundColor: c }}
                >
                  {selectedColor === c && (
                    <Check className="absolute inset-0 text-white" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPicker(false)}
              className="w-full py-2 text-sm hover:bg-zinc-700 rounded text-white"
            >
              Fechar
            </button>
          </div>
        </>
      )}
    </div>
  );
}