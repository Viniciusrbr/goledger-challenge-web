"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import type { Watchlist } from "@/core/domain/watchlist/watchlist.entity";

export function createColumns(
  onEdit: (watchlist: Watchlist) => void,
  onDelete: (key: string) => void,
): ColumnDef<Watchlist>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("title")}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground max-w-xs truncate block">
          {row.getValue<string | undefined>("description") ?? "—"}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "tvShows",
      header: "Shows",
      cell: ({ row }) => {
        const count = row.original.tvShows?.length ?? 0;
        if (count === 0) {
          return <span className="text-muted-foreground text-sm">0 shows</span>;
        }
        return (
          <button
            type="button"
            onClick={() => row.toggleExpanded()}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {count} show{count !== 1 ? "s" : ""}
            {row.getIsExpanded() ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const watchlist = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(watchlist)}
            >
              Edit
            </Button>
            <DeleteDialog
              title={`Delete "${watchlist.title}"?`}
              onConfirm={() => onDelete(watchlist["@key"])}
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
