import bcrypt from "bcryptjs";
import utilities from "../utilities/index.js";
import {
  registerAccount as registerAccModel,
  getAccountByEmail,
  updateAccount as updateAccountModel,
  updatePassword as updatePasswordModel,
} from "../models/account-model.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
/* ****************************************
 *  Deliver login view
 * *************************************** */
export async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process login request
 * ************************************ */
export async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}
/* ****************************************
 *  Deliver registration view
 * *************************************** */
export async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
export async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await registerAccModel(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Account Management View
 * *************************************** */
export async function buildManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Edit Account
 * *************************************** */
export async function buildEditAccount(req, res) {
  let nav = await utilities.getNav();
  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Update Account
 * *************************************** */
export async function updateAccount(req, res) {
  const { account_id, account_type } = res.locals.accountData;
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;
  const updateResult = await updateAccountModel(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  if (updateResult) {
    // res.locals.accountData = {
    //   ...res.locals.accountData,
    //   account_firstname,
    //   account_lastname,
    //   account_email,
    // };
    res.clearCookie("jwt");
    const accessToken = jwt.sign(
      {
        account_firstname,
        account_lastname,
        account_email,
        account_id,
        account_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 3600,
      }
    );
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
    res.locals.accountData.account_firstname = account_firstname;
    req.flash("notice", "Account updated successfully.");
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    return res.redirect(`/account/${account_id}`);
  }
}

/* ****************************************
 *  Update Password
 * *************************************** */
export async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id } = res.locals.accountData;
  const { account_password } = req.body;
  const hashedPassword = await bcrypt.hashSync(account_password, 10);
  const updateResult = await updatePasswordModel(account_id, hashedPassword);
  if (updateResult) {
    req.flash("notice", "Password updated successfully.");
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    return res.redirect("/account/");
  }
}

/* ****************************************
 *  Logout
 * *************************************** */
export async function logout(req, res) {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  let nav = await utilities.getNav();
  req.flash("notice", "You are now logged out.");
  res.status(200).render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}
