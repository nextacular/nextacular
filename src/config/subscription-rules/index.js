import { SubscriptionType } from '@prisma/client';

export default {
  [SubscriptionType.FREE]: {
    customDomains: 1,
    members: 1,
    workspaces: 1,
  },
  [SubscriptionType.STANDARD]: {
    customDomains: 3,
    members: 5,
    workspaces: 5,
  },
  [SubscriptionType.PREMIUM]: {
    customDomains: 5,
    members: 10,
    workspaces: 10,
  },
};
