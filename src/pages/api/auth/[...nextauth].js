import NextAuth from 'next-auth';

import { authOptions } from '@/lib/server/auth';

export default NextAuth(authOptions);
