'use client';

import { useTranslations } from 'next-intl';

import type { SidebarMenuSection } from '@/config/menu/sidebar-static';

import Item from './item';

type MenuProps = {
  data: SidebarMenuSection;
  isLoading?: boolean;
  showMenu?: boolean;
};

const Menu = ({ data, isLoading = false, showMenu = false }: MenuProps) => {
  const t = useTranslations();

  if (!showMenu) return null;

  return (
    <div className="space-y-2">
      <h5 className="text-sm font-bold text-gray-400">{t(data.name)}</h5>
      <ul className="ml-5 leading-10">
        {data.menuItems.map((entry, index) => (
          <Item key={index} data={entry} isLoading={isLoading} />
        ))}
      </ul>
    </div>
  );
};

export default Menu;
