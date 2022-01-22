import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Content from '../components/Content';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const AccountLayout = ({ children }) => {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      router.replace('/auth/login');
    }
  }, [data, router]);

  return (
    <main className="relative flex flex-row w-screen h-screen space-x-5 text-gray-800 bg-gray-50">
      <Sidebar />
      <Content>
        <Header />
        {children}
      </Content>
    </main>
  );
};

export default AccountLayout;
