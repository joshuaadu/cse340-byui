import { getClassifications } from "../models/inventory-model.js";

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
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
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
  details += "</ul>";
  details += "</div>";
  details += "</div>";
  return details;
};


export default Util;
