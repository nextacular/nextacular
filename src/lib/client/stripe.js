import { loadStripe } from '@stripe/stripe-js';

export const redirectToCheckout = async (sessionId) => {
  const clientStripe = await loadStripe(
    process.env.NEXT_PUBLIC_PUBLISHABLE_KEY
  );
  await clientStripe.redirectToCheckout({ sessionId });
};
