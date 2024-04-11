import express from "express";
import invController from "../controllers/invController.js";
const router = express.Router();
import utilities from "../utilities/index.js";
import inventoryValidate from "../utilities/inventory-validation.js";

// Route to Vehicle Management view
router.get(
  "/",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
);

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to get inventory by classification JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);

// Route to build inventory detail view
router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

// Route to add a new vehicle view
router.get(
  "/inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Route to delete a vehicle view
router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventory)
);

// Route to delete a vehicle
router.post(
  "/delete",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);

// Route to process the new vehicle form
router.post(
  "/inventory",
  utilities.checkAccountType,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to process the update vehicle form
router.post(
  "/update/",
  utilities.checkAccountType,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to add a new classification view
router.get(
  "/classification",
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to process the new classification form
router.post(
  "/classification",
  utilities.checkAccountType,
  inventoryValidate.classificationRules(),
  inventoryValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

export default router;
