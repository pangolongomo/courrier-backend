const prisma = require("../prisma");

exports.findAll = () => {
  return prisma.origine.findMany({ orderBy: { libelle: "asc" } });
};

exports.create = async (libelle) => {
  return prisma.origine.create({
    data: { libelle },
  });
};

exports.findOrCreate = async (libelle) => {
  try {
    let origine = await prisma.origine.findFirst({ where: { libelle } });
    if (origine) return origine;

    return prisma.origine.create({ data: { libelle } });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("L'origine existe déjà");
    }
    throw error;
  }
};

exports.update = async (id, libelle) => {
  try {
    const existing = await prisma.origine.findUnique({ where: { id } });
    if (!existing) throw new Error("Origine non trouvée");

    // Check if another origine with same libelle exists
    const duplicate = await prisma.origine.findFirst({
      where: {
        libelle,
        id: { not: id },
      },
    });
    if (duplicate) throw new Error("L'origine existe déjà");

    return prisma.origine.update({
      where: { id },
      data: { libelle },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("L'origine existe déjà");
    }
    throw error;
  }
};
