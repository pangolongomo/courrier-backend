const prisma = require("../prisma");

exports.findAll = () => {
  return prisma.courrier.findMany({
    include: {
      type: true,
      creator: true,
      reponses: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.findById = (id) => {
  return prisma.courrier.findUnique({
    where: { id },
    include: {
      type: true,
      creator: true,
      reponses: true,
    },
  });
};

exports.create = async ({ origine, objet, date_signature, fichier_joint, typeId, destUserId, creatorId }) => {
  // Créer le courrier
  const courrier = await prisma.courrier.create({
    data: {
      origine,
      objet,
      date_signature,
      fichier_joint,
      type: { connect: { id: typeId } },
      creator: { connect: { id: creatorId } },
    },
  });

  // Créer la notification pour l'utilisateur destinataire
  await prisma.notification.create({
    data: {
      message: "Vous avez un courrier qui a été déposé dans votre boîte",
      user: { connect: { id: destUserId } },
    },
  });

  return courrier;
};

exports.update = (id, data) => {
  return prisma.courrier.update({
    where: { id },
    data,
  });
};

exports.remove = async (id) => {
  try {
    await prisma.courrier.delete({ where: { id } });
    return true;
  } catch (err) {
    return false;
  }
};
