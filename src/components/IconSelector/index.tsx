// components/IconSelector.tsx - MELHORADO
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Icon } from '@iconify/react';

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const iconCategories = [
  {
    name: "Material Design",
    icons: [
      { value: "mdi:check-decagram", label: "Verificado" },
      { value: "mdi:star", label: "Estrela" },
      { value: "mdi:shield-check", label: "Escudo Verificado" },
      { value: "mdi:rocket-launch", label: "Foguete" },
      { value: "mdi:chart-line", label: "Gráfico de Linha" },
      { value: "mdi:account-group", label: "Grupo" },
      { value: "mdi:cash", label: "Dinheiro" },
      { value: "mdi:calendar-check", label: "Calendário Verificado" },
      { value: "mdi:timer", label: "Temporizador" },
      { value: "mdi:phone-in-talk", label: "Telefone" },
      { value: "mdi:email", label: "Email" },
      { value: "mdi:message-text", label: "Mensagem" },
      { value: "mdi:cart", label: "Carrinho" },
      { value: "mdi:package-variant", label: "Pacote" },
      { value: "mdi:truck-delivery", label: "Entrega" },
      { value: "mdi:trophy", label: "Troféu" },
      { value: "mdi:thumb-up", label: "Like" },
      { value: "mdi:help-circle-outline", label: "Ajuda" },
      { value: "mdi:cog", label: "Engrenagem" },
      { value: "mdi:home", label: "Casa" },
      { value: "mdi:earth", label: "Globo" },
      { value: "mdi:link", label: "Link" },
      { value: "mdi:open-in-new", label: "Abrir Nova" },
    ]
  },
  {
    name: "Lucide",
    icons: [
      { value: "lucide:arrow-right", label: "Seta Direita" },
      { value: "lucide:check-circle", label: "Círculo Verificado" },
      { value: "lucide:trending-up", label: "Crescendo" },
      { value: "lucide:users", label: "Usuários" },
      { value: "lucide:dollar-sign", label: "Cifrão" },
      { value: "lucide:calendar", label: "Calendário" },
      { value: "lucide:clock", label: "Relógio" },
      { value: "lucide:phone", label: "Telefone" },
      { value: "lucide:mail", label: "Email" },
      { value: "lucide:message-square", label: "Mensagem" },
      { value: "lucide:shopping-cart", label: "Carrinho" },
      { value: "lucide:package", label: "Pacote" },
      { value: "lucide:truck", label: "Caminhão" },
      { value: "lucide:award", label: "Prêmio" },
      { value: "lucide:thumbs-up", label: "Joinha" },
      { value: "lucide:help-circle", label: "Ajuda" },
      { value: "lucide:settings", label: "Configurações" },
      { value: "lucide:home", label: "Casa" },
      { value: "lucide:globe", label: "Globo" },
      { value: "lucide:link", label: "Link" },
      { value: "lucide:external-link", label: "Link Externo" },
      { value: "lucide:zap", label: "Raio" },
      { value: "lucide:target", label: "Alvo" },
      { value: "lucide:bar-chart", label: "Gráfico" },
    ]
  },
  {
    name: "Heroicons",
    icons: [
      { value: "heroicons:check-badge-solid", label: "Verificado" },
      { value: "heroicons:star-solid", label: "Estrela" },
      { value: "heroicons:shield-check-solid", label: "Escudo" },
      { value: "heroicons:rocket-launch-solid", label: "Foguete" },
      { value: "heroicons:chart-bar-solid", label: "Gráfico" },
      { value: "heroicons:user-group-solid", label: "Grupo" },
      { value: "heroicons:currency-dollar-solid", label: "Dólar" },
      { value: "heroicons:calendar-days-solid", label: "Calendário" },
      { value: "heroicons:clock-solid", label: "Relógio" },
      { value: "heroicons:phone-solid", label: "Telefone" },
      { value: "heroicons:envelope-solid", label: "Email" },
      { value: "heroicons:chat-bubble-left-solid", label: "Mensagem" },
      { value: "heroicons:shopping-cart-solid", label: "Carrinho" },
      { value: "heroicons:gift-solid", label: "Presente" },
      { value: "heroicons:truck-solid", label: "Caminhão" },
      { value: "heroicons:trophy-solid", label: "Troféu" },
      { value: "heroicons:hand-thumb-up-solid", label: "Like" },
      { value: "heroicons:question-mark-circle-solid", label: "Ajuda" },
      { value: "heroicons:cog-solid", label: "Engrenagem" },
      { value: "heroicons:home-solid", label: "Casa" },
      { value: "heroicons:globe-americas-solid", label: "Globo" },
      { value: "heroicons:link-solid", label: "Link" },
      { value: "heroicons:arrow-top-right-on-square-solid", label: "Abrir" },
    ]
  }
];

