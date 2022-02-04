import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

import Content from '../components/Content';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import menu from '../config/menu';
import { useWorkspace } from '../providers/Workspace';

const AccountLayout = ({ children }) => {
  const { data } = useSession();
  const router = useRouter();
  const { workspace } = useWorkspace();

  useEffect(() => {
    if (!data) {
      router.replace('/auth/login');
    }
  }, [data, router]);

  return (
    <main className="relative flex flex-row w-screen h-screen space-x-5 text-gray-800 bg-gray-50">
      <Sidebar menu={menu(workspace?.slug)} />
      <Content>
        <Toaster position="bottom-left" toastOptions={{ duration: 10000 }} />
        <Header />
        {children}
      </Content>
    </main>
  );
};

export default AccountLayout;
