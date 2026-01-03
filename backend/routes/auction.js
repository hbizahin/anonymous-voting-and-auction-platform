import express from "express";
import { pool } from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

// List auctions
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM auctions ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// Place bid
router.post("/:auctionId/bids", authenticateToken, async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;
    const bidId = randomUUID();

    await pool.execute(
      "INSERT INTO bids (id, auction_id, user_id, amount) VALUES (?, ?, ?, ?)",
      [bidId, auctionId, userId, amount]
    );
    res.json({ bidId, auctionId, amount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
