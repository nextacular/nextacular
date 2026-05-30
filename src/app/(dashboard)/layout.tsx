import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { authOptions } from '@/lib/server/auth';

import DashboardShell from './dashboard-shell';

type DashboardLayoutProps = {
  children: ReactNode;
};

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/login');
  }
  return <DashboardShell>{children}</DashboardShell>;
};

export default DashboardLayout;
