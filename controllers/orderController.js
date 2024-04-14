
import utilities from "../utilities/index.js";
import { getClassifications } from "../models/order-model.js";

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  let retrunData = await getClassifications();
  let className = "No Classification Found";
  retrunData.rows.forEach((classification) => {
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
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Inventory",
    nav,
    errors: null,
    classificationList,
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
  if (result.rowCount === 1) {
    req.flash("notice", "Vehicle added successfully.");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, there was an error adding the vehicle.");
    res.redirect("/inv/inventory");
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await getInventoryByClassificationId(classification_id);
  console.log("invData", invData);
  if (invData[0]?.inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await getInventoryById(inv_id);
  let classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete inventory confirmation view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await getInventoryById(inv_id);
  let classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Process delete inventory
 * ************************** */
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_price, inv_year } = req.body;
  const result = await deleteInventory(inv_id);
  if (result) {
    req.flash("notice", "Vehicle deleted successfully.");
    res.redirect("/inv/");
  } else {
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

export default invCont;
