/*
  Warnings:

  - A unique constraint covering the columns `[numero_courrier]` on the table `Courrier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `destUserId` to the `Courrier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero_courrier` to the `Courrier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courrier" ADD COLUMN     "destUserId" TEXT NOT NULL,
ADD COLUMN     "numero_courrier" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Courrier_numero_courrier_key" ON "Courrier"("numero_courrier");

-- AddForeignKey
ALTER TABLE "Courrier" ADD CONSTRAINT "Courrier_destUserId_fkey" FOREIGN KEY ("destUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
