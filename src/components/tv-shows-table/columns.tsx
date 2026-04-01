"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import type { TVShow } from "@/core/domain/tv-shows/tv-show.entity";

export function createColumns(
  onEdit: (show: TVShow) => void,
  onDelete: (key: string) => void,
): ColumnDef<TVShow>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Title
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("title")}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground max-w-xs truncate block">
          {row.getValue("description")}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "recommendedAge",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Age
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue<number>("recommendedAge")}+</span>,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const show = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => onEdit(show)}>
              Edit
            </Button>
            <DeleteDialog
              title={`Delete "${show.title}"?`}
              onConfirm={() => onDelete(show["@key"])}
            >
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </DeleteDialog>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
