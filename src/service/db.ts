// src/service/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";
import { execSync } from "child_process";

// Obtener la rama actual de Git
const getCurrentGitBranch = () => {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    return branch;
  } catch (error) {
    console.warn("No se pudo determinar la rama Git, usando .env.main por defecto");
    return "main";
  }
};

const currentBranch = getCurrentGitBranch();
const envFile = `.env.${currentBranch}`;

// Configurar dotenv con el archivo correspondiente a la rama
dotenv.config({ path: envFile });

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
