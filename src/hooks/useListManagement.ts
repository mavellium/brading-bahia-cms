/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSite } from "@/context/site-context";

interface UseListManagementProps<T> {
  type: string;
  apiPath: string;
  defaultItem: T;
  validationFields?: (keyof T)[];
}

interface DeleteModalState {
  isOpen: boolean;
  type: "single" | "all" | null;
  index: number | null;
  title: string;
}

function getPlanLimit(planType: "basic" | "pro"): number {
  return planType === "pro" ? 10 : 5;
}

export function useListManagement<T extends { id?: string }>({
  type,
  apiPath,
  defaultItem,
  validationFields = [],
}: UseListManagementProps<T>) {
  const { currentSite } = useSite();

  const [list, setList] = useState<T[]>([{ ...defaultItem }]);
  const [exists, setExists] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showValidation, setShowValidation] = useState(false);

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    type: null,
    index: null,
    title: "",
  });

  const newItemRef = useRef<HTMLDivElement>(null);

  const currentPlanLimit = useMemo(
    () => getPlanLimit(currentSite.planType),
    [currentSite.planType]
  );

  const currentPlanType = currentSite.planType;

  const isLimitReached = list.length >= currentPlanLimit;

  // =========================
  // 🔥 LOAD DATA (API OBJETO)
  // =========================
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(apiPath);
        if (!res.ok) return;

        const data = await res.json();

        /**
         * SUPORTA:
         * - API nova: { id, type, subtype, values }
         * - API antiga: [ { id, values } ]
         */
        let record = null;
        let values: any[] = [];

        if (data && Array.isArray(data.values)) {
          record = data;
          values = data.values;
        } else if (Array.isArray(data) && data.length && data[0]?.values) {
          record = data[0];
          values = data[0].values;
        }

        const normalizedList = (values || [])
          .slice(0, currentPlanLimit)
          .map((item, index) => ({
            ...item,
            id: item.id || `${type}-${index}`,
          }));

        if (normalizedList.length > 0) {
          setExists(record);
          setList(normalizedList);
        } else {
          setExists(record);
          setList([{ ...defaultItem, id: `${type}-0` }]);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    loadData();
  }, [apiPath, type, currentPlanLimit, defaultItem]);

  // =========================
  // HELPERS
  // =========================
  const createNewItem = useCallback(
    (): T => ({
      ...defaultItem,
      id: `${type}-${Date.now()}`,
    }),
    [defaultItem, type]
  );

  const canAddNewItem = useMemo(() => {
    if (isLimitReached || search) return false;

    if (!validationFields.length) return true;

    const last = list[list.length - 1];
    return validationFields.every((field) => {
      const v = last[field];
      if (typeof v === "string") return v.trim() !== "";
      return !!v;
    });
  }, [list, search, validationFields, isLimitReached]);

  const filteredItems = useMemo(() => {
    const items = list
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter((item) => {
        if (!search) return true;
        return Object.values(item).some(
          (v) =>
            typeof v === "string" &&
            v.toLowerCase().includes(search.toLowerCase())
        );
      });

    return sortOrder === "desc"
      ? items.reverse()
      : items;
  }, [list, search, sortOrder]);

  // =========================
  // ACTIONS
  // =========================
  const addItem = useCallback(() => {
    if (!canAddNewItem) {
      setShowValidation(true);
      return;
    }

    setList([...list, createNewItem()]);
    setShowValidation(false);

    setTimeout(() => {
      newItemRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [list, canAddNewItem, createNewItem]);

  const openDeleteSingleModal = (index: number, title: string) =>
    setDeleteModal({ isOpen: true, type: "single", index, title });

  const openDeleteAllModal = () =>
    setDeleteModal({ isOpen: true, type: "all", index: null, title: "" });

  const closeDeleteModal = () =>
    setDeleteModal({ isOpen: false, type: null, index: null, title: "" });

  const confirmDelete = async (
    updateFn?: (list: T[]) => Promise<any>
  ) => {
    let newList = list;

    if (deleteModal.type === "all") {
      newList = [createNewItem()];
    }

    if (deleteModal.type === "single" && deleteModal.index !== null) {
      newList =
        list.length === 1
          ? [createNewItem()]
          : list.filter((_, i) => i !== deleteModal.index);
    }

    setList(newList);
    if (exists && updateFn) await updateFn(newList);
    closeDeleteModal();
  };

  const completeCount = useMemo(() => {
    if (!validationFields.length) return list.length;
    return list.filter((item) =>
      validationFields.every((f) => {
        const v = item[f];
        return typeof v === "string" ? v.trim() : !!v;
      })
    ).length;
  }, [list, validationFields]);

  return {
    list,
    setList,
    exists,
    loading,
    setLoading,
    success,
    setSuccess,
    errorMsg,
    setErrorMsg,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    showValidation,
    deleteModal,
    newItemRef,
    filteredItems,
    canAddNewItem,
    completeCount,
    isLimitReached,
    currentPlanLimit,
    currentPlanType,
    addItem,
    openDeleteSingleModal,
    openDeleteAllModal,
    closeDeleteModal,
    confirmDelete,
    clearFilters: () => {
      setSearch("");
      setSortOrder("asc");
    },
  };
}
