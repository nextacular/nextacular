/*
  Warnings:

  - Added the required column `inviter` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "inviter" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_inviter_fkey" FOREIGN KEY ("inviter") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
