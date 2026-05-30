import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/server/auth';

import LoginClient from './login-client';

export const metadata: Metadata = {
  title: 'NextJS SaaS Boilerplate | Login',
  description: 'A boilerplate for your NextJS SaaS projects.',
};

const LoginPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/account');
  }
  return <LoginClient />;
};

export default LoginPage;
