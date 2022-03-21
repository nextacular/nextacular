import { html, text } from '@/config/email-templates/email-update';
import api from '@/lib/common/api';
import { sendMail } from '@/lib/server/mail';
import prisma from '@/prisma/index';

export const deactivate = async (id) =>
  await prisma.user.update({
    data: { deletedAt: new Date() },
    where: { id },
  });

export const getUser = async (id) =>
  await prisma.user.findUnique({
    select: {
      email: true,
      name: true,
      userCode: true,
    },
    where: { id },
  });

export const logCreateAccount = async (email) =>
  await api(process.env.LOGSNAG_API_URL, {
    body: {
      project: 'nextacular',
      channel: 'user-registration',
      event: 'New User Signup',
      description: `A new user recently signed up. (${email})`,
      icon: '🔥',
      notify: true,
    },
    headers: {
      Authorization: `Bearer ${process.env.LOGSNAG_API_TOKEN}`,
    },
    method: 'POST',
  });

export const updateEmail = async (id, email, previousEmail) => {
  await prisma.user.update({
    data: {
      email,
      emailVerified: null,
    },
    where: { id },
  });
  await sendMail({
    html: html({ email }),
    subject: `[Nextacular] Email address updated`,
    text: text({ email }),
    to: [email, previousEmail],
  });
};

export const updateName = async (id, name) =>
  await prisma.user.update({
    data: { name },
    where: { id },
  });
