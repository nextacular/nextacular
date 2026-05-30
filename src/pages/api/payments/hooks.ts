import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import type Stripe from 'stripe';

import stripe from '@/lib/server/stripe';
import prisma from '@/prisma/index';
import { updateSubscription } from '@/prisma/services/customer';

import type { SubscriptionType } from '@prisma/client';

export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const reqBuffer = await buffer(req);
  const signature = req.headers['stripe-signature'];

  if (!signature || Array.isArray(signature)) {
    return res.status(400).send('Webhook Error: Missing stripe-signature');
  }

  if (!process.env.PAYMENTS_SIGNING_SECRET) {
    return res
      .status(500)
      .send('Webhook Error: PAYMENTS_SIGNING_SECRET not configured');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature,
      process.env.PAYMENTS_SIGNING_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  const { metadata } = event.data.object as {
    metadata?: Record<string, string>;
  };

  switch (event.type) {
    case 'charge.succeeded':
      if (metadata?.customerId && metadata?.type) {
        await updateSubscription(
          metadata.customerId,
          metadata.type as SubscriptionType
        );
      }
      break;
    default:
      res.status(400).send(`Webhook Error: Unhandled event type ${event.type}`);
  }

  await prisma.$disconnect();
  res.status(200).send({ received: true });
};

export default handler;
