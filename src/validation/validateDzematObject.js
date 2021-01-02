const validateDzematObject = (dzematDataObject) => {
  const {
    name,
    adminName,
    adminEmail,
    adminPass,
    displayName,
  } = dzematDataObject;

  const dbName = name
    .trim()
    .replaceAll(' ', '___')
    .replaceAll('/', '---')
    .replaceAll('ž', 'z')
    .replaceAll('č', 'c')
    .replaceAll('ć', 'c')
    .replaceAll('š', 's')
    .replaceAll('đ', 'dj')
    .replaceAll('Ž', 'Z')
    .replaceAll('Č', 'C')
    .replaceAll('Ć', 'C')
    .replaceAll('Š', 'S')
    .replaceAll('Đ', 'Dj');

  const dbAdminName = adminName
    .trim()
    .replaceAll(' ', '___')
    .replaceAll('/', '---')
    .replaceAll('-', '--');

  return {
    dzemat: {
      name: dbName,
      admin: adminName,
      actions: [],
      displayName,
    },
    admin: {
      name: dbAdminName,
      email: adminEmail.trim(),
      password: adminPass,
      dzemat: dbName,
    },
  };
};

module.exports = {
  validateDzematObject,
};
