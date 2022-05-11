import prisma from '@/prisma/index';

export const createDomain = async (
  id,
  email,
  slug,
  name,
  apexName,
  verified,
  verificationData
) => {
  let subdomain = null;
  let verificationValue = null;

  if (!verified) {
    const { domain, value } = verificationData[0];
    subdomain = domain.replace(`.${apexName}`, '');
    verificationValue = value;
  }

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
      subdomain,
      value: verificationValue,
      verified,
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
    select: {
      name: true,
      subdomain: true,
      verified: true,
      value: true,
    },
    where: {
      deletedAt: null,
      workspace: {
        deletedAt: null,
        slug,
      },
    },
  });

export const verifyDomain = async (id, email, slug, name, verified) => {
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
    data: { verified },
    where: { id: domain.id },
  });
};
