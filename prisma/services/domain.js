import prisma from '@/prisma/index';

export const createDomain = async (id, email, slug, name) => {
  const workspace = await prisma.workspace.findFirst({
    select: { id: true },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              email,
              deletedAt: null,
            },
          },
        },
      ],
      AND: {
        deletedAt: null,
        slug,
      },
    },
  });
  await prisma.domain.create({
    data: {
      addedById: id,
      name,
      workspaceId: workspace.id,
    },
  });
};

export const deleteDomain = async (id, email, slug, name) => {
  const workspace = await prisma.workspace.findFirst({
    select: { id: true },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              email,
              deletedAt: null,
            },
          },
        },
      ],
      AND: {
        deletedAt: null,
        slug,
      },
    },
  });
  const domain = await prisma.domain.findFirst({
    select: { id: true },
    where: {
      deletedAt: null,
      name,
      workspaceId: workspace.id,
    },
  });
  await prisma.domain.update({
    data: { deletedAt: new Date() },
    where: { id: domain.id },
  });
};

export const getDomains = async (slug) =>
  await prisma.domain.findMany({
    select: { name: true },
    where: {
      deletedAt: null,
      workspace: {
        deletedAt: null,
        slug,
      },
    },
  });
