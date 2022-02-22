/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,name]` on the table `domains` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "domains_workspaceId_name_key" ON "domains"("workspaceId", "name");
