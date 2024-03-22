import pg from "pg";
import { config } from "dotenv";
const { Pool } = pg;
config();

/* ************************************
 * Connection Pool
 *  SSL Object needed for local testing of app
 *  But will casue problems in production environment
 *  If - else will make determination which to use
 * */

let pool;
let query;
if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // Added for troubleshooting query
  // during development
  query = async (text, params) => {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (err) {
      console.error("error in query", { text });
      throw error;
    }
  };
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export { pool, query };
