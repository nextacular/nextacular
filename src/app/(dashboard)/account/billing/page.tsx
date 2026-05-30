import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import type Stripe from 'stripe';

import { authOptions } from '@/lib/server/auth';
import { getInvoices, getProducts } from '@/lib/server/stripe';
import { getPayment } from '@/prisma/services/customer';

import BillingClient from './billing-client';

export const metadata: Metadata = {
  title: 'Nextacular - Billing',
};

type ProductWithPrice = Stripe.Product & { prices?: Stripe.Price };

const BillingPage = async () => {
  const session = await getServerSession(authOptions);
  const customerPayment = session?.user?.email
    ? await getPayment(session.user.email)
    : null;
  const [invoices, products] = await Promise.all([
    customerPayment?.paymentId ? getInvoices(customerPayment.paymentId) : [],
    getProducts(),
  ]);

  return (
    <BillingClient
      invoices={(invoices ?? []) as Stripe.Invoice[]}
      products={(products ?? []) as ProductWithPrice[]}
    />
  );
};

export default BillingPage;
