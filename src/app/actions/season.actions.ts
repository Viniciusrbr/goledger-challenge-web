"use server";

import { revalidatePath } from "next/cache";
import { ApiSeasonRepository } from "@/infra/repositories/api-season.repository";
import {
  createSeasonSchema,
  type CreateSeasonDTO,
} from "@/core/application/seasons/create-season.dto";
import {
  updateSeasonSchema,
  type UpdateSeasonDTO,
} from "@/core/application/seasons/update-season.dto";
import { CreateSeasonUseCase } from "@/core/application/seasons/create-season.use-case";
import { UpdateSeasonUseCase } from "@/core/application/seasons/update-season.use-case";
import { DeleteSeasonUseCase } from "@/core/application/seasons/delete-season.use-case";
import { SearchSeasonsUseCase } from "@/core/application/seasons/search-seasons.use-case";

type ActionResult = {
  success: boolean;
  message: string;
};

function makeRepository() {
  return new ApiSeasonRepository();
}

export async function createSeasonAction(
  data: CreateSeasonDTO,
): Promise<ActionResult> {
  const validated = createSeasonSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const useCase = new CreateSeasonUseCase(makeRepository());
    await useCase.execute(validated.data);
    revalidatePath("/seasons");
    return { success: true, message: "Season created!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateSeasonAction(
  data: UpdateSeasonDTO,
): Promise<ActionResult> {
  const validated = updateSeasonSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    const useCase = new UpdateSeasonUseCase(makeRepository());
    await useCase.execute(validated.data);
    revalidatePath("/seasons");
    return { success: true, message: "Season updated!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteSeasonAction(key: string): Promise<ActionResult> {
  if (!key) {
    return { success: false, message: "Key is required" };
  }

  try {
    const useCase = new DeleteSeasonUseCase(makeRepository());
    await useCase.execute(key);
    revalidatePath("/seasons");
    return { success: true, message: "Season deleted!" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function searchSeasonsAction() {
  try {
    const useCase = new SearchSeasonsUseCase(makeRepository());
    return await useCase.execute();
  } catch {
    return [];
  }
}
