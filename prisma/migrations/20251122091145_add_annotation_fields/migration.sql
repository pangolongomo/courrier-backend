-- CreateTable
CREATE TABLE "Annotation" (
    "id" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "priorite" TEXT NOT NULL,
    "courrierId" TEXT NOT NULL,
    "auteurId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_courrierId_fkey" FOREIGN KEY ("courrierId") REFERENCES "Courrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
