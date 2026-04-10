import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "./db.js";
import { createEntriesRouter } from "./routes/entries.js";
import { createSettingsRouter } from "./routes/settings.js";
import { createSummaryRouter } from "./routes/summary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/entries", createEntriesRouter(db));
app.use("/api/settings", createSettingsRouter(db));
app.use("/api/summary", createSummaryRouter(db));

// Serve Angular static files (production)
const frontendPath = path.join(__dirname, "..", "..", "frontend", "dist", "frontend", "browser");
app.use(express.static(frontendPath));

// Catch-all for Angular client-side routing (must be after /api routes)
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
