import express from "express";
import {
  buildLogin,
  buildRegister,
  registerAccount,
} from "../controllers/accountController.js";
const router = express.Router();
import utilities from "../utilities/index.js";
import accountValidate from "../utilities/account-validation.js";

router.get("/login", utilities.handleErrors(buildLogin));
router.get("/register", utilities.handleErrors(buildRegister));
// Process the registration data
router.post(
  "/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(registerAccount)
);

export default router;
