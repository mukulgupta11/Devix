"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";
import type { TemplateFolder } from "../libs/path-to-json";

async function requireUser() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("You must be signed in to continue.");
  }
  return { ...user, id: userId };
}

async function requireOwnedPlayground(id: string) {
  const user = await requireUser();
  const playground = await db.playground.findFirst({
    where: { id, userId: user.id },
  });

  if (!playground) {
    throw new Error("Playground not found.");
  }

  return { user, playground };
}

export const toggleStarMarked = async (
  playgroundId: string,
  isChecked: boolean
) => {
  const { user } = await requireOwnedPlayground(playgroundId);

  if (isChecked) {
    await db.starMark.upsert({
      where: {
        userId_playgroundId: {
          userId: user.id,
          playgroundId,
        },
      },
      update: { isMarked: true },
      create: {
        userId: user.id,
        playgroundId,
        isMarked: true,
      },
    });
  } else {
    await db.starMark.deleteMany({
      where: {
        userId: user.id,
        playgroundId,
      },
    });
  }

  revalidatePath("/dashboard");
  return { success: true, isMarked: isChecked };
};

export const createPlayground = async (data: {
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}) => {
  const user = await requireUser();
  const title = data.title.trim();

  if (!title) {
    throw new Error("Project title is required.");
  }

  return db.playground.create({
    data: {
      title,
      description: data.description?.trim() || null,
      template: data.template,
      userId: user.id,
    },
  });
};

export const getAllPlaygroundForUser = async () => {
  const user = await requireUser();

  return db.playground.findMany({
    where: { userId: user.id },
    include: {
      user: true,
      Starmark: {
        where: { userId: user.id },
        select: { isMarked: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const getPlaygroundById = async (id: string) => {
  const user = await requireUser();

  return db.playground.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      title: true,
      description: true,
      template: true,
      createdAt: true,
      updatedAt: true,
      templateFiles: {
        select: { content: true },
      },
    },
  });
};

export const SaveUpdatedCode = async (
  playgroundId: string,
  data: TemplateFolder
) => {
  await requireOwnedPlayground(playgroundId);

  return db.templateFile.upsert({
    where: { playgroundId },
    update: {
      content: data as unknown as Prisma.InputJsonValue,
    },
    create: {
      playgroundId,
      content: data as unknown as Prisma.InputJsonValue,
    },
  });
};

export const deleteProjectById = async (id: string) => {
  await requireOwnedPlayground(id);
  await db.playground.delete({ where: { id } });
  revalidatePath("/dashboard");
  return { success: true };
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string }
) => {
  await requireOwnedPlayground(id);
  const title = data.title.trim();

  if (!title) {
    throw new Error("Project title is required.");
  }

  await db.playground.update({
    where: { id },
    data: {
      title,
      description: data.description.trim() || null,
    },
  });
  revalidatePath("/dashboard");
  return { success: true };
};

export const duplicateProjectById = async (id: string) => {
  const { user } = await requireOwnedPlayground(id);
  const originalPlayground = await db.playground.findFirst({
    where: { id, userId: user.id },
    include: { templateFiles: true },
  });

  if (!originalPlayground) {
    throw new Error("Original playground not found.");
  }

  const duplicatedPlayground = await db.playground.create({
    data: {
      title: `${originalPlayground.title} (Copy)`,
      description: originalPlayground.description,
      template: originalPlayground.template,
      userId: user.id,
      templateFiles:
        originalPlayground.templateFiles.length > 0
          ? {
              create: originalPlayground.templateFiles.map((file) => ({
                content: file.content as Prisma.InputJsonValue,
              })),
            }
          : undefined,
    },
  });

  revalidatePath("/dashboard");
  return duplicatedPlayground;
};
