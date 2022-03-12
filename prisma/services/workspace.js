import { InvitationStatus, TeamRole } from '@prisma/client';
import slugify from 'slugify';

import {
  html as createHtml,
  text as createText,
} from '@/config/email-templates/workspace-create';
import {
  html as inviteHtml,
  text as inviteText,
} from '@/config/email-templates/invitation';
import { sendMail } from '@/lib/server/mail';
import prisma from '@/prisma/index';

export const countWorkspaces = async (slug) =>
  await prisma.workspace.count({
    where: { slug: { startsWith: slug } },
  });

export const createWorkspace = async (creatorId, email, name, slug) => {
  const workspace = await prisma.workspace.create({
    data: {
      creatorId,
      members: {
        create: {
          email,
          inviter: email,
          status: InvitationStatus.ACCEPTED,
          teamRole: TeamRole.OWNER,
        },
      },
      name,
      slug,
    },
  });
  await sendMail({
    html: createHtml({ code: workspace.inviteCode, name }),
    subject: `[Nextacular] Workspace created: ${name}`,
    text: createText({ code: workspace.inviteCode, name }),
    to: email,
  });
};

export const deleteWorkspace = async (id, email, slug) => {
  const workspace = await getWorkspace(id, email, slug);

  if (workspace) {
    await prisma.workspace.update({
      data: { deletedAt: new Date() },
      where: { id: workspace.id },
    });
    return slug;
  } else {
    throw new Error('Unable to find workspace');
  }
};

export const getInvitation = async (inviteCode) =>
  await prisma.workspace.findFirst({
    select: {
      id: true,
      name: true,
      workspaceCode: true,
      slug: true,
    },
    where: {
      deletedAt: null,
      inviteCode,
    },
  });

export const getWorkspace = async (id, email, slug) =>
  await prisma.workspace.findFirst({
    select: {
      id: true,
      inviteCode: true,
      name: true,
    },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              deletedAt: null,
              teamRole: TeamRole.OWNER,
              email,
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

export const getWorkspaces = async (id, email) =>
  await prisma.workspace.findMany({
    select: {
      createdAt: true,
      creator: {
        select: {
          email: true,
          name: true,
        },
      },
      inviteCode: true,
      members: {
        select: {
          member: {
            select: {
              email: true,
              image: true,
              name: true,
            },
          },
          joinedAt: true,
          status: true,
          teamRole: true,
        },
      },
      name: true,
      slug: true,
      workspaceCode: true,
    },
    where: {
      OR: [
        { id },
        {
          members: {
            some: {
              email,
              deletedAt: null,
              status: InvitationStatus.ACCEPTED,
            },
          },
        },
      ],
      AND: { deletedAt: null },
    },
  });

export const getWorkspacePaths = async () => {
  const [workspaces, domains] = await Promise.all([
    prisma.workspace.findMany({
      select: { slug: true },
      where: { deletedAt: null },
    }),
    prisma.domain.findMany({
      select: { name: true },
      where: { deletedAt: null },
    }),
  ]);
  return [
    ...workspaces.map((workspace) => ({
      params: { site: workspace.slug },
    })),
    ...domains.map((domain) => ({
      params: { site: domain.name },
    })),
  ];
};

export const inviteUsers = async (id, email, members, slug) => {
  const workspace = await getWorkspace(id, email, slug);

  if (workspace) {
    const membersList = members.map(({ email, role }) => ({
      email,
      inviter: session.user.email,
      teamRole: role,
    }));
    const data = members.map(({ email }) => ({
      createdAt: null,
      email,
    }));
    await Promise.all([
      prisma.user.createMany({
        data,
        skipDuplicates: true,
      }),
      prisma.workspace.update({
        data: {
          members: {
            createMany: {
              data: membersList,
              skipDuplicates: true,
            },
          },
        },
        where: { id: workspace.id },
      }),
      sendMail({
        html: inviteHtml({ code: workspace.inviteCode, name: workspace.name }),
        subject: `[Nextacular] You have been invited to join ${workspace.name} workspace`,
        text: inviteText({ code: workspace.inviteCode, name: workspace.name }),
        to: members.map((member) => member.email),
      }),
    ]);
    return membersList;
  } else {
    throw new Error('Unable to find workspace');
  }
};

export const joinWorkspace = async (workspaceCode, email) => {
  const workspace = await prisma.workspace.findFirst({
    select: {
      creatorId: true,
      id: true,
    },
    where: {
      deletedAt: null,
      workspaceCode,
    },
  });

  if (workspace) {
    await prisma.member.upsert({
      create: {
        workspaceId: workspace.id,
        email,
        inviter: workspace.creatorId,
        status: InvitationStatus.ACCEPTED,
      },
      update: {},
      where: { email },
    });
    return new Date();
  } else {
    throw new Error('Unable to find workspace');
  }
};

export const updateName = async (id, email, name, slug) => {
  const workspace = await getWorkspace(id, email, slug);

  if (workspace) {
    await prisma.workspace.update({
      data: { name },
      where: { id: workspace.id },
    });
    return name;
  } else {
    throw new Error('Unable to find workspace');
  }
};

export const updateSlug = async (id, email, newSlug, pathSlug) => {
  let slug = slugify(newSlug.toLowerCase());
  const count = await prisma.workspace.count({
    where: { slug: { startsWith: slug } },
  });

  if (count > 0) {
    slug = `${slug}-${count}`;
  }

  const workspace = await getWorkspace(id, email, pathSlug);

  if (workspace) {
    await prisma.workspace.update({
      data: { slug },
      where: { id: workspace.id },
    });
    return slug;
  } else {
    throw new Error('Unable to find workspace');
  }
};
