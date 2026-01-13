/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoIcon, Upload, X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/Button";

interface VideoUploadProps {
  label: string;
  currentVideo: string;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  aspectRatio?: string;
  previewWidth?: number;
  previewHeight?: number;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  showRemoveButton?: boolean; // Nova prop opcional
}

export const VideoUpload = ({ 
  label, 
  currentVideo, 
  selectedFile, 
  onFileChange, 
  aspectRatio = "aspect-video",
  previewWidth = 400,
  previewHeight = 225,
  description,
  accept = "video/mp4,video/webm,video/ogg",
  maxSizeMB = 50,
  showRemoveButton = false // Padrão: não mostrar botão remover
}: VideoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFile) {
      // Validar tamanho do arquivo
      if (maxSizeMB && selectedFile.size > maxSizeMB * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
        onFileChange(null);
        return;
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setError("");
      
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (currentVideo) {
      setPreviewUrl(currentVideo);
      setError("");
    } else {
      setPreviewUrl("");
    }
  }, [selectedFile, currentVideo, maxSizeMB, onFileChange]);

  const handleVideoClick = () => {
    if (previewUrl) {
      setShowFullscreen(true);
    }
  };

  const handleFullscreenClose = () => {
    setShowFullscreen(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError("");
    onFileChange(file);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current && duration > 0) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
      setCurrentTime(pos * duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.ended) {
        setIsPlaying(false);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoUrl = (): string => {
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

  const videoUrl = getVideoUrl();

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

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="flex flex-col items-start">
          {/* Preview do vídeo */}
          {videoUrl ? (
            <div className="relative group w-full">
              <div 
                className={`relative ${aspectRatio} rounded-lg overflow-hidden border border-zinc-600 bg-black cursor-pointer`}
                style={{ 
                  width: previewWidth ? `${previewWidth}px` : '100%',
                  maxWidth: '100%',
                  height: previewHeight ? `${previewHeight}px` : 'auto'
                }}
                onClick={handleVideoClick}
              >
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  playsInline
                  preload="metadata"
                />
                
                {/* Controles de vídeo */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-white" />
                      ) : (
                        <Play className="w-4 h-4 text-white" />
                      )}
                    </button>
                    
                    <div className="flex items-center gap-2 flex-1 mx-4">
                      <span className="text-xs text-white">
                        {formatTime(currentTime)}
                      </span>
                      <div 
                        ref={progressRef}
                        className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProgressClick(e);
                        }}
                      >
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-white">
                        {formatTime(duration)}
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Overlay para play */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-zinc-800/90 p-3 rounded-full">
                    <Play className="w-6 h-6 text-zinc-300" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-zinc-400 mt-1 text-center">
                Clique para ampliar • {formatTime(duration)}
              </p>
            </div>
          ) : (
            <div 
              className={`${aspectRatio} flex items-center justify-center bg-zinc-900 rounded-lg border-2 border-dashed border-zinc-700`}
              style={{ 
                width: previewWidth ? `${previewWidth}px` : '100%',
                maxWidth: '100%',
                height: previewHeight ? `${previewHeight}px` : 'auto'
              }}
            >
              <VideoIcon className="w-12 h-12 text-zinc-600" />
            </div>
          )}
          
          {/* Botões de controle abaixo do preview */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            {videoUrl ? (
              <>
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {selectedFile ? "Alterar Vídeo" : "Substituir Vídeo"}
                  <input
                    type="file"
                    accept={accept}
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
                    Remover Vídeo
                  </Button>
                )}
              </>
            ) : (
              <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Selecionar Vídeo
                <input
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            )}
          </div>
          
          {/* Informações técnicas */}
          <div className="mt-3 text-center w-full">
            <p className="text-sm text-zinc-400">
              Formatos: MP4, WebM, OGG • Tamanho máximo: {maxSizeMB}MB
            </p>
          </div>
          
          {/* Controles de volume (apenas quando há vídeo) */}
          {videoUrl && (
            <div className="mt-4 space-y-2 w-full max-w-md">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Volume</span>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1 hover:bg-zinc-800 rounded"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualização em tela cheia */}
      <AnimatePresence>
        {showFullscreen && videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            onClick={handleFullscreenClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                type="button"
                onClick={handleFullscreenClose}
                className="absolute -top-4 -right-4 !p-3 !rounded-full bg-red-500 hover:bg-red-600 z-10"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full max-h-[80vh] rounded-2xl"
                  controls
                  autoPlay
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};