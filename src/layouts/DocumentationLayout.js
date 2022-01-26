import Content from '../components/Content';
import Sidebar from '../components/Sidebar';

import documentationMenu from '../config/documentation-menu';

const AccountLayout = ({ children }) => {
  return (
    <main className="relative flex flex-row w-screen h-screen space-x-5 text-gray-800 bg-gray-50">
      <Sidebar menu={documentationMenu} hideActions />
      <Content>{children}</Content>
    </main>
  );
};

export default AccountLayout;
