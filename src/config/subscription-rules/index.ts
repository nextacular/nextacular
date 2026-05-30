import { SubscriptionType } from '@prisma/client';

export type SubscriptionRule = {
  customDomains: number;
  members: number;
  workspaces: number;
};

const rules: Record<SubscriptionType, SubscriptionRule> = {
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

export default rules;
