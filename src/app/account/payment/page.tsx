import type { Metadata } from 'next';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Nextacular - Subscription Status',
};

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

const PaymentPage = async ({ searchParams }: PageProps) => {
  const { status } = await searchParams;
  const success = status === 'success';

  return (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10 text-gray-800 bg-gray-50">
      <Toaster position="bottom-center" toastOptions={{ duration: 10000 }} />
      <div className="w-full py-5">
        <div className="relative flex flex-col mx-auto space-y-5">
          <div className="flex flex-col items-center justify-center pt-10 pb-5 mx-auto">
            <h1 className="text-5xl font-bold text-center">
              <span className="block">Subscription Purchase:</span>
              <span
                className={`block ${success ? 'text-green-600' : 'text-red-600'}`}
              >
                {success ? 'Success' : 'Cancelled'}
              </span>
            </h1>
            <p className="mt-5 text-center text-gray-600">
              {success
                ? 'Thank you for your purchase!'
                : 'You can come back to the billing page at a later time.'}
            </p>
          </div>
          <div className="flex flex-row items-center justify-center space-x-5">
            <Link
              href="/account/billing"
              className="px-10 py-3 text-white bg-blue-600 rounded shadow hover:bg-blue-500"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
