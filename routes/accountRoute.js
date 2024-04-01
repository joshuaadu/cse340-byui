import express from "express";
import {
  buildLogin,
  buildRegister,
  registerAccount,
} from "../controllers/accountController.js";
const router = express.Router();
import utilities from "../utilities/index.js";
import regValidate from "../utilities/account-validation.js";

router.get("/login", utilities.handleErrors(buildLogin));
router.get("/register", utilities.handleErrors(buildRegister));
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(registerAccount)
);
export default router;
