const validateDzematObject = (dzematDataObject) => {
  const { name } = actionDataObject;

  const dbName = name.trim().replaceAll(' ', '___').replaceAll('/', '---');

  return {
    name: dbName,
  };
};

module.exports = {
  validateActionObject,
};
