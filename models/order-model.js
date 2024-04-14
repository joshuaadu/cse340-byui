import { pool } from "../database/index.js";

/* ***************************
 *  Get all order data
 * ************************** */
export async function getOrders() {
  try {
    const data = await pool.query("SELECT * FROM public.order");
    return data.rows;
  } catch (error) {
    console.error("getOrders error " + error);
    throw new Error("getOrders error " + error);
  }
}

/* ***************************
 *  Get order by id
 * ************************** */
export async function getOrderById(id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.order WHERE order_id = $1`,
      [id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getOrderById error " + error);
    throw new Error("getOrderById error " + error);
  }
}

/* ***************************
 *  Update order data
 * ************************** */
export async function updateOrder(
  order_id,
  order_date,
  order_status,
  account_id,
  inventory_id
) {
  try {
    const sql =
      "UPDATE public.order SET order_date = $1, order_status = $2, order_total = $3, account_id = $4, inventory_id = $5 WHERE order_id = $6 RETURNING *";
    const data = await pool.query(sql, [
      order_date,
      order_status,
      account_id,
      inventory_id,
      order_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete order
 * ************************** */
export async function deleteOrder(order_id) {
  try {
    const sql = "DELETE FROM public.order WHERE order_id = $1";
    const data = await pool.query(sql, [order_id]);
    return data;
  } catch (error) {
    console.error("Delete Order Error: " + error);
    new Error("Delete Order Error");
  }
}

/* ***************************
 *  Add new order
 * ************************** */
export async function addOrder(
  order_date,
  account_id,
  inventory_id
) {
  try {
    const sql =
      "INSERT INTO public.order (order_date, order_phone, account_id, inventory_id) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [
      order_date,
      account_id,
      inventory_id,
    ]);
  } catch (error) {
    return error.message;
  }
}
