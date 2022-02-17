-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'STANDARD', 'PREMIUM');

-- AlterTable
ALTER TABLE "customerPayments" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionType" "SubscriptionType" NOT NULL DEFAULT E'FREE',
ADD COLUMN     "updatedAt" TIMESTAMP(3);
