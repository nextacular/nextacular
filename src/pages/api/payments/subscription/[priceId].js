import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';
import stripe from '@/lib/server/stripe';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      const { priceId } = req.query;
      const [customerPayment, price] = await Promise.all([
        prisma.customerPayment.findUnique({
          where: { email: session.user?.email },
        }),
        stripe.prices.retrieve(priceId),
      ]);
      const product = await stripe.products.retrieve(price.product);
      const lineItems = [
        {
          price: price.id,
          quantity: 1,
        },
      ];
      const paymentSession = await stripe.checkout.sessions.create({
        customer: customerPayment.paymentId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: `${process.env.NEXTAUTH_URL}/account/payment?status=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/account/payment?status=cancelled`,
        metadata: {
          customerId: customerPayment.customerId,
          type: product.metadata.type,
        },
      });
      res.status(200).json({ data: { sessionId: paymentSession.id } });
    } else {
      res
        .status(401)
        .json({ errors: { error: { msg: 'Unauthorized access' } } });
    }
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
