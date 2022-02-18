/*
  Warnings:

  - You are about to drop the column `userId` on the `members` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "InvitationStatus" ADD VALUE 'DECLINED';

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_userId_fkey";

-- AlterTable
ALTER TABLE "members" DROP COLUMN "userId",
ADD COLUMN     "invitedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "joinedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
