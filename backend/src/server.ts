import express from "express";
import cors from "cors";
import db from "./db.js";
import { createEntriesRouter } from "./routes/entries.js";
import { createSettingsRouter } from "./routes/settings.js";
import { createSummaryRouter } from "./routes/summary.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/entries", createEntriesRouter(db));
app.use("/api/settings", createSettingsRouter(db));
app.use("/api/summary", createSummaryRouter(db));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