export default function IconSelector({ value, onChange, placeholder = "mdi:check-decagram", label }: IconSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredIcons, setFilteredIcons] = useState<Array<{value: string, label: string}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeDropdown = () => {
    setShowDropdown(false);
    setSearch('');
  };

  useEffect(() => {
    if (showDropdown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDropdown]);

  useEffect(() => {
    if (search.trim() === '') {
      const allIcons = iconCategories.flatMap(category => category.icons);
      setFilteredIcons(allIcons);
    } else {
      const searchLower = search.toLowerCase();
      const filtered: Array<{value: string, label: string}> = [];
      
      iconCategories.forEach(category => {
        category.icons.forEach(icon => {
          if (
            icon.label.toLowerCase().includes(searchLower) || 
            icon.value.toLowerCase().includes(searchLower)
          ) {
            filtered.push(icon);
          }
        });
      });
      
      setFilteredIcons(filtered);
    }
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleSelect = (iconValue: string) => {
    onChange(iconValue);
    closeDropdown();
  };

  const getPickerPosition = () => {
    if (!inputRef.current || !showDropdown) return { top: 0, left: 0, width: 0 };

    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = inputRect.left;
    let top = inputRect.bottom + 8;
    const width = Math.max(inputRect.width, 400);

    if (left + width > viewportWidth - 16) {
      left = viewportWidth - width - 16;
    }

    if (top + 400 > viewportHeight) {
      top = inputRect.top - 400;
    }

    if (top < 16) {
      top = 16;
    }

    return { top: `${top}px`, left: `${left}px`, width: `${width}px` };
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {value ? (
            <Icon icon={value} className="w-5 h-5 text-zinc-500" />
          ) : (
            <div className="w-5 h-5 flex items-center justify-center">
              <Search className="w-4 h-4 text-zinc-400" />
            </div>
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-800 text-zinc-100"
        />
        
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-zinc-700 rounded"
        >
          {showDropdown ? (
            <X className="w-4 h-4 text-zinc-500" />
          ) : (
            <Search className="w-4 h-4 text-zinc-500" />
          )}
        </button>
      </div>

      {showDropdown && (
        <>
          {/* Overlay escuro - agora com clique para fechar */}
          <div 
            className="fixed inset-0 bg-[#00000042] z-40"
            onClick={closeDropdown}
          />
          
          {/* Dropdown fixo */}
          <div
            // eslint-disable-next-line react-hooks/refs
            style={getPickerPosition()}
            className="fixed z-50 bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg overflow-hidden max-h-[500px] flex flex-col"
          >
            {/* Cabeçalho com busca e botão de fechar */}
            <div className="p-3 border-b border-zinc-700 bg-zinc-800 flex items-center justify-between">
              <div className="relative flex-1 mr-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar ícones por nome..."
                  className="w-full pl-10 pr-4 py-2 border border-zinc-600 rounded-lg bg-zinc-700 text-zinc-100"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={closeDropdown}
                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                aria-label="Fechar seletor de ícones"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {search.trim() === '' ? (
                <div className="p-4">
                  {iconCategories.map((category) => (
                    <div key={category.name} className="mb-6">
                      <h3 className="text-sm font-semibold text-zinc-300 mb-3 px-2">
                        {category.name}
                      </h3>
                      <div className="grid grid-cols-5 gap-2 p-2">
                        {category.icons.map((icon) => (
                          <button
                            key={icon.value}
                            type="button"
                            onClick={() => handleSelect(icon.value)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-zinc-700 transition-colors ${
                              value === icon.value ? 'bg-blue-900/20 border border-blue-800' : 'border border-transparent'
                            }`}
                            title={`${icon.label} (${icon.value})`}
                          >
                            <Icon 
                              icon={icon.value} 
                              className={`w-6 h-6 mb-1 ${
                                value === icon.value ? 'text-blue-400' : 'text-zinc-400'
                              }`}
                            />
                            <span className="text-xs text-center text-zinc-400 truncate w-full">
                              {icon.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  {filteredIcons.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400">
                      <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Nenhum ícone encontrado</p>
                      <p className="text-xs mt-1">Tente buscar por outra palavra</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-zinc-300">
                          Resultados ({filteredIcons.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {filteredIcons.map((icon) => (
                          <button
                            key={icon.value}
                            type="button"
                            onClick={() => handleSelect(icon.value)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg hover:bg-zinc-700 transition-colors ${
                              value === icon.value ? 'bg-blue-900/20 border border-blue-800' : 'border border-transparent'
                            }`}
                            title={`${icon.label} (${icon.value})`}
                          >
                            <Icon 
                              icon={icon.value} 
                              className={`w-6 h-6 mb-1 ${
                                value === icon.value ? 'text-blue-400' : 'text-zinc-400'
                              }`}
                            />
                            <span className="text-xs text-center text-zinc-400 truncate w-full">
                              {icon.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-zinc-700 bg-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-400">
                  <span className="font-medium">Selecionado:</span>{' '}
                  {value || 'Nenhum'}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onChange('');
                      closeDropdown();
                    }}
                    className="text-xs text-red-500 hover:text-red-600 hover:underline px-2 py-1"
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    onClick={closeDropdown}
                    className="text-xs text-blue-500 hover:text-blue-600 hover:underline px-2 py-1"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mt-2">
        <p className="text-sm text-zinc-400">
          <strong>Formato:</strong> coleção:nome-do-ícone
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Exemplos: mdi:check-decagram, lucide:arrow-right, heroicons:star-solid
        </p>
      </div>
    </div>
  );
}