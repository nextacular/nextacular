import { createCustomer } from '@/lib/server/stripe';
import prisma from '@/prisma/index';

export const createPaymentAccount = async (email, customerId) => {
  const paymentAccount = await createCustomer(email);
  await prisma.customerPayment.create({
    data: {
      customerId,
      email,
      paymentId: paymentAccount.id,
    },
  });
};

export const getPayment = async (email) =>
  await prisma.customerPayment.findUnique({ where: { email } });

export const updateSubscription = async (customerId, subscriptionType) =>
  await prisma.customerPayment.update({
    data: { subscriptionType },
    where: { customerId },
  });
