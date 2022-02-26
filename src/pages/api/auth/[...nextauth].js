import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

import prisma from '@/prisma/index';
import { createCustomer } from '@/lib/server/stripe';

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
  events: {
    signIn: async ({ user, isNewUser }) => {
      const customerPayment = await prisma.customerPayment.findUnique({
        where: { email: user.email },
      });

      if (isNewUser || customerPayment === null || user.createdAt === null) {
        const paymentAccount = await createCustomer(user.email);
        await prisma.customerPayment.create({
          data: {
            customerId: user.id,
            email: user.email,
            paymentId: paymentAccount.id,
          },
        });
      }
    },
  },
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
