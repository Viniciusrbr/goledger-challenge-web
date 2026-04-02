import { Bookmark, Clapperboard, Layers, Tv } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AssetType, SearchResult } from "@/core/domain/shared.types";
import { apiPost } from "@/lib/api-client";

const sections: {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  assetType: AssetType;
}[] = [
  {
    href: "/tv-shows",
    title: "TV Shows",
    description: "Catalogue series: create, edit, search and remove shows.",
    icon: Tv,
    assetType: "tvShows",
  },
  {
    href: "/seasons",
    title: "Seasons",
    description: "Manage seasons linked to each show.",
    icon: Layers,
    assetType: "seasons",
  },
  {
    href: "/episodes",
    title: "Episodes",
    description: "List and maintain episodes per season.",
    icon: Clapperboard,
    assetType: "episodes",
  },
  {
    href: "/watchlist",
    title: "Watchlists",
    description: "Register and edit watchlists of TV shows.",
    icon: Bookmark,
    assetType: "watchlist",
  },
];

export const HomeDashboard = async () => {
  const results = await Promise.allSettled(
    sections.map((s) =>
      apiPost<SearchResult<unknown>>("/api/query/search", {
        query: { selector: { "@assetType": s.assetType } },
      }),
    ),
  );
  const counts = results.map((r) =>
    r.status === "fulfilled" ? r.value.result.length : null,
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-4 py-10 md:px-6">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          GoLedger Challenge
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          GoLedger TV
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
          A simple catalogue for TV shows, seasons, episodes and watchlists —
          backed by the blockchain API. Use the sections below to manage data
          (create, update, delete and search).
        </p>
      </header>

      <section aria-labelledby="stats-heading" className="space-y-3">
        <h2 id="stats-heading" className="text-lg font-medium">
          Overview
        </h2>
        {counts.some((c) => c === null) && (
          <p className="text-muted-foreground text-sm">
            Could not load some counts. Check your API credentials and{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              NEXT_PUBLIC_APP_URL
            </code>
            .
          </p>
        )}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {sections.map(({ title, assetType }, i) => (
            <li
              key={assetType}
              className="bg-card text-card-foreground rounded-xl border px-4 py-3"
            >
              <p className="text-muted-foreground text-xs">{title}</p>
              <p className="font-heading text-2xl font-semibold tabular-nums">
                {counts[i] ?? "—"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="areas-heading" className="space-y-4">
        <h2 id="areas-heading" className="text-lg font-medium">
          Areas
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map(({ href, title, description, icon: Icon }, i) => (
            <Card key={href}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Records:{" "}
                  <span className="text-foreground font-medium tabular-nums">
                    {counts[i] ?? "—"}
                  </span>
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full sm:w-auto">
                  <Link href={href}>Go to {title}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};
