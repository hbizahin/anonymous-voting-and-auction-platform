import express from "express";
import { pool } from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

// Cast a vote
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { election_id, candidate_id } = req.body;
    const user_id = req.user.id;

    // Check election exists and is active
    const [eRows] = await pool.execute(
      "SELECT start_time, end_time FROM elections WHERE id = ?",
      [election_id]
    );
    if (!eRows.length)
      return res.status(400).json({ error: "invalid election" });
    const now = new Date();
    const start = eRows[0].start_time ? new Date(eRows[0].start_time) : null;
    const end = eRows[0].end_time ? new Date(eRows[0].end_time) : null;
    if (start && now < start)
      return res.status(400).json({ error: "election has not started" });
    if (end && now > end)
      return res.status(400).json({ error: "election has ended" });

    // Check one vote per user per election
    const [vRows] = await pool.execute(
      "SELECT COUNT(*) as cnt FROM votes WHERE election_id = ? AND user_id = ?",
      [election_id, user_id]
    );
    if (vRows[0].cnt > 0)
      return res.status(400).json({ error: "already voted" });

    const voteId = randomUUID();
    await pool.execute(
      "INSERT INTO votes (id, election_id, user_id, candidate_id) VALUES (?, ?, ?, ?)",
      [voteId, election_id, user_id, candidate_id]
    );

    const receiptId = randomUUID();
    const receiptCode = randomUUID();
    await pool.execute(
      "INSERT INTO vote_receipts (id, vote_id, receipt_code) VALUES (?, ?, ?)",
      [receiptId, voteId, receiptCode]
    );

    res.json({ voteId, receiptCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

export default router;
