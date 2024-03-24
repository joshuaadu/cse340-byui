import { pool } from "../database/index.js";

/* ***************************
 *  Get all classification data
 * ************************** */
export async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
export async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    // console.error("getclassificationsbyid error " + error);
    throw new Error("getInventoryByClassificationId error " + error);
  }
}

/* ***************************
 *  Get inventory item by id
 * ************************** */
export async function getInventoryById(id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [id]
    );
    return data.rows[0];
  } catch (error) {
    // console.error("getInventoryById error " + error);
    throw new Error("getInventoryById error " + error);
  }
}
