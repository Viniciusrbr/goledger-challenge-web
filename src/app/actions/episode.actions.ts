"use server";

import { revalidatePath } from "next/cache";
import {
  type CreateEpisodeDTO,
  createEpisodeSchema,
} from "@/core/application/episodes/create-episode.dto";
import { CreateEpisodeUseCase } from "@/core/application/episodes/create-episode.use-case";
import { DeleteEpisodeUseCase } from "@/core/application/episodes/delete-episode.use-case";
import { SearchEpisodesUseCase } from "@/core/application/episodes/search-episodes.use-case";
import {
  type UpdateEpisodeDTO,
  updateEpisodeSchema,
} from "@/core/application/episodes/update-episode.dto";
import { UpdateEpisodeUseCase } from "@/core/application/episodes/update-episode.use-case";
import { ApiEpisodeRepository } from "@/infra/repositories/api-episode.repository";

type ActionResult = {
  success: boolean;
  message: string;
};

function makeRepository() {
  return new ApiEpisodeRepository();
}

export async function createEpisodeAction(
  data: CreateEpisodeDTO,
): Promise<ActionResult> {
  const validated = createEpisodeSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const useCase = new CreateEpisodeUseCase(makeRepository());
    await useCase.execute(validated.data);
    revalidatePath("/episodes");
    return { success: true, message: "Episode created!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateEpisodeAction(
  data: UpdateEpisodeDTO,
): Promise<ActionResult> {
  const validated = updateEpisodeSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const useCase = new UpdateEpisodeUseCase(makeRepository());
    await useCase.execute(validated.data);
    revalidatePath("/episodes");
    return { success: true, message: "Episode updated!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteEpisodeAction(key: string): Promise<ActionResult> {
  if (!key) {
    return { success: false, message: "Key is required" };
  }

  try {
    const useCase = new DeleteEpisodeUseCase(makeRepository());
    await useCase.execute(key);
    revalidatePath("/episodes");
    return { success: true, message: "Episode deleted!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function searchEpisodesAction() {
  try {
    const useCase = new SearchEpisodesUseCase(makeRepository());
    return await useCase.execute();
  } catch {
    return [];
  }
}
