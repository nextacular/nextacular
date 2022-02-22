/*
  Warnings:

  - You are about to drop the column `domain` on the `domains` table. All the data in the column will be lost.
  - Added the required column `name` to the `domains` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "domains" DROP COLUMN "domain",
ADD COLUMN     "name" TEXT NOT NULL;
