import Link from 'next/link';
import { useTranslations } from 'next-intl';

import type { SidebarMenuItem } from '@/config/menu/sidebar-static';

type ItemProps = {
  data?: SidebarMenuItem | null;
  isLoading?: boolean;
};

const Item = ({ data = null, isLoading = false }: ItemProps) => {
  const t = useTranslations();

  if (isLoading || !data) {
    return <div className="h-6 mb-3 bg-gray-600 rounded animate-pulse" />;
  }

  return (
    <li>
      <Link href={data.path} className="text-gray-300 hover:text-white">
        {t(data.name)}
      </Link>
    </li>
  );
};

export default Item;
