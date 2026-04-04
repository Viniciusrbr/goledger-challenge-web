import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-4 py-10 md:px-6">
      <span className="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full">
        <SearchX className="size-7" aria-hidden />
      </span>

      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </main>
  );
}
