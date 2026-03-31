"use server";

import { revalidatePath } from "next/cache";
import { ApiWatchlistRepository } from "@/infra/repositories/api-watchlist.repository";
import {
  createWatchlistSchema,
  type CreateWatchlistDTO,
} from "@/core/application/watchlist/create-watchlist.dto";
import {
  updateWatchlistSchema,
  type UpdateWatchlistDTO,
} from "@/core/application/watchlist/update-watchlist.dto";
import { CreateWatchlistUseCase } from "@/core/application/watchlist/create-watchlist.use-case";
import { UpdateWatchlistUseCase } from "@/core/application/watchlist/update-watchlist.use-case";
import { DeleteWatchlistUseCase } from "@/core/application/watchlist/delete-watchlist.use-case";
import { SearchWatchlistsUseCase } from "@/core/application/watchlist/search-watchlists.use-case";

type ActionResult = {
  success: boolean;
  message: string;
};

function makeRepository() {
  return new ApiWatchlistRepository();
}

export async function createWatchlistAction(
  data: CreateWatchlistDTO,
): Promise<ActionResult> {
  const validated = createWatchlistSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const useCase = new CreateWatchlistUseCase(makeRepository());
    await useCase.execute(validated.data);
    revalidatePath("/watchlist");
    return { success: true, message: "Watchlist created!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateWatchlistAction(
  data: UpdateWatchlistDTO,
): Promise<ActionResult> {
  const validated = updateWatchlistSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const useCase = new UpdateWatchlistUseCase(makeRepository());
    await useCase.execute(validated.data);
    revalidatePath("/watchlist");
    return { success: true, message: "Watchlist updated!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteWatchlistAction(
  key: string,
): Promise<ActionResult> {
  if (!key) {
    return { success: false, message: "Key is required" };
  }

  try {
    const useCase = new DeleteWatchlistUseCase(makeRepository());
    await useCase.execute(key);
    revalidatePath("/watchlist");
    return { success: true, message: "Watchlist deleted!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function searchWatchlistsAction() {
  try {
    const useCase = new SearchWatchlistsUseCase(makeRepository());
    return await useCase.execute();
  } catch {
    return [];
  }
}
