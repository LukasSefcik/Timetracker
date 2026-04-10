import { Router } from "express";
import type Database from "better-sqlite3";

export function createEntriesRouter(db: Database.Database): Router {
  const router = Router();

  router.get("/", (req, res) => {
    const month = req.query.month as string; // "2026-04"
    const rows = db
      .prepare(
        `SELECT id, date, hours FROM entries
         WHERE date LIKE ? || '%'
         ORDER BY date DESC`
      )
      .all(month);
    res.json(rows);
  });

  router.post("/", (req, res) => {
    const { date, hours } = req.body;
    const result = db
      .prepare("INSERT INTO entries (date, hours) VALUES (?, ?)")
      .run(date, hours);
    res.status(201).json({ id: result.lastInsertRowid, date, hours });
  });

  router.put("/:id", (req, res) => {
    const { date, hours } = req.body;
    const result = db
      .prepare("UPDATE entries SET date = ?, hours = ? WHERE id = ?")
      .run(date, hours, req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }
    res.json({ id: Number(req.params.id), date, hours });
  });

  router.delete("/:id", (req, res) => {
    const result = db
      .prepare("DELETE FROM entries WHERE id = ?")
      .run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }
    res.status(204).send();
  });

  return router;
}
