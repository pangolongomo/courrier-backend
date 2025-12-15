-- CreateEnum
CREATE TYPE "ArchiveCategorie" AS ENUM ('TRAITE', 'CLASSE_SANS_SUITE');

-- CreateTable
CREATE TABLE "ArchiveCourrier" (
    "id" TEXT NOT NULL,
    "categorie" "ArchiveCategorie" NOT NULL,
    "commentaire" TEXT,
    "courrierId" TEXT NOT NULL,
    "archivedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchiveCourrier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArchiveCourrier_courrierId_key" ON "ArchiveCourrier"("courrierId");

-- AddForeignKey
ALTER TABLE "ArchiveCourrier" ADD CONSTRAINT "ArchiveCourrier_courrierId_fkey" FOREIGN KEY ("courrierId") REFERENCES "Courrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchiveCourrier" ADD CONSTRAINT "ArchiveCourrier_archivedById_fkey" FOREIGN KEY ("archivedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
