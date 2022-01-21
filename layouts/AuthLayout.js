import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

const AuthLayout = ({ children }) => {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      router.push('/account');
    }
  }, [data, router]);

  return (
    <main className="relative flex flex-col items-center justify-center h-screen space-y-10">
      <Toaster position="bottom-center" />
      {children}
    </main>
  );
};

export default AuthLayout;
