import utilities from "../utilities/index.js";
const baseController = {};

baseController.buildHome = async function (req, res) {
  // const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

export default baseController;
