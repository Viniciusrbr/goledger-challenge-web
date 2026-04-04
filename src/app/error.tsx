"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-4 py-10 md:px-6">
      <span className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full">
        <AlertCircle className="size-7" aria-hidden />
      </span>

      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="text-muted-foreground text-xs">
            Error ID:{" "}
            <code className="bg-muted rounded px-1 py-0.5">{error.digest}</code>
          </p>
        )}
      </div>

      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
