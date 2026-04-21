"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createEpisodeAction,
  deleteEpisodeAction,
  updateEpisodeAction,
} from "@/app/actions/episode.actions";
import { createColumns } from "@/components/episodes-table/columns";
import type { Episode } from "@/core/domain/episodes/episode.entity";
import type { Season } from "@/core/domain/seasons/season.entity";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";
import { fromRFC3339, toRFC3339 } from "@/lib/date";
import { createEpisodeSchema, updateEpisodeSchema } from "./episodes.schema";
import type { CreateEpisodeFormData, UpdateEpisodeFormData } from "./episodes.type";

type Props = {
  episodes: Episode[];
  seasons: Season[];
  tvShows: TVShow[];
};

export function useEpisodesModel({ episodes, seasons, tvShows }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formTVShow, setFormTVShow] = useState("");

  const editingEpisode = useMemo(
    () => episodes.find((e) => e["@key"] === editingKey) ?? null,
    [episodes, editingKey],
  );

  const seasonMap = useMemo(
    () =>
      Object.fromEntries(
        seasons.map((s) => [s["@key"], `Season ${s.number} (${s.year})`]),
      ),
    [seasons],
  );

  const tvShowMap = useMemo(
    () => Object.fromEntries(tvShows.map((s) => [s["@key"], s.title])),
    [tvShows],
  );

  const seasonsForForm = useMemo(() => {
    if (!formTVShow) return seasons;
    return seasons.filter((s) => s.tvShow["@key"] === formTVShow);
  }, [seasons, formTVShow]);

  const createForm = useForm<CreateEpisodeFormData>({
    resolver: zodResolver(createEpisodeSchema),
    defaultValues: {
      episodeNumber: 1,
      seasonKey: "",
      title: "",
      releaseDate: "",
      description: "",
      rating: undefined,
    },
  });

  const updateForm = useForm<UpdateEpisodeFormData>({
    resolver: zodResolver(updateEpisodeSchema),
    defaultValues: {
      title: "",
      releaseDate: "",
      description: "",
      rating: undefined,
    },
  });

  const onCreateSubmit = async (data: CreateEpisodeFormData) => {
    const result = await createEpisodeAction({
      episodeNumber: data.episodeNumber,
      season: { "@assetType": "seasons", "@key": data.seasonKey },
      title: data.title,
      releaseDate: toRFC3339(data.releaseDate),
      description: data.description,
      rating: data.rating,
    });
    if (result.success) {
      toast.success(result.message);
      setShowForm(false);
      setFormTVShow("");
      createForm.reset();
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const onUpdateSubmit = async (data: UpdateEpisodeFormData) => {
    if (!editingKey) return;
    const result = await updateEpisodeAction({
      key: editingKey,
      title: data.title,
      releaseDate: toRFC3339(data.releaseDate),
      description: data.description,
      rating: data.rating,
    });
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
    const result = await deleteEpisodeAction(key);
    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  };

  const startEdit = (episode: Episode) => {
    setEditingKey(episode["@key"]);
    updateForm.reset({
      title: episode.title,
      releaseDate: fromRFC3339(episode.releaseDate),
      description: episode.description,
      rating: episode.rating ?? undefined,
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingKey(null);
    setFormTVShow("");
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
    formTVShow,
    setFormTVShow,
    editingEpisode,
    seasonMap,
    tvShowMap,
    seasonsForForm,
    columns: createColumns(seasonMap, startEdit, handleDelete),
  };
}
