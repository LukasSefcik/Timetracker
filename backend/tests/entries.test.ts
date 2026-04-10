import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import express from "express";
import { createEntriesRouter } from "../src/routes/entries.js";

function setupTestApp() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      hours REAL NOT NULL
    );
  `);

  const app = express();
  app.use(express.json());
  app.use("/api/entries", createEntriesRouter(db));
  return { app, db };
}

async function request(app: express.Express, method: string, url: string, body?: unknown) {
  const { default: supertest } = await import("supertest");
  const req = (supertest(app) as any)[method](url);
  if (body) req.send(body).set("Content-Type", "application/json");
  return req;
}

describe("Entries API", () => {
  let app: express.Express;
  let db: Database.Database;

  beforeEach(() => {
    ({ app, db } = setupTestApp());
  });

  it("POST /api/entries creates an entry", async () => {
    const res = await request(app, "post", "/api/entries", {
      date: "2026-04-10",
      hours: 8,
    });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, date: "2026-04-10", hours: 8 });
  });

  it("GET /api/entries?month=2026-04 returns entries for month", async () => {
    db.prepare("INSERT INTO entries (date, hours) VALUES (?, ?)").run("2026-04-10", 8);
    db.prepare("INSERT INTO entries (date, hours) VALUES (?, ?)").run("2026-04-11", 6.5);
    db.prepare("INSERT INTO entries (date, hours) VALUES (?, ?)").run("2026-03-15", 7);

    const res = await request(app, "get", "/api/entries?month=2026-04");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].date).toBe("2026-04-11");
    expect(res.body[1].date).toBe("2026-04-10");
  });

  it("PUT /api/entries/:id updates an entry", async () => {
    db.prepare("INSERT INTO entries (date, hours) VALUES (?, ?)").run("2026-04-10", 8);

    const res = await request(app, "put", "/api/entries/1", {
      date: "2026-04-10",
      hours: 7.5,
    });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, date: "2026-04-10", hours: 7.5 });
  });

  it("PUT /api/entries/:id returns 404 for missing entry", async () => {
    const res = await request(app, "put", "/api/entries/999", {
      date: "2026-04-10",
      hours: 8,
    });
    expect(res.status).toBe(404);
  });

  it("DELETE /api/entries/:id deletes an entry", async () => {
    db.prepare("INSERT INTO entries (date, hours) VALUES (?, ?)").run("2026-04-10", 8);

    const res = await request(app, "delete", "/api/entries/1");
    expect(res.status).toBe(204);

    const rows = db.prepare("SELECT * FROM entries").all();
    expect(rows).toHaveLength(0);
  });

  it("DELETE /api/entries/:id returns 404 for missing entry", async () => {
    const res = await request(app, "delete", "/api/entries/999");
    expect(res.status).toBe(404);
  });
});
