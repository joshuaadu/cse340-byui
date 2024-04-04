import {
  getInventoryByClassificationId,
  getInventoryById,
  addClassification,
  addInventory,
} from "../models/inventory-model.js";
import utilities from "../utilities/index.js";
import { getClassifications } from "../models/inventory-model.js";

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  console.log("classification_id", classification_id);
  const data = await getInventoryByClassificationId(classification_id);
  console.log(data);
  const grid = await utilities.buildClassificationGrid(data);
  console.log("Grid:", grid);
  let nav = await utilities.getNav();
  let retrunData = await getClassifications();
  let className = "No Classification Found";
  retrunData.rows.forEach((classification) => {
    console.log({ classification });
    if (classification.classification_id == classification_id) {
      className = classification.classification_name;
    }
  });
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

/* ***************************
 *  Build inventory home view
 * ************************** */
invCont.buildInventory = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Process new classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const result = await addClassification(classification_name);
  if (result.rowCount === 1) {
    req.flash(
      "notice",
      `${result.rows[0].classification_name} classification, added successfully.`
    );
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, there was an error adding the classification.");
    res.redirect("/inv/classification");
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  console.log("classificationList", classificationList);
  res.render("./inventory/inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationList,
  });
};
/* ***************************
 *  Process new vehicle
 * ************************** */
invCont.addInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_color,
    inv_price,
    inv_image,
    inv_description,
    inv_miles,
    inv_thumbnail,
    classification_id,
  } = req.body;
  const result = await addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_color,
    inv_price,
    inv_image,
    inv_description,
    inv_miles,
    inv_thumbnail,
    classification_id
  );
  console.log("result", result);
  if (result.rowCount === 1) {
    req.flash("notice", "Vehicle added successfully.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, there was an error adding the vehicle.");
    res.redirect("/inv/inventory");
  }
};

export default invCont;
