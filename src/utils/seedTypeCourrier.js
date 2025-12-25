const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedTypeCourrier() {
  const types = ["Courrier entrant", "Courrier sortant"];

  for (const libelle of types) {
    const exists = await prisma.typeCourrier.findFirst({
      where: { libelle }
    });

    if (!exists) {
      await prisma.typeCourrier.create({
        data: { libelle }
      });
      console.log(`Type de courrier créé : ${libelle}`);
    } else {
      console.log(`Type de courrier déjà existant : ${libelle}`);
    }
  }
}

module.exports = seedTypeCourrier;
