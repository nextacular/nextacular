/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,email]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "members_email_key";

-- DropIndex
DROP INDEX "members_workspaceId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "members_workspaceId_email_key" ON "members"("workspaceId", "email");
