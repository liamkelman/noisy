#!/usr/bin/env node
// Run all .sql files in /sql against $DATABASE_URL, in filename order.
import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "node:process";

// Load .env.local manually (no dotenv dep).
const root = dirname(dirname(fileURLToPath(import.meta.url)));
try {
  const env = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set. Add it to .env.local.");
  process.exit(1);
}

const sql = neon(url);
const sqlDir = join(root, "sql");
const files = readdirSync(sqlDir).filter((f) => f.endsWith(".sql")).sort();

for (const f of files) {
  const body = readFileSync(join(sqlDir, f), "utf8");
  process.stdout.write(`→ ${f} ... `);
  // Split on semicolons that end statements. Naive but fine for our migrations.
  const stmts = body
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("--"));
  for (const s of stmts) {
    await sql.query(s);
  }
  console.log("ok");
}
console.log("migrations complete");
