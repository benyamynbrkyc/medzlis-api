const validateActionObject = (actionDataObject) => {
  console.log('actionDataObject\n', actionDataObject);
  actionDataObject.displayName = actionDataObject.name;
  console.log(actionDataObject.name);
  actionDataObject.name
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
  actionDataObject.dzemat
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
  actionDataObject.price = Number(actionDataObject.price);
  actionDataObject.desc.trim();

  return actionDataObject;
};

module.exports = {
  validateActionObject
};
