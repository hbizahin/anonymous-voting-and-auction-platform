import express from "express";
import { pool } from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

// List elections
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM elections ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// Create election (admin)
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "admin only" });
    const { title, description, start_time, end_time } = req.body;
    const id = randomUUID();
    await pool.execute(
      "INSERT INTO elections (id, title, description, start_time, end_time, created_by) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id,
        title,
        description || null,
        start_time || null,
        end_time || null,
        req.user.id,
      ]
    );
    res.json({ id, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
