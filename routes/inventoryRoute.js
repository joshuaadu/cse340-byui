import express from "express";
import invController from "../controllers/invController.js";
const router = express.Router();
import utilities from "../utilities/index.js";

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory detail view
router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

export default router;
