const prisma = require("../prisma");

exports.findAll = () => {
  return prisma.origine.findMany({ orderBy: { libelle: "asc" } });
};

exports.create = async (libelle) => {
  return prisma.origine.create({
    data: { libelle }
  });
};

exports.findOrCreate = async (libelle) => {
  let origine = await prisma.origine.findFirst({ where: { libelle } });
  if (origine) return origine;

  return prisma.origine.create({ data: { libelle } });
};
