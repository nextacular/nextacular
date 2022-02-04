const sidebarMenu = () => [
  {
    name: 'Account',
    menuItems: [
      {
        name: 'Dashboard',
        path: `/account`,
      },
      {
        name: 'Billing',
        path: `/account/billing`,
      },
      {
        name: 'Settings',
        path: `/account/settings`,
      },
    ],
  },
];

export default sidebarMenu;
