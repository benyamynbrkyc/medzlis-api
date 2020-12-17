const validateActionObject = (actionDataObject) => {
  const { name, dzemat, price, desc, imgURL } = actionDataObject;

  const noSpaceName = name.trim().replaceAll(' ', '_');
  const noSpaceDzemat = dzemat.trim().replaceAll(' ', '_');
  const priceToNum = Number(price);
  const descTrimmed = desc.trim();

  return {
    name: noSpaceName,
    dzemat: noSpaceDzemat,
    price: priceToNum,
    desc: descTrimmed,
    imgURL,
  };
};

module.exports = {
  validateActionObject,
};
