const bcrypt = require("bcrypt");
const prisma = require("../prisma");


exports.findAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      nom: true,
      prenom: true,
      telephone: true,
      email: true,
      role: {
        select: { libelle: true }
      },
      createdAt: true,
      updatedAt: true
    }
  });
};

exports.findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nom: true,
      prenom: true,
      telephone: true,
      email: true,
      role: {
        select: { libelle: true, id: true }
      },
      createdAt: true,
      updatedAt: true
    }
  });
};

exports.findUsersByRoles = async (roles = ["ministre", "dircab", "conseiller", "secab"]) => {
  return prisma.user.findMany({
    where: {
      role: {
        libelle: { in: roles }
      }
    },
    select: {
      id: true,
      nom: true,
      prenom: true,
      telephone: true,
      email: true,
      role: { select: { libelle: true } },
      createdAt: true,
      updatedAt: true
    }
  });
};


exports.createNewUser = async (data) => {
  // data: { nom, prenom, telephone, email, password, roleId OR roleLibelle }
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new Error("Email déjà utilisé");

  const hashed = await bcrypt.hash(data.password, 10);

  // trouver role
  let roleId = data.roleId;
  if (!roleId) {
    if (data.roleLibelle) {
      const role = await prisma.role.findUnique({ where: { libelle: data.roleLibelle } });
      if (!role) throw new Error(`Role '${data.roleLibelle}' introuvable`);
      roleId = role.id;
    } else {
      // fallback : receptionniste
      const defaultRole = await prisma.role.findUnique({ where: { libelle: "receptionniste" } });
      if (!defaultRole) throw new Error("Role par défaut 'receptionniste' introuvable. Créez-le d'abord.");
      roleId = defaultRole.id;
    }
  }

  const user = await prisma.user.create({
    data: {
      nom: data.nom,
      prenom: data.prenom || null,
      telephone: data.telephone || null,
      email: data.email,
      password: hashed,
      role: { connect: { id: roleId } }
    },
    select: {
      id: true, nom: true, prenom: true, email: true,
      role: { select: { libelle: true } },
      createdAt: true
    }
  });

  return user;
};

exports.updateUserById = async (id, data) => {

  const updateData = { ...data };

  
  if (data.password) {
    try {
      updateData.password = await bcrypt.hash(data.password, 10);
     
    } catch (e) {
      console.error("Erreur hashage password :", e);
    }
  }

  
  if (data.roleLibelle) {
    const role = await prisma.role.findUnique({ where: { libelle: data.roleLibelle } });

    if (!role) {
      throw new Error(`Role '${data.roleLibelle}' introuvable`);
    }

    updateData.role = { connect: { id: role.id } };
    delete updateData.roleLibelle;
  }

  

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, nom: true, prenom: true, email: true, role: { select: { libelle: true } } }
    });
    return user;
  } catch (err) {
    console.error("Erreur Prisma Update :", err);
    return null;
  }
};


exports.deleteUserById = async (id) => {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch (err) {
    return false;
  }
};
