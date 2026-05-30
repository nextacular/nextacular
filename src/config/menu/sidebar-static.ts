export type SidebarMenuItem = {
  name: string;
  path: string;
};

export type SidebarMenuSection = {
  name: string;
  menuItems: SidebarMenuItem[];
};

const sidebarMenu = (): SidebarMenuSection[] => [
  {
    name: 'Account',
    menuItems: [
      {
        name: 'common.label.dashboard',
        path: `/account`,
      },
      {
        name: 'common.label.billing',
        path: `/account/billing`,
      },
      {
        name: 'common.label.settings',
        path: `/account/settings`,
      },
    ],
  },
];

export default sidebarMenu;
