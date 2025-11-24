-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "courrierId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_courrierId_fkey" FOREIGN KEY ("courrierId") REFERENCES "Courrier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
