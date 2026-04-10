import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Routes will be added in subsequent tasks
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
