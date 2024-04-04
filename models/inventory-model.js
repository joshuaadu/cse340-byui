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
 * Add new inventory item
 * ************************** */
export async function addInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_color,
  inv_price,
  inv_image,
  inv_description,
  inv_miles,
  inv_thumbnail,
  classification_id
) {
  // console.log("addInventory data", data);
  try {
    const sql =
      "INSERT INTO inventory ( inv_make, inv_model, inv_year, inv_color, inv_price, inv_image,  inv_description, inv_miles, inv_thumbnail, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_color,
      inv_price,
      inv_image,
      inv_description,
      inv_miles,
      inv_thumbnail,
      classification_id,
    ]);
  } catch (error) {
    return error.message;
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

/* **********************
 *   Check for existing classification
 * ********************* */
export async function checkExistingClassification(classification_name) {
  try {
    const sql =
      "SELECT * FROM classification WHERE LOWER(classification_name) = $1";
    const classification = await pool.query(sql, [
      classification_name.toLowerCase(),
    ]);
    return classification.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Add new classification
 * *************************** */
export async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}
