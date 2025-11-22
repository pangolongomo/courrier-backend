const prisma = require("../prisma");

exports.create = async ({ contenu, priorite, courrierId, auteurId }) => {
  return await prisma.annotation.create({
    data: {
      contenu,
      priorite,
      courrierId,
      auteurId,
    },
  });
};

exports.findByCourrier = async (courrierId) => {
  return await prisma.annotation.findMany({
    where: { courrierId },
    include: { auteur: true },
    orderBy: { createdAt: "desc" },
  });
};
