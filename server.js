/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
import { config } from "dotenv";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import expressMessages from "express-messages";
import flash from "connect-flash";
import connect from "connect-pg-simple";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { pool } from "./database/index.js";
import staticRouter from "./routes/static.js";
import baseController from "./controllers/baseController.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import accountRoute from "./routes/accountRoute.js";
import internalErrorRoute from "./routes/internalErrorRoute.js";
import utilities from "./utilities/index.js";

config();

const app = express();

app.use(express.static("public"));

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (connect(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Cookie Parser Middleware
app.use(cookieParser());

// Check for JWT Token
app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(staticRouter);

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Account routes
app.use("/account", accountRoute);

// Inventory routes
app.use("/inv", inventoryRoute);

// Order routes
// app.use("/order", orderRoute);

app.use("/internal-error", internalErrorRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
    errors: null,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
