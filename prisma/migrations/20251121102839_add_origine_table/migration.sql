/*
  Warnings:

  - You are about to drop the column `origine` on the `Courrier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Courrier" DROP COLUMN "origine",
ADD COLUMN     "origineId" TEXT;

-- CreateTable
CREATE TABLE "Origine" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Origine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Origine_libelle_key" ON "Origine"("libelle");

-- AddForeignKey
ALTER TABLE "Courrier" ADD CONSTRAINT "Courrier_origineId_fkey" FOREIGN KEY ("origineId") REFERENCES "Origine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
