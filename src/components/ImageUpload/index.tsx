/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Upload, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/Button";

interface ImageUploadProps {
  label: string;
  currentImage: string;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  aspectRatio?: string;
  previewWidth?: number;
  previewHeight?: number;
  description?: string;
  showRemoveButton?: boolean; // Nova prop opcional
}

export const ImageUpload = ({ 
  label, 
  currentImage, 
  selectedFile, 
  onFileChange, 
  aspectRatio = "aspect-video",
  previewWidth = 300,
  previewHeight = 200,
  description,
  showRemoveButton = false // Padrão: não mostrar botão remover
}: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (currentImage) {
      setPreviewUrl(currentImage);
    } else {
      setPreviewUrl("");
    }
  }, [selectedFile, currentImage]);

  const handleImageClick = () => {
    if (previewUrl) {
      setShowFullscreen(true);
    }
  };

  const handleFullscreenClose = () => {
    setShowFullscreen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  const getImageUrl = (): string => {
    if (selectedFile && previewUrl.startsWith('blob:')) {
      return previewUrl;
    }
    // Se for uma URL relativa, garantir que seja completa
    if (previewUrl && !previewUrl.startsWith('http') && !previewUrl.startsWith('blob:')) {
      const cleanUrl = previewUrl.startsWith('//') ? previewUrl.substring(2) : previewUrl;
      return `https://${cleanUrl}`;
    }
    return previewUrl;
  };

  const imageUrl = getImageUrl();

  return (
    <>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
        
        {description && (
          <p className="text-sm text-zinc-400 mb-2">
            {description}
          </p>
        )}

        <div className="flex flex-col items-center justify-center">
          {/* Preview da imagem */}
          {imageUrl ? (
            <div className="relative group w-full flex flex-col justify-center items-center">
              <div 
                className={`relative flex ${aspectRatio} rounded-lg overflow-hidden border border-zinc-600 bg-zinc-900 cursor-pointer`}
                style={{ 
                  width: previewWidth ? `${previewWidth}px` : '100%',
                  maxWidth: '100%',
                  height: previewHeight ? `${previewHeight}px` : 'auto'
                }}
                onClick={handleImageClick}
              >
                <img
                  src={imageUrl}
                  alt="Image preview"
                  width={previewWidth || undefined}
                  height={previewHeight || undefined}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-zinc-800">
                          <svg class="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      `;
                    }
                  }}
                />
                {/* Overlay para zoom */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-zinc-800/90 p-2 rounded-full">
                    <ZoomIn className="w-5 h-5 text-zinc-300" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-1 text-center">
                Clique na imagem para visualizar em tela cheia
              </p>
            </div>
          ) : (
            <div 
              className={`${aspectRatio} flex items-center justify-center bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-600`}
              style={{ 
                width: previewWidth ? `${previewWidth}px` : '100%',
                maxWidth: '100%',
                height: previewHeight ? `${previewHeight}px` : 'auto'
              }}
            >
              <ImageIcon className="w-12 h-12 text-zinc-400" />
            </div>
          )}
          
          {/* Botões de controle abaixo do preview */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            {imageUrl ? (
              <>
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {selectedFile ? "Alterar Imagem" : "Substituir Imagem"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
                
                {showRemoveButton && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => onFileChange(null)}
                    className="px-4 py-2"
                  >
                    Remover Imagem
                  </Button>
                )}
              </>
            ) : (
              <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Selecionar Imagem
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            )}
          </div>
          
          {/* Informações técnicas */}
          <div className="mt-3 text-center w-full">
            <p className="text-sm text-zinc-400">
              Formatos: JPG, PNG, WebP, GIF • Tamanho ideal: 800x600px
            </p>
          </div>
        </div>
      </div>

      {/* Modal de visualização em tela cheia */}
      <AnimatePresence>
        {showFullscreen && imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={handleFullscreenClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="button"
                onClick={handleFullscreenClose}
                className="absolute -top-4 -right-4 !p-3 !rounded-full bg-red-500 hover:bg-red-100 z-10"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-full h-full max-w-full max-h-full">
                  <img
                    src={imageUrl}
                    alt="Preview expandido"
                    className="max-w-full max-h-[80vh] min-h-[100px] min-w-[100px] object-contain rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};