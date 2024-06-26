import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { getClassifications } from "../models/inventory-model.js";
config();

const Util = {};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await getClassifications();
  //   console.log(data);
  let list =
    '<ul id="nav-list" class="flex text-white justify-center items-center">';
  list +=
    '<li class="flex-1 text-center"><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li class="flex-1 text-center">';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display" >';
    data.forEach((vehicle) => {
      grid += "<li id='classification-card'>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetail = async function (data) {
  let details = '<div id="inv-detail-display">';
  details +=
    '<img src="' +
    data.inv_image +
    '" alt="Image of ' +
    data.inv_make +
    " " +
    data.inv_model +
    ' on CSE Motors" />';
  details += '<div class="inv-details">';
  details +=
    "<h2><strong>" +
    data.inv_make +
    " " +
    data.inv_model +
    " Details" +
    "</strong></h2>";
  details += "<ul>";
  details +=
    "<li><strong>Price: $" +
    new Intl.NumberFormat("en-US").format(data.inv_price) +
    "</strong></li>";
  details +=
    "<li><strong>Description: </strong>" + data.inv_description + "</li>";
  details += "<li><strong>Color:</strong> " + data.inv_color + "</li>";
  details +=
    "<li><strong>Miles:</strong> " +
    new Intl.NumberFormat("en-US").format(data.inv_miles) +
    "</li>";
  details += "<li><strong>Likes:</strong> " + data.inv_likes + "</li>";
  details += "</ul>";
  details += "</div>";
  details += "</div>";
  return details;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await getClassifications();
  let classificationList =
    '<select name="classification_id" id="classification_id" required >';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Admin
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin) {
    const accountType = res.locals.accountData.account_type;
    if (accountType === "Employee" || accountType === "Admin") {
      next();
    } else {
      req.flash("notice", "You do not have permission to access this page");
      return res.redirect("/account/login");
    }
  } else {
    req.flash("notice", "Please log in");
    return res.redirect("/account/login");
  }
};

export default Util;
