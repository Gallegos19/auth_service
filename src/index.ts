import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth/auth.routes.js";
import { pool } from "./service/db.js";
import { execSync } from "child_process";
import cors from 'cors';

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
console.error(`Using environment file: ${envFile}`);

const app = express();
app.use(cors({
  origin: '*' 
}));
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Verificamos la conexión
    await pool.query("SELECT 1");
    console.log("✅ DB connected successfully");
    console.log(`📁 Using environment file: ${envFile}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Could not connect to the DB", err);
    process.exit(1);
  }
};

startServer();