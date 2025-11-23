/*
  Warnings:

  - You are about to drop the column `lu` on the `Courrier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Courrier" DROP COLUMN "lu";

-- CreateTable
CREATE TABLE "CourrierLu" (
    "id" TEXT NOT NULL,
    "courrierId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourrierLu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourrierLu_courrierId_userId_key" ON "CourrierLu"("courrierId", "userId");

-- AddForeignKey
ALTER TABLE "CourrierLu" ADD CONSTRAINT "CourrierLu_courrierId_fkey" FOREIGN KEY ("courrierId") REFERENCES "Courrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourrierLu" ADD CONSTRAINT "CourrierLu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
