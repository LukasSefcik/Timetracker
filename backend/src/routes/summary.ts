import { Router } from "express";
import type Database from "better-sqlite3";

export function createSummaryRouter(db: Database.Database): Router {
  const router = Router();

  router.get("/", (req, res) => {
    const month = req.query.month as string;

    const hoursRow = db
      .prepare(
        "SELECT COALESCE(SUM(hours), 0) as total FROM entries WHERE date LIKE ? || '%'"
      )
      .get(month) as { total: number };

    const rateRow = db
      .prepare("SELECT value FROM settings WHERE key = 'hourly_rate'")
      .get() as { value: string } | undefined;

    const totalHours = hoursRow.total;
    const hourlyRate = rateRow ? Number(rateRow.value) : 0;

    res.json({
      totalHours,
      hourlyRate,
      totalAmount: totalHours * hourlyRate,
    });
  });

  return router;
}
