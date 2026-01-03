import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import electionRoutes from "./routes/election.js";
import voteRoutes from "./routes/vote.js";
import auctionRoutes from "./routes/auction.js";

dotenv.config();
const app = express();
app.use(express.json());

// Allow CORS from local dev and production frontend (configurable via env)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_ORIGIN || "https://anonymous-voting-and-auction-platfo.vercel.app"
].filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/elections", electionRoutes);
app.use("/votes", voteRoutes);
app.use("/auctions", auctionRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
