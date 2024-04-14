import express from "express";
import { buildOrder, buildManagement } from "../controllers/orderController.js";
const router = express.Router();
import utilities from "../utilities/index.js";
import orderValidate from "../utilities/order-validation.js";

router.get("/", utilities.handleErrors(buildOrder));

// Route to management view
router.get("/new", utilities.checkLogin, utilities.handleErrors(buildAddOrder));

// Process the registration data
router.post(
  "/new",
  orderValidate.orderRules(),
  orderValidate.checkOrderData,
  utilities.handleErrors(addOrder)
);

// router.get(
//   "/:id",
//   utilities.checkLogin,
//   utilities.handleErrors(buildEditOrder)
// );

export default router;
