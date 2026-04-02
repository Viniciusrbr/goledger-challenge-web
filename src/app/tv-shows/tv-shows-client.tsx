"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  createTVShowAction,
  deleteTVShowAction,
  updateTVShowAction,
} from "@/app/actions/tv-show.actions";
import { createColumns } from "@/components/tv-shows-table/columns";
import { DataTable } from "@/components/tv-shows-table/data-table";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  recommendedAge: z.number().int().min(0, "Age must be 0 or greater"),
});

const updateSchema = z.object({
  description: z.string().min(1, "Description is required"),
  recommendedAge: z.number().int().min(0, "Age must be 0 or greater"),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

export function TVShowsClient({ tvShows }: { tvShows: TVShow[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { title: "", description: "", recommendedAge: 0 },
  });

  const updateForm = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
    defaultValues: { description: "", recommendedAge: 0 },
  });

  const onCreateSubmit = async (data: CreateFormData) => {
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

  const onUpdateSubmit = async (data: UpdateFormData) => {
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

  const columns = createColumns(startEdit, handleDelete);
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
          <h1 className="text-2xl font-semibold">TV Shows</h1>
          <p className="text-muted-foreground text-sm">
            Manage TV shows on the blockchain.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add TV Show</Button>
        )}
      </div>

      {showForm && !isEditing && (
        <form
          onSubmit={createForm.handleSubmit(onCreateSubmit)}
          className="border rounded-xl p-4 space-y-4 bg-card"
        >
          <h2 className="font-medium">New TV Show</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                placeholder="Breaking Bad"
                {...createForm.register("title")}
              />
              <FieldError errors={[createForm.formState.errors.title]} />
            </Field>
            <Field>
              <FieldLabel>Recommended Age</FieldLabel>
              <Input
                type="number"
                min={0}
                placeholder="18"
                {...createForm.register("recommendedAge", {
                  valueAsNumber: true,
                })}
              />
              <FieldError
                errors={[createForm.formState.errors.recommendedAge]}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  placeholder="A chemistry teacher turned drug lord..."
                  {...createForm.register("description")}
                />
                <FieldError
                  errors={[createForm.formState.errors.description]}
                />
              </Field>
            </div>
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
          <h2 className="font-medium">Edit TV Show</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel>Recommended Age</FieldLabel>
              <Input
                type="number"
                min={0}
                placeholder="18"
                {...updateForm.register("recommendedAge", {
                  valueAsNumber: true,
                })}
              />
              <FieldError
                errors={[updateForm.formState.errors.recommendedAge]}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  placeholder="A chemistry teacher turned drug lord..."
                  {...updateForm.register("description")}
                />
                <FieldError
                  errors={[updateForm.formState.errors.description]}
                />
              </Field>
            </div>
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

      <DataTable columns={columns} data={tvShows} />
    </main>
  );
}
