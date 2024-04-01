import {
  getInventoryByClassificationId,
  getInventoryById,
} from "../models/inventory-model.js";
import utilities from "../utilities/index.js";

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  const id = req.params.id;
  const data = await getInventoryById(id);
  let nav = await utilities.getNav();
  const details = await utilities.buildDetail(data);
  res.render("./inventory/detail", {
    title: data.inv_year + " " + data.inv_make + " " + data.inv_model,
    nav,
    details,
    errors: null,
  });
};
export default invCont;
