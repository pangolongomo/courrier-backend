const prisma = require("../prisma");

exports.findAll = async (userId) => {
  const courriers = await prisma.courrier.findMany({
    include: {
      type: true,
      creator: true,
      reponses: true,
      origine: true,
      destinataire: true,
      annotations: {
        include: { auteur: true },
        orderBy: { createdAt: "desc" }
      },
      courriersLu: {
        where: { userId }, // on récupère juste l'état de lecture pour cet utilisateur
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return courriers.map(c => ({
    ...c,
    estLu: c.courriersLu.length > 0 ? c.courriersLu[0].lu : false
  }));
};

exports.findById = async (id, userId) => {
  const courrier = await prisma.courrier.findUnique({
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
      },
      courriersLu: {
        where: { userId },
      },
    },
  });

  if (!courrier) return null;

  return {
    ...courrier,
    estLu: courrier.courriersLu.length > 0 ? courrier.courriersLu[0].lu : false
  };
};

exports.findByUser = async (userId) => {
  const courriers = await prisma.courrier.findMany({
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
      },
      courriersLu: {
        where: { userId },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return courriers.map(c => ({
    ...c,
    estLu: c.courriersLu.length > 0 ? c.courriersLu[0].lu : false
  }));
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

    const statutInitial = await prisma.statutCourrier.findUnique({
      where: { libelle: 'Non assigné' }
    });

    if (!statutInitial) throw new Error("Statut 'Non assigné' manquant dans la base.");

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
        destinataire: { connect: { id: destUserId } },
        statut: { connect: { id: statutInitial.id } }
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
  try {

    const updateData = { ...data };

    if (updateData.date_signature) {
      updateData.date_signature = new Date(updateData.date_signature);
    }

  
    if (updateData.typeId) {
      updateData.type = { connect: { id: updateData.typeId } };
      delete updateData.typeId;
    }

    
    if (updateData.origineText) {

      const newOrigine = await prisma.origine.create({
        data: { libelle: updateData.origineText },
      });

      updateData.origine = { connect: { id: newOrigine.id } };
      delete updateData.origineText;
      delete updateData.origineId;

    } else if (updateData.origineId) {
      updateData.origine = { connect: { id: updateData.origineId } };
      delete updateData.origineId;
    }

    
    if (updateData.statutLibelle) {
      const statut = await prisma.statutCourrier.findUnique({
        where: { libelle: updateData.statutLibelle },
      });

      if (!statut) throw new Error(`Statut '${updateData.statutLibelle}' not found`);

      updateData.statut = { connect: { id: statut.id } };
      delete updateData.statutLibelle;
    }


    
    if (updateData.destUserId) {

      const newDest = await prisma.user.findUnique({
        where: { id: updateData.destUserId },
        include: { role: true }
      });

      if (!newDest) throw new Error("Le destinataire n'existe pas");

      const rolesAutorises = ["ministre", "dircab", "conseiller", "secab"];
      if (!rolesAutorises.includes(newDest.role.libelle)) {
        throw new Error(`Le destinataire doit être Ministre, Dircab ou Conseiller`);
      }

      updateData.destinataire = { connect: { id: updateData.destUserId } };
      delete updateData.destUserId;
    }


    const result = await prisma.courrier.update({
      where: { id },
      data: updateData,
      include: { origine: true, type: true, destinataire: true },
    });


    if (data.destUserId) {
      await prisma.notification.create({
        data: {
          message: `Vous venez de recevoir un courrier modifié`,
          user: { connect: { id: data.destUserId } },
        },
      });
    }

    return result;

  } catch (err) {
    throw err;
  }
};

exports.remove = async (id) => {
  try {
    await prisma.courrier.delete({ where: { id } });
    return true;
  } catch (err) {
    return false;
  }
};
