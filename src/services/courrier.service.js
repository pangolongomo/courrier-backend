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
  const courrier = await prisma.courrier.create({
    data: {
      origine,
      objet,
      date_signature: date_signature ? new Date(date_signature) : null,
      fichier_joint,
      type: { connect: { id: typeId } },
      creator: { connect: { id: creatorId } },
    },
  });

  await prisma.notification.create({
    data: {
      message: "Vous avez un courrier qui a été déposé dans votre boîte",
      user: { connect: { id: destUserId } },
    },
  });

  return courrier;
};


exports.update = async (id, data) => {
  const updateData = { ...data };

  
  if (updateData.date_signature) {
    updateData.date_signature = new Date(updateData.date_signature);
  }

  
  if (updateData.typeId) {
    updateData.type = { connect: { id: updateData.typeId } };
    delete updateData.typeId; 
  }


  if (updateData.destUserId) delete updateData.destUserId;

  return prisma.courrier.update({
    where: { id },
    data: updateData,
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
