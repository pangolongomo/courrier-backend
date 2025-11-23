const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedStatutsCourrier() {
  const statuts = [
    'Non assigné',
    'En cours de traitement',
    'Validé',
    'Rejeté'
  ];

  for (const libelle of statuts) {
    const exists = await prisma.statutCourrier.findUnique({ where: { libelle } });
    if (!exists) {
      await prisma.statutCourrier.create({ data: { libelle } });
      console.log(`Statut créé : ${libelle}`);
    } else {
      console.log(`Statut déjà existant : ${libelle}`);
    }
  }
}

module.exports = seedStatutsCourrier;
