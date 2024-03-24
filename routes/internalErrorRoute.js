import express from "express";
const router = express.Router();
import utilities from "../utilities/index.js";
import internalErrorController from "../controllers/internalErrorController.js";

// Internal Error Route
router.get(
  "/",
  utilities.handleErrors(internalErrorController.buildInternalServerError)
);
export default router;
