const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


exports.markAsRead = async ({ courrierId, userId }) => {
  const existing = await prisma.courrierLu.findUnique({
    where: { courrierId_userId: { courrierId, userId } },
  });

  if (existing) {
    return prisma.courrierLu.update({
      where: { courrierId_userId: { courrierId, userId } },
      data: { lu: true },
    });
  } else {
    return prisma.courrierLu.create({
      data: { courrierId, userId, lu: true },
    });
  }
};


exports.getAllReadsForCourrier = async (courrierId) => {
  return prisma.courrierLu.findMany({
    where: { courrierId },
    include: { user: true },
  });
};
