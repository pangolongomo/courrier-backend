-- AlterTable
ALTER TABLE "Courrier" ADD COLUMN     "statutId" TEXT;

-- CreateTable
CREATE TABLE "StatutCourrier" (
    "id" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatutCourrier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StatutCourrier_libelle_key" ON "StatutCourrier"("libelle");

-- AddForeignKey
ALTER TABLE "Courrier" ADD CONSTRAINT "Courrier_statutId_fkey" FOREIGN KEY ("statutId") REFERENCES "StatutCourrier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
