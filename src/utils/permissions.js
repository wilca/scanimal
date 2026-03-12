export const ROLES = {
  USUARIO: 'usuario',
  ANIMALISTA: 'animalista',
  ADMIN: 'administrador',
}

export const canManageAnimals = (role) =>
  [ROLES.ANIMALISTA, ROLES.ADMIN].includes(role)

export const canManageUsers = (role) => role === ROLES.ADMIN

export const canViewAnimals = (role) =>
  [ROLES.ANIMALISTA, ROLES.ADMIN].includes(role)

export const canRequestAdoption = () => true // all roles

export const canDeleteRecords = (role) =>
  [ROLES.ANIMALISTA, ROLES.ADMIN].includes(role)

export const canGeneratePDF = (role) =>
  [ROLES.ANIMALISTA, ROLES.ADMIN].includes(role)
