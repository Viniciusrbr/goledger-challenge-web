"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createSeasonAction,
  deleteSeasonAction,
  updateSeasonAction,
} from "@/app/actions/season.actions";
import { createColumns } from "@/components/seasons-table/columns";
import type { Season } from "@/core/domain/seasons/season.entity";
import { createSeasonSchema, updateSeasonSchema } from "./seasons.schema";
import type { CreateSeasonFormData, UpdateSeasonFormData } from "./seasons.type";

type Props = {
  tvShows: { "@key": string; title: string }[];
};

export function useSeasonsModel({ tvShows }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const tvShowMap = useMemo(
    () => Object.fromEntries(tvShows.map((s) => [s["@key"], s.title])),
    [tvShows],
  );

  const createForm = useForm<CreateSeasonFormData>({
    resolver: zodResolver(createSeasonSchema),
    defaultValues: { number: 1, tvShowKey: "", year: new Date().getFullYear() },
  });

  const updateForm = useForm<UpdateSeasonFormData>({
    resolver: zodResolver(updateSeasonSchema),
    defaultValues: { year: new Date().getFullYear() },
  });

  const onCreateSubmit = async (data: CreateSeasonFormData) => {
    const result = await createSeasonAction({
      number: data.number,
      tvShow: { "@assetType": "tvShows", "@key": data.tvShowKey },
      year: data.year,
    });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      createForm.reset();
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdateSubmit = async (data: UpdateSeasonFormData) => {
    if (!editingKey) return;
    const result = await updateSeasonAction({ key: editingKey, year: data.year });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      setEditingKey(null);
      updateForm.reset();
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (key: string) => {
    const result = await deleteSeasonAction(key);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const startEdit = (season: Season) => {
    setEditingKey(season["@key"]);
    updateForm.reset({ year: season.year });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingKey(null);
    createForm.reset();
    updateForm.reset();
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
    columns: createColumns(tvShowMap, startEdit, handleDelete),
  };
}
