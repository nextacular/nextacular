import Link from 'next/link';

import Actions from './actions';
import Menu from './menu';
import sidebarMenu from '../../config/menu/sidebar-static';
import { useWorkspaces } from '../../hooks/data';

const staticMenu = sidebarMenu();

const Sidebar = ({ menu }) => {
  const { data: workspaces, isLoading } = useWorkspaces();

  const renderMenu = () => {
    return menu.map((item, index) => (
      <Menu
        key={index}
        data={item}
        isLoading={isLoading}
        showMenu={workspaces?.length > 0 || isLoading}
      />
    ));
  };

  const renderStaticMenu = () => {
    return staticMenu.map((item, index) => (
      <Menu key={index} data={item} showMenu={true} />
    ));
  };

  return (
    <aside className="sticky flex flex-col w-1/4 h-screen space-y-5 overflow-y-auto text-white bg-gray-800 overscroll-contain">
      <div className="flex items-center justify-center p-5 text-center border-b border-b-gray-900">
        <Link href="/">
          <a className="flex-grow text-2xl font-bold">Nextacular</a>
        </Link>
      </div>
      <Actions workspaces={workspaces} />
      <div className="flex flex-col p-5 space-y-10">
        {renderStaticMenu()}
        {renderMenu()}
      </div>
    </aside>
  );
};

export default Sidebar;
