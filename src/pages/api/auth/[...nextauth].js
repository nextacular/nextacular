import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import prisma from '../../../../prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.userId = user.id;
      }

      return session;
    },
  },
  debug: process.env.NEXTAUTH_DEBUG,
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      server: {
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
});
