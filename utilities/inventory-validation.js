import utilities from "./index.js";
import { body, validationResult } from "express-validator";
import { checkExistingClassification } from "../models/inventory-model.js";

const validate = {};

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // classification is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .matches(/^[A-Za-z]+$/) // only letters
      .withMessage(
        "Please provide a classification name that must be alphabetic characters only."
      )
      .custom(async (classification_name) => {
        const classificationExists = await checkExistingClassification(
          classification_name
        );
        if (classificationExists) {
          throw new Error("Classification exists. Please use different name.");
        }
      }),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors,
    });
    return;
  } else {
    next();
  }
};

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .isAlpha()
      .withMessage(
        "Please provide a make that must be alphabetic characters only."
      ),
    // model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .isAlpha() // only letters
      .withMessage(
        "Please provide a model that must be alphabetic characters only."
      ),
    // year is required and must be number
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .custom((value) => {
        if (value < 1900 || value > new Date().getFullYear()) {
          throw new Error("Year must be a valid year.");
        }
        return true;
      })
      .withMessage("Please provide a year that must be numeric."),
    // price is required and must be number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .custom((value) => {
        if (value < 0) {
          throw new Error("Price must be a non-negative number.");
        }
        return true;
      })
      .withMessage("Please provide a price that must be numeric."),
    // color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .isAlpha() // only letters
      .withMessage(
        "Please provide a color that must be alphabetic characters only."
      ),
    // image is required and must be a valid path
    body("inv_image")
      .trim()
      .matches(/^\/[a-z0-9-.\/]+$/i) // starts with a / and contains alphanumeric characters, hyphens, dots, and slashes
      .notEmpty()
      .withMessage("Please provide a valid image URL."),

    // thumbnail is required and must be a valid path
    body("inv_thumbnail")
      .trim()
      .matches(/^\/[a-z0-9-.\/]+$/i) // starts with a / and contains alphanumeric characters, hyphens, dots, and slashes
      .notEmpty()
      .withMessage("Please provide a valid thumbnail URL."),
    // description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a description."),
    // miles is required and must be number
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .custom((value) => {
        if (value < 0) {
          throw new Error("Miles must be a non-negative number.");
        }
        return true;
      })
      .withMessage("Please provide miles that must be numeric."),

    // classification is required and must be number
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a classification that must be numeric."),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.render("./inventory/inventory", {
      title: "Add New Vehicle",
      nav,
      errors: errors,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_color,
      inv_price,
      inv_image,
      inv_description,
      inv_miles,
      inv_thumbnail,
    });
    return;
  } else {
    next();
  }
};

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */

validate.checkUpdateData = async (req, res, next) => {
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
    inv_id,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      errors: errors,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_color,
      inv_price,
      inv_image,
      inv_description,
      inv_miles,
      inv_thumbnail,
      inv_id,
    });
    return;
  } else {
    next();
  }
};

export default validate;
