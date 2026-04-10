import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import express from "express";
import { createSummaryRouter } from "../src/routes/summary.js";

function setupTestApp() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE entries (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, hours REAL NOT NULL);
    CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    INSERT INTO settings (key, value) VALUES ('hourly_rate', '50');
  `);

  const app = express();
  app.use(express.json());
  app.use("/api/summary", createSummaryRouter(db));
  return { app, db };
}

async function request(app: express.Express, method: string, url: string) {
  const { default: supertest } = await import("supertest");
  return (supertest(app) as any)[method](url);
}

describe("Summary API", () => {
  let app: express.Express;
  let db: Database.Database;

  beforeEach(() => {
    ({ app, db } = setupTestApp());
  });

  it("GET /api/summary?month=2026-04 returns totals", async () => {
    db.prepare("INSERT INTO entries (date, hours) VALUES (?, ?)").run("2026-04-10", 8);
    db.prepare("INSERT INTO entries (date, hours) VALUES (?, ?)").run("2026-04-11", 6.5);

    const res = await request(app, "get", "/api/summary?month=2026-04");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalHours: 14.5,
      hourlyRate: 50,
      totalAmount: 725,
    });
  });

  it("GET /api/summary returns zeros for empty month", async () => {
    const res = await request(app, "get", "/api/summary?month=2026-05");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalHours: 0,
      hourlyRate: 50,
      totalAmount: 0,
    });
  });
});
