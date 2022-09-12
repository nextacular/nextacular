import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('light');

    if (status === 'authenticated') {
      router.push('/account');
    }
  }, [status, router]);

  if (status === 'loading') return <></>;
  return (
    <main className="relative flex flex-col items-center justify-center h-screen p-10 space-y-10">
      <Toaster position="bottom-center" toastOptions={{ duration: 10000 }} />
      {children}
    </main>
  );
};

export default AuthLayout;
