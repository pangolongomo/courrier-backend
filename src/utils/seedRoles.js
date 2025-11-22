const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRoles() {
  const roles = ['receptionniste', 'conseiller', 'dircab', 'ministre', 'secab', 'admin'];

  for (const libelle of roles) {
    const exists = await prisma.role.findUnique({ where: { libelle } });
    if (!exists) {
      await prisma.role.create({ data: { libelle } });
      console.log(`Rôle créé : ${libelle}`);
    } else {
      console.log(`Rôle déjà existant : ${libelle}`);
    }
  }
}

module.exports = seedRoles;
