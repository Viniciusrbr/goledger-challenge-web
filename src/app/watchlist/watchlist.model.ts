"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createWatchlistAction,
  deleteWatchlistAction,
  updateWatchlistAction,
} from "@/app/actions/watchlist.actions";
import { createColumns } from "@/components/watchlist-table/columns";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import type { Watchlist } from "@/core/domain/watchlist/watchlist.entity";
import { createWatchlistSchema, updateWatchlistSchema } from "./watchlist.schema";
import type { CreateWatchlistFormData, UpdateWatchlistFormData } from "./watchlist.type";

type Props = {
  tvShows: TVShow[];
};

export function useWatchlistModel({ tvShows }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [selectedShows, setSelectedShows] = useState<string[]>([]);

  const tvShowMap = useMemo(
    () => Object.fromEntries(tvShows.map((s) => [s["@key"], s.title])),
    [tvShows],
  );

  const createForm = useForm<CreateWatchlistFormData>({
    resolver: zodResolver(createWatchlistSchema),
    defaultValues: { title: "", description: "" },
  });

  const updateForm = useForm<UpdateWatchlistFormData>({
    resolver: zodResolver(updateWatchlistSchema),
    defaultValues: { description: "" },
  });

  const toggleShow = (key: string) => {
    setSelectedShows((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const onCreateSubmit = async (data: CreateWatchlistFormData) => {
    const result = await createWatchlistAction({
      title: data.title,
      description: data.description || undefined,
      tvShows: selectedShows.map((key) => ({
        "@assetType": "tvShows" as const,
        "@key": key,
      })),
    });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      createForm.reset();
      setSelectedShows([]);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdateSubmit = async (data: UpdateWatchlistFormData) => {
    if (!editingKey) return;
    const result = await updateWatchlistAction({
      key: editingKey,
      description: data.description || undefined,
      tvShows: selectedShows.map((key) => ({
        "@assetType": "tvShows" as const,
        "@key": key,
      })),
    });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      setEditingKey(null);
      updateForm.reset();
      setSelectedShows([]);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (key: string) => {
    const result = await deleteWatchlistAction(key);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const startEdit = (watchlist: Watchlist) => {
    setEditingKey(watchlist["@key"]);
    updateForm.reset({ description: watchlist.description ?? "" });
    setSelectedShows(watchlist.tvShows?.map((s) => s["@key"]) ?? []);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingKey(null);
    createForm.reset();
    updateForm.reset();
    setSelectedShows([]);
  };

  return {
    showForm,
    isEditing: !!editingKey,
    setShowForm,
    createForm,
    updateForm,
    onCreateSubmit,
    onUpdateSubmit,
    handleDelete,
    startEdit,
    cancelForm,
    toggleShow,
    selectedShows,
    tvShowMap,
    columns: createColumns(startEdit, handleDelete),
  };
}
