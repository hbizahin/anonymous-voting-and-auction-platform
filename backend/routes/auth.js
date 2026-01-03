import express from "express";
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length)
      return res.status(409).json({ error: "Email already registered" });

    const password_hash = await bcrypt.hash(password, 10);
    const id = randomUUID();
    await pool.execute(
      "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
      [id, name || null, email, password_hash]
    );

    res.json({ id, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });

    const [rows] = await pool.execute(
      "SELECT id, password_hash, role FROM users WHERE email = ?",
      [email]
    );
    if (!rows.length)
      return res.status(401).json({ error: "invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
