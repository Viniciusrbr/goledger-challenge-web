"use server";

import { revalidatePath } from "next/cache";
import {
  type CreateTVShowDTO,
  createTVShowSchema,
} from "@/core/application/tv-shows/create-tv-show.dto";
import { CreateTVShowUseCase } from "@/core/application/tv-shows/create-tv-show.use-case";
import { DeleteTVShowUseCase } from "@/core/application/tv-shows/delete-tv-show.use-case";
import { SearchTVShowsUseCase } from "@/core/application/tv-shows/search-tv-shows.use-case";
import {
  type UpdateTVShowDTO,
  updateTVShowSchema,
} from "@/core/application/tv-shows/update-tv-show.dto";
import { UpdateTVShowUseCase } from "@/core/application/tv-shows/update-tv-show.use-case";
import { ApiTVShowRepository } from "@/infra/repositories/api-tv-show.repository";

type ActionResult = {
  success: boolean;
  message: string;
};

function makeRepository() {
  return new ApiTVShowRepository();
}

export async function createTVShowAction(
  data: CreateTVShowDTO,
): Promise<ActionResult> {
  const validated = createTVShowSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const useCase = new CreateTVShowUseCase(makeRepository());
    await useCase.execute(validated.data);
    revalidatePath("/tv-shows");
    return { success: true, message: "TV Show created!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateTVShowAction(
  data: UpdateTVShowDTO,
): Promise<ActionResult> {
  const validated = updateTVShowSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const useCase = new UpdateTVShowUseCase(makeRepository());
    await useCase.execute(validated.data);
    revalidatePath("/tv-shows");
    return { success: true, message: "TV Show updated!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteTVShowAction(key: string): Promise<ActionResult> {
  if (!key) {
    return { success: false, message: "Key is required" };
  }

  try {
    const useCase = new DeleteTVShowUseCase(makeRepository());
    await useCase.execute(key);
    revalidatePath("/tv-shows");
    return { success: true, message: "TV Show deleted!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function searchTVShowsAction() {
  try {
    const useCase = new SearchTVShowsUseCase(makeRepository());
    return await useCase.execute();
  } catch {
    return [];
  }
}
