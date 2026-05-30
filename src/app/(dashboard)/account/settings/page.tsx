import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/server/auth';
import { getUser } from '@/prisma/services/user';

import SettingsClient from './settings-client';

export const metadata: Metadata = {
  title: 'Nextacular - Account Settings',
};

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.userId) {
    redirect('/auth/login');
  }

  const user = await getUser(session.user.userId);

  return (
    <SettingsClient
      user={{
        email: user?.email ?? '',
        name: user?.name ?? '',
        userCode: user?.userCode ?? '',
      }}
    />
  );
};

export default SettingsPage;
