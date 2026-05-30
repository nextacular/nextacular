import type { SubscriptionType } from '@prisma/client';
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session extends DefaultSession {
    user: {
      userId: string;
      email: string;
      name?: string | null;
      image?: string | null;
      subscription?: SubscriptionType;
    };
  }
}
