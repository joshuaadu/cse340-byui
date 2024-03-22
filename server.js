/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
import express from "express";
import expressLayouts from "express-ejs-layouts";
import { config } from "dotenv";
import staticRouter from "./routes/static.js";
import baseController from "./controllers/baseController.js";
import inventoryRoute from "./routes/inventoryRoute.js";

config();

const app = express();

app.use(express.static("public"));

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
app.get("/", baseController.buildHome);

// Inventory routes
app.use("/inv", inventoryRoute);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/ const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
