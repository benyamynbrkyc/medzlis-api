const validateActionObject = (actionDataObject) => {
  const { name, dzemat, price, desc, imgURL } = actionDataObject;

  const dbName = name.trim().replaceAll(' ', '___').replaceAll('/', '---');
  const dbDzemat = dzemat.trim().replaceAll(' ', '___').replaceAll('/', '---');
  const priceToNum = Number(price);
  const dbDesc = desc.trim();

  return {
    name: dbName,
    dzemat: dbDzemat,
    price: priceToNum,
    desc: dbDesc,
    imgURL,
  };
};

module.exports = {
  validateActionObject,
};
