const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ArchiveService {
  static async getArchivedCourriers({
    page = 1,
    limit = 10,
    categorie,
    origineId,
    archivedById,
    search,
  }) {
    const skip = (page - 1) * limit;

    const where = {
      ...(categorie && { categorie }),
      ...(archivedById && { archivedById }),
      courrier: {
        ...(origineId && { origineId }),
        ...(search && {
          OR: [
            {
              objet: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              numero_courrier: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
    };

    const [total, rows] = await Promise.all([
      prisma.archiveCourrier.count({ where }),
      prisma.archiveCourrier.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          courrier: {
            include: {
              origine: true,
              type: true,
              creator: {
                select: { id: true, nom: true, prenom: true },
              },
              destinataire: {
                select: { id: true, nom: true, prenom: true },
              },
            },
          },
          archivedBy: {
            select: { id: true, nom: true, prenom: true },
          },
        },
      }),
    ]);

    return {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      rows,
    };
  }
}

module.exports = ArchiveService;
