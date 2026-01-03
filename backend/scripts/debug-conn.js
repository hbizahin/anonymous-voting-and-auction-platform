import { pool } from "../config/db.js";

(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 as ok");
    console.log("DB connection successful:", rows);
    process.exit(0);
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
})();
