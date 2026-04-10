import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import express from "express";
import { createSettingsRouter } from "../src/routes/settings.js";

function setupTestApp() {
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    INSERT INTO settings (key, value) VALUES ('hourly_rate', '0');
  `);

  const app = express();
  app.use(express.json());
  app.use("/api/settings", createSettingsRouter(db));
  return { app, db };
}

async function request(app: express.Express, method: string, url: string, body?: unknown) {
  const { default: supertest } = await import("supertest");
  const req = (supertest(app) as any)[method](url);
  if (body) req.send(body).set("Content-Type", "application/json");
  return req;
}

describe("Settings API", () => {
  let app: express.Express;

  beforeEach(() => {
    ({ app } = setupTestApp());
  });

  it("GET /api/settings returns hourly rate", async () => {
    const res = await request(app, "get", "/api/settings");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hourlyRate: 0 });
  });

  it("PUT /api/settings updates hourly rate", async () => {
    const res = await request(app, "put", "/api/settings", { hourlyRate: 50 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hourlyRate: 50 });
  });

  it("GET /api/settings reflects updated rate", async () => {
    await request(app, "put", "/api/settings", { hourlyRate: 75 });
    const res = await request(app, "get", "/api/settings");
    expect(res.body).toEqual({ hourlyRate: 75 });
  });
});
