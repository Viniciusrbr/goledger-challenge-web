"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  createSeasonAction,
  deleteSeasonAction,
  updateSeasonAction,
} from "@/app/actions/season.actions";
import { createColumns } from "@/components/seasons-table/columns";
import { DataTable } from "@/components/seasons-table/data-table";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Season } from "@/core/domain/seasons/season.entity";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";

const createSchema = z.object({
  number: z.number().int().min(1, "Season number must be at least 1"),
  tvShowKey: z.string().min(1, "TV Show is required"),
  year: z.number().int().min(1900, "Year must be 1900 or later"),
});

const updateSchema = z.object({
  year: z.number().int().min(1900, "Year must be 1900 or later"),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

type Props = {
  seasons: Season[];
  tvShows: TVShow[];
};

export function SeasonsClient({ seasons, tvShows }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const tvShowMap = useMemo(
    () => Object.fromEntries(tvShows.map((s) => [s["@key"], s.title])),
    [tvShows],
  );

  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { number: 1, tvShowKey: "", year: new Date().getFullYear() },
  });

  const updateForm = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: { year: new Date().getFullYear() },
  });

  const onCreateSubmit = async (data: CreateFormData) => {
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

  const onUpdateSubmit = async (data: UpdateFormData) => {
    if (!editingKey) return;
    const result = await updateSeasonAction({
      key: editingKey,
      year: data.year,
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

  const columns = createColumns(tvShowMap, startEdit, handleDelete);
  const isEditing = !!editingKey;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 space-y-6">
      <div className="text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Seasons</h1>
          <p className="text-muted-foreground text-sm">
            Manage seasons linked to each TV show.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add Season</Button>
        )}
      </div>

      {showForm && !isEditing && (
        <form
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="border rounded-xl p-4 space-y-4 bg-card"
        >
          <h2 className="font-medium">New Season</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field>
              <FieldLabel>Season Number</FieldLabel>
              <Input
                type="number"
                min={1}
                placeholder="1"
                {...createForm.register("number", { valueAsNumber: true })}
              />
              <FieldError errors={[createForm.formState.errors.number]} />
            </Field>
            <Field>
              <FieldLabel>Year</FieldLabel>
              <Input
                type="number"
                min={1900}
                placeholder="2008"
                {...createForm.register("year", { valueAsNumber: true })}
              />
              <FieldError errors={[createForm.formState.errors.year]} />
            </Field>
            <Field>
              <FieldLabel>TV Show</FieldLabel>
              <Controller
                control={createForm.control}
                name="tvShowKey"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a TV Show" />
                    </SelectTrigger>
                    <SelectContent>
                      {tvShows.map((show) => (
                        <SelectItem key={show["@key"]} value={show["@key"]}>
                          {show.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[createForm.formState.errors.tvShowKey]} />
            </Field>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={createForm.formState.isSubmitting}>
              {createForm.formState.isSubmitting ? "Saving..." : "Create"}
            </Button>
            <Button type="button" variant="outline" onClick={cancelForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {showForm && isEditing && (
        <form
          onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
          className="border rounded-xl p-4 space-y-4 bg-card"
        >
          <h2 className="font-medium">Edit Season</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field>
              <FieldLabel>Year</FieldLabel>
              <Input
                type="number"
                min={1900}
                placeholder="2008"
                {...updateForm.register("year", { valueAsNumber: true })}
              />
              <FieldError errors={[updateForm.formState.errors.year]} />
            </Field>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={updateForm.formState.isSubmitting}>
              {updateForm.formState.isSubmitting ? "Saving..." : "Update"}
            </Button>
            <Button type="button" variant="outline" onClick={cancelForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <DataTable columns={columns} data={seasons} tvShows={tvShows} />
    </main>
  );
}
