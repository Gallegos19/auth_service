// src/service/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.main" });

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
});
