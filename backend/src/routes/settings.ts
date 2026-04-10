import { Router } from "express";
import type Database from "better-sqlite3";

export function createSettingsRouter(db: Database.Database): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    const row = db
      .prepare("SELECT value FROM settings WHERE key = 'hourly_rate'")
      .get() as { value: string } | undefined;
    res.json({ hourlyRate: row ? Number(row.value) : 0 });
  });

  router.put("/", (req, res) => {
    const { hourlyRate } = req.body;
    db.prepare(
      "INSERT OR REPLACE INTO settings (key, value) VALUES ('hourly_rate', ?)"
    ).run(String(hourlyRate));
    res.json({ hourlyRate });
  });

  return router;
}
