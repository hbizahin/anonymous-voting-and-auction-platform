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

const allowedOrigins = [
  "http://localhost:5173",
  "https://anonymous-voting-and-auction-platfo.vercel.app",
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/elections", electionRoutes);
app.use("/votes", voteRoutes);
app.use("/auctions", auctionRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
