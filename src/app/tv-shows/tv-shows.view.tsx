"use client";

import Link from "next/link";
import { DataTable } from "@/components/tv-shows-table/data-table";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTVShowsModel } from "./tv-shows.model";
import type { TVShowsProps } from "./tv-shows.type";

export function TVShowsView({ tvShows }: TVShowsProps) {
  const {
    showForm,
    isEditing,
    setShowForm,
    createForm,
    updateForm,
    onCreateSubmit,
    onUpdateSubmit,
    cancelForm,
    columns,
  } = useTVShowsModel();

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
