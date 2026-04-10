import express from "express";
import cors from "cors";
import db from "./db.js";
import { createEntriesRouter } from "./routes/entries.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/entries", createEntriesRouter(db));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
