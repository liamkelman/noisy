import "server-only";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

export const dbConfigured = Boolean(url);

export const sql = url ? neon(url) : null;
