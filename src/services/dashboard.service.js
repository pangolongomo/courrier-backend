const prisma = require("../prisma");

/**
 * Statistiques globales pour l'utilisateur connecté
 */
exports.getCourrierStats = async (userId) => {
  // Comptage par statut
  const totalTraites = await prisma.courrier.count({
    where: { destinataire: { id: userId }, statut: { libelle: "Validé" } }
  });

  const totalRejetes = await prisma.courrier.count({
    where: { destinataire: { id: userId }, statut: { libelle: "Rejeté" } }
  });

  const totalEnCours = await prisma.courrier.count({
    where: { destinataire: { id: userId }, statut: { libelle: "En cours de traitement" } }
  });

  // Lu/non lu
  const totalLu = await prisma.courrierLu.count({
    where: { userId, lu: true }
  });

  const totalNonLu = await prisma.courrierLu.count({
    where: { userId, lu: false }
  });

  return {
    totalTraites,
    totalRejetes,
    totalEnCours,
    totalLu,
    totalNonLu
  };
};

/**
 * Liste des agents ayant des dossiers en cours (statut "En cours de traitement")
 */
exports.getAgentsEnCours = async () => {
  const agents = await prisma.user.findMany({
    where: {
      courriersDestines: {
        some: { statut: { libelle: "En cours de traitement" } }
      }
    },
    select: {
      id: true,
      nom: true,
      prenom: true,
      courriersDestines: {
        where: { statut: { libelle: "En cours de traitement" } },
        select: { id: true }
      }
    }
  });

  return agents.map(a => ({
    id: a.id,
    nom: a.nom,
    prenom: a.prenom,
    dossiersEnCours: a.courriersDestines.length
  }));
};

/**
 * Liste des dossiers en cours pour un agent spécifique
 */
exports.getDossiersAgent = async (agentId) => {
  const courriers = await prisma.courrier.findMany({
    where: { destUserId: agentId, statut: { libelle: "En cours de traitement" } },
    include: {
      type: true,
      creator: true,
      reponses: true,
      origine: true,
      annotations: { include: { auteur: true } },
      courriersLu: true
    },
    orderBy: { createdAt: "desc" }
  });

  return courriers.map(c => ({
    ...c,
    estLu: c.courriersLu.length > 0 ? c.courriersLu[0].lu : false
  }));
};

exports.getGlobalCourrierTotals = async () => {
  const [totalEntrant, totalSortant] = await Promise.all([
    prisma.courrier.count({
      where: {
        type: { libelle: "Courrier entrant" }
      }
    }),
    prisma.courrier.count({
      where: {
        type: { libelle: "Courrier sortant" }
      }
    })
  ]);

  return {
    totalCourrierEntrant: totalEntrant,
    totalCourrierSortant: totalSortant,
    totalCourrier: totalEntrant + totalSortant
  };
};


exports.getGlobalCourrierStatuts = async () => {
  const [valides, rejetes, enCours] = await Promise.all([
    prisma.courrier.count({
      where: {
        statut: { libelle: "Validé" }
      }
    }),
    prisma.courrier.count({
      where: {
        statut: { libelle: "Rejeté" }
      }
    }),
    prisma.courrier.count({
      where: {
        statut: { libelle: "En cours de traitement" }
      }
    })
  ]);

  return {
    totalCourrierValide: valides,
    totalCourrierRejete: rejetes,
    totalCourrierEnCours: enCours
  };
};

exports.getCourrierTraiteParDestinataire = async () => {
  const users = await prisma.user.findMany({
    where: {
      courriersDestines: {
        some: {} 
      }
    },
    select: {
      id: true,
      nom: true,
      prenom: true,
      courriersDestines: {
        select: {
          statut: {
            select: { libelle: true }
          }
        }
      }
    }
  });

  return users.map((user) => {
    let totalTraites = 0;
    let totalNonTraites = 0;

    user.courriersDestines.forEach((courrier) => {
      if (["Validé", "Rejeté"].includes(courrier.statut?.libelle)) {
        totalTraites++;
      } else if (courrier.statut?.libelle === "En cours de traitement") {
        totalNonTraites++;
      }
    });

    return {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      totalTraites,
      totalNonTraites
    };
  });
};
