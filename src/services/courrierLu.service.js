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
  // 1. Récupérer tous les utilisateurs
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
    },
  });

  // 2. Récupérer les lectures existantes pour ce courrier
  const reads = await prisma.courrierLu.findMany({
    where: { courrierId },
    select: {
      userId: true,
      lu: true,
    },
  });

  // 3. Fusionner les deux pour retourner lu: false si pas encore lu
  const result = allUsers.map(user => {
    const readEntry = reads.find(r => r.userId === user.id);
    return {
      ...user,
      lu: readEntry ? readEntry.lu : false,
    };
  });

  return result;
};

