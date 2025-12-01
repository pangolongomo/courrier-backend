const prisma = require("../prisma");

exports.findAll = () => {
  return prisma.reponseCourrier.findMany({
    include: {
      courrier: true,
      responder: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.findById = (id) => {
  return prisma.reponseCourrier.findUnique({
    where: { id },
    include: {
      courrier: true,
      responder: true,
    },
  });
};

exports.create = async ({ date_signature, fichier_joint, courrierId, responderId, objet }) => {
  // Créer la réponse
  const reponse = await prisma.reponseCourrier.create({
    data: {
      date_signature,
      fichier_joint,
      objet,
      courrier: { connect: { id: courrierId } },
      responder: { connect: { id: responderId } },
    },
  });

  // Créer une notification pour le créateur du courrier original
  const originalCourrier = await prisma.courrier.findUnique({
    where: { id: courrierId },
    include: { creator: true },
  });

  if (originalCourrier) {
    await prisma.notification.create({
      data: {
        message: `Une réponse a été ajoutée au courrier "${originalCourrier.objet}"`,
        user: { connect: { id: originalCourrier.creatorId } },
      },
    });
  }

  return reponse;
};

exports.update = (id, data) => {
  return prisma.reponseCourrier.update({
    where: { id },
    data,
  });
};

exports.remove = async (id) => {
  try {
    await prisma.reponseCourrier.delete({ where: { id } });
    return true;
  } catch (err) {
    return false;
  }
};
