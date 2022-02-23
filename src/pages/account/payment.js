import Link from 'next/link';
import { useRouter } from 'next/router';

import { PublicLayout } from '@/layouts/index';

const Payment = () => {
  const { query } = useRouter();

  return (
    <PublicLayout>
      <div className="w-full py-5">
        <div className="relative flex flex-col mx-auto space-y-5">
          <div className="flex flex-col items-center justify-center pt-10 pb-5 mx-auto">
            <h1 className="text-5xl font-bold text-center">
              <span className="block">Subscription Purchase:</span>
              <span
                className={`block ${
                  query.status === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {query.status === 'success' ? 'Success' : 'Cancelled'}
              </span>
            </h1>
            <p className="mt-5 text-center text-gray-600">
              {query.status === 'success'
                ? 'Thank you for your purchase!'
                : 'You can come back to the billing page at a later time.'}
            </p>
          </div>
          <div className="flex flex-row items-center justify-center space-x-5">
            <Link href="/account/billing">
              <a className="px-10 py-3 text-white bg-blue-600 rounded shadow hover:bg-blue-500">
                Go Back
              </a>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Payment;
