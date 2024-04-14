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

/* ***************************
 *  Update Inventory Data
 * ************************** */
export async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
export async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("Delete Inventory Error: " + error);
    new Error("Delete Inventory Error");
  }
}

/* ***************************
 *  Like an Inventory Item
 * ************************** */
export async function likeInventory(inv_id) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_likes = inv_likes + 1 WHERE inv_id = $1 RETURNING *";
    const data = await pool.query(sql, [inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("Like Inventory Error: " + error);
    new Error("Like Inventory Error");
  }
}
