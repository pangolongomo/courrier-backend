const prisma = require('../prisma');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt.util');

module.exports.register = async ({ email, password, nom, prenom, telephone, roleLibelle }) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('Email already in use');

  
  const roleLabel = roleLibelle || 'receptionniste';
  const role = await prisma.role.findUnique({ where: { libelle: roleLabel } });
  if (!role) throw new Error(`Role '${roleLabel}' not found`);

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      nom,
      prenom,
      telephone,
      role: { connect: { id: role.id } }
    }
  });

  return {
    id: user.id,
    email: user.email,
    nom: user.nom,
    prenom: user.prenom,
    token: signToken({ userId: user.id, role: role.libelle })
  };
};

module.exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  
  const role = await prisma.role.findUnique({ where: { id: user.roleId } });

  return {
    token: signToken({ userId: user.id, role: role ? role.libelle : null }),
    user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom }
  };
};
