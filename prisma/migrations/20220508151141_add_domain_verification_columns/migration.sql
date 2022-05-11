-- AlterTable
ALTER TABLE "domains" ADD COLUMN     "subdomain" TEXT,
ADD COLUMN     "value" TEXT,
ADD COLUMN     "verified" BOOLEAN DEFAULT true;
