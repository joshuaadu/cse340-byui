import express from "express";
import invController from "../controllers/invController.js";
const router = express.Router();
import utilities from "../utilities/index.js";
import inventoryValidate from "../utilities/inventory-validation.js";

// Route to Vehicle Management view
router.get("/", utilities.handleErrors(invController.buildInventory));

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory detail view
router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

// Route to add a new vehicle view
router.get(
  "/inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to process the new vehicle form
router.post(
  "/inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to add a new classification view
router.get(
  "/classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to process the new classification form
router.post(
  "/classification",
  inventoryValidate.classificationRules(),
  inventoryValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

export default router;
