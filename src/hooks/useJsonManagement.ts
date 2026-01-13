/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useJsonManagement.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseJsonManagementProps<T> {
  apiPath: string;
  defaultData: T;
  mergeFunction?: (apiData: any, defaultData: T) => T;
}

export function useJsonManagement<T>({
  apiPath,
  defaultData,
  mergeFunction,
}: UseJsonManagementProps<T>) {
  const [data, setData] = useState<T>(defaultData);
  const [exists, setExists] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "single" as "single" | "all",
    title: "",
  });
  const [fileStates, setFileStates] = useState<Record<string, File | null>>({});
  
  // Refs para armazenar os timeouts
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpar timeouts quando o componente desmontar
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const showSuccess = useCallback((message?: string) => {
    setSuccess(true);
    
    // Limpar timeout anterior se existir
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    
    // Configurar novo timeout para esconder a mensagem após 3 segundos
    successTimeoutRef.current = setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }, []);

  const showError = useCallback((message: string) => {
    setErrorMsg(message);
    
    // Limpar timeout anterior se existir
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    
    // Configurar novo timeout para esconder a mensagem após 5 segundos
    errorTimeoutRef.current = setTimeout(() => {
      setErrorMsg("");
    }, 5000);
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch(apiPath, { cache: "no-store" });
      if (!res.ok) return;

      const record = (await res.json()) as T | null;
      if (!record) return;

      const mergedData = mergeFunction 
        ? mergeFunction(record, defaultData)
        : record;

      setExists(record);
      setData(mergedData);
    } catch (err) {
      console.error("Erro ao carregar JSON:", err);
    }
  }, [apiPath, defaultData, mergeFunction]);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateNested = useCallback((path: string, value: any) => {
    setData((prev: any) => {
      const clone = structuredClone(prev);
      const keys = path.split(".");
      let current = clone;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (i === keys.length - 1) {
          current[key] = value;
        } else {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
      }

      return clone;
    });
  }, []);

  const setFileState = (field: string, file: File | null) => {
    setFileStates(prev => ({
      ...prev,
      [field]: file,
    }));
  };

  const save = useCallback(async (): Promise<T> => {
    try {
      setLoading(true);
      setSuccess(false);
      setErrorMsg("");

      // SEMPRE usar FormData quando há possibilidade de arquivos
      const formData = new FormData();
      formData.set("values", JSON.stringify(data));

      // Adicionar arquivos ao FormData
      Object.entries(fileStates).forEach(([field, file]) => {
        if (file && file.size > 0) {
          formData.append(`file:${field}`, file);
        }
      });

      const res = await fetch(apiPath, {
        method: exists ? "PUT" : "POST",
        body: formData,
        // NÃO definir Content-Type manualmente - o navegador fará isso automaticamente com o boundary correto
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      const record = (await res.json()) as T;
      const mergedData = mergeFunction 
        ? mergeFunction(record, defaultData)
        : record;

      setExists(record);
      setData(mergedData);
      
      // Mostrar sucesso temporário
      showSuccess();
      
      // Limpar estados de arquivo após envio bem-sucedido
      setFileStates({});

      return record;
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      const errorMessage = err.message || "Erro ao salvar";
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiPath, data, exists, defaultData, mergeFunction, fileStates, showSuccess, showError]);

  const remove = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch(apiPath, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");

      setData(defaultData);
      setExists(null);
      setFileStates({});
      
      // Mostrar sucesso temporário após deletar
      showSuccess();
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao deletar";
      showError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiPath, defaultData, showSuccess, showError]);

  const openDeleteAllModal = () => {
    setDeleteModal({
      isOpen: true,
      type: "all",
      title: `TODAS AS CONFIGURAÇÕES`,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: "single", title: "" });
  };

  const confirmDelete = async () => {
    try {
      await remove();
    } catch (err) {
      // Erro já tratado em remove()
    } finally {
      closeDeleteModal();
    }
  };

  return {
    // Estados
    data,
    setData,
    exists,
    loading,
    success,
    errorMsg,
    deleteModal,
    fileStates,
    
    // Funções de atualização
    updateField,
    updateNested,
    setFileState,
    
    // Funções de API
    save,
    remove,
    reload: load,
    
    // Funções de UI
    openDeleteAllModal,
    closeDeleteModal,
    confirmDelete,
  };
}