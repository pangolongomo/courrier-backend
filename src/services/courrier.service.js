const prisma = require("../prisma");

exports.findAll = () => {
  return prisma.courrier.findMany({
    include: {
      type: true,
      creator: true,
      reponses: true,
      origine: true,
      destinataire: true,
      annotations: {
        include: { auteur: true },
        orderBy: { createdAt: "desc" }
      }
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
      origine: true,
      destinataire: true,
      annotations: {
        include: { auteur: true },
        orderBy: { createdAt: "desc" }
      }
    },
  });
};

exports.findByUser = (userId) => {
  return prisma.courrier.findMany({
    where: { destinataire: { id: userId } },
    include: {
      type: true,
      creator: true,
      reponses: true,
      origine: true,
      destinataire: true,
      annotations: {
        include: { auteur: true },
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.create = async ({ origineId, origineText, objet, date_signature, fichier_joint, typeId, destUserId, creatorId }) => {
  try {
    // Vérification destinataire
    const destUser = await prisma.user.findUnique({
      where: { id: destUserId },
      include: { role: true }
    });

    if (!destUser) throw new Error("Le destinataire n'existe pas");

    const rolesAutorises = ["ministre", "dircab", "conseiller", "secab"];
    if (!rolesAutorises.includes(destUser.role.libelle)) {
      throw new Error(`Le destinataire doit être Ministre, Dircab ou Conseiller`);
    }

    // Gestion de l'origine
    let origineIdToUse = origineId;

    if (!origineId && origineText) {
      const newOrigine = await prisma.origine.create({
        data: { libelle: origineText }
      });
      origineIdToUse = newOrigine.id;
    }

    if (!origineIdToUse) throw new Error("Vous devez choisir une origine ou en ajouter une.");

    // Génération numéro_courrier sécurisé
    const year = new Date().getFullYear();
    const lastCourrier = await prisma.courrier.findFirst({
      where: { createdAt: { gte: new Date(`${year}-01-01`) } },
      orderBy: { createdAt: "desc" },
    });

    let nextNumber = 1;
    if (lastCourrier) {
      const match = lastCourrier.numero_courrier.match(/^(\d{4})\//);
      if (match) nextNumber = parseInt(match[1], 10) + 1;
    }

    const compteurFormate = String(nextNumber).padStart(4, "0");
    const numero_courrier = `${compteurFormate}/MD-MDNAC/CAB/NMCE/${year}`;

    // Création courrier
    const newCourrier = await prisma.courrier.create({
      data: {
        numero_courrier,
        origine: { connect: { id: origineIdToUse } },
        objet,
        date_signature: date_signature ? new Date(date_signature) : null,
        fichier_joint,
        type: { connect: { id: typeId } },
        creator: { connect: { id: creatorId } },
        destinataire: { connect: { id: destUserId } }
      },
      include: { origine: true }
    });

   
    await prisma.notification.create({
      data: {
        message: `Vous avez reçu un courrier provenant de ${newCourrier.origine.libelle} pour l'objet: ${objet}`,
        user: { connect: { id: destUserId } },
      },
    });

    return newCourrier;

  } catch (err) {
    console.error("Erreur dans create courrier:", err);
    throw err;
  }
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
