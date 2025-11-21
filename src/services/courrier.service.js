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

exports.findByUser = (userId) => {
  return prisma.courrier.findMany({
    where: { destinataire: { id: userId } },
    include: {
      type: true,
      creator: true,
      reponses: true,
    },
    orderBy: { createdAt: "desc" },
  });
};


// exports.create = async ({ origine, objet, date_signature, fichier_joint, typeId, destUserId, creatorId }) => {
//   try {
//     const destUser = await prisma.user.findUnique({
//       where: { id: destUserId },
//       include: { role: true }
//     });

//     if (!destUser) throw new Error("Le destinataire n'existe pas");

//     const rolesAutorises = ["ministre", "dircab", "conseiller"];
//     if (!rolesAutorises.includes(destUser.role.libelle)) {
//       throw new Error(`Le destinataire doit être Ministre, Dircab ou Conseiller`);
//     }

//     const year = new Date().getFullYear();
//     const count = await prisma.courrier.count();  
//     const compteurFormate = String(count + 1).padStart(4, '0');
//     const numero_courrier = `${compteurFormate}/MD-MDNAC/CAB/NMCE/${year}`;

//     const courrier = await prisma.courrier.create({
//       data: {
//         numero_courrier,
//         origine,
//         objet,
//         date_signature: date_signature ? new Date(date_signature) : null,
//         fichier_joint,
//         type: { connect: { id: typeId } },
//         creator: { connect: { id: creatorId } },
//         destinataire: { connect: { id: destUserId } } 
//       },
//     });

//     const notification = await prisma.notification.create({
//       data: {
//         message: `Vous avez reçu un courrier provenant de ${origine} pour l'objet: ${objet}`,
//         user: { connect: { id: destUserId } },
//       },
//     });


//     return courrier;

//   } catch (err) {
//     console.error("Erreur dans create courrier:", err);
//     throw err; 
//   }
// };

exports.create = async ({ origineId, origineText, objet, date_signature, fichier_joint, typeId, destUserId, creatorId }) => {
  try {
    // Vérification destinataire
    const destUser = await prisma.user.findUnique({
      where: { id: destUserId },
      include: { role: true }
    });

    if (!destUser) throw new Error("Le destinataire n'existe pas");

    const rolesAutorises = ["ministre", "dircab", "conseiller"];
    if (!rolesAutorises.includes(destUser.role.libelle)) {
      throw new Error(`Le destinataire doit être Ministre, Dircab ou Conseiller`);
    }

    // 🔎 Gestion de l'origine
    let origineIdToUse = origineId;

    if (!origineId && origineText) {
      const newOrigine = await prisma.origine.create({
        data: { libelle: origineText }
      });
      origineIdToUse = newOrigine.id;
    }

    // ⚠️ Si aucune info sur l'origine → erreur
    if (!origineIdToUse) throw new Error("Vous devez choisir une origine ou en ajouter une.");

    // Génération numéro courrier
    const year = new Date().getFullYear();
    const count = await prisma.courrier.count();
    const compteurFormate = String(count + 1).padStart(4, '0');
    const numero_courrier = `${compteurFormate}/MD-MDNAC/CAB/NMCE/${year}`;

    const courrier = await prisma.courrier.create({
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
        message: `Vous avez reçu un courrier provenant de ${courrier.origine.libelle} pour l'objet: ${objet}`,
        user: { connect: { id: destUserId } },
      },
    });

    return courrier;

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
