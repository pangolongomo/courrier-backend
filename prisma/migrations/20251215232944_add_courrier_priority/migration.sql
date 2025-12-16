-- CreateEnum
CREATE TYPE "PrioriteCourrier" AS ENUM ('NORMAL', 'URGENT', 'TRES_URGENT', 'CONFIDENTIEL');

-- AlterTable
ALTER TABLE "Courrier" ADD COLUMN     "priorite" "PrioriteCourrier" NOT NULL DEFAULT 'NORMAL';
