const menu = (workspaceId) => [
  {
    name: 'Workspace',
    menuItems: [
      {
        name: 'Home',
        path: `/account/${workspaceId}`,
      },
      {
        name: 'Integrations',
        path: `/account/${workspaceId}/integrations`,
      },
    ],
  },
  {
    name: 'Settings',
    menuItems: [
      {
        name: 'Workspace Information',
        path: `/account/${workspaceId}/settings/general`,
      },
      {
        name: 'Domain Configurations',
        path: `/account/${workspaceId}/settings/domain`,
      },
      {
        name: 'Team Management',
        path: `/account/${workspaceId}/settings/team`,
      },
      {
        name: 'Advanced',
        path: `/account/${workspaceId}/settings/advanced`,
      },
    ],
  },
];

export default menu;
