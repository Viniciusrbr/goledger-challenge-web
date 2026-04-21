"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createTVShowAction,
  deleteTVShowAction,
  updateTVShowAction,
} from "@/app/actions/tv-show.actions";
import { createColumns } from "@/components/tv-shows-table/columns";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import { createTVShowSchema, updateTVShowSchema } from "./tv-shows.schema";
import type { CreateTVShowFormData, UpdateTVShowFormData } from "./tv-shows.type";

export function useTVShowsModel() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const createForm = useForm<CreateTVShowFormData>({
    resolver: zodResolver(createTVShowSchema),
    defaultValues: { title: "", description: "", recommendedAge: 0 },
  });

  const updateForm = useForm<UpdateTVShowFormData>({
    resolver: zodResolver(updateTVShowSchema),
    defaultValues: { description: "", recommendedAge: 0 },
  });

  const onCreateSubmit = async (data: CreateTVShowFormData) => {
    const result = await createTVShowAction(data);
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      createForm.reset();
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdateSubmit = async (data: UpdateTVShowFormData) => {
    if (!editingKey) return;
    const result = await updateTVShowAction({ key: editingKey, ...data });
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
    const result = await deleteTVShowAction(key);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const startEdit = (show: TVShow) => {
    setEditingKey(show["@key"]);
    updateForm.reset({
      description: show.description,
      recommendedAge: show.recommendedAge,
    });
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
    columns: createColumns(startEdit, handleDelete),
  };
}
