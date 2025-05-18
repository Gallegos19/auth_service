import { pool } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (username: string, password: string) => {
  const res = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  const user = res.rows[0];

  if (!user) throw new Error("Usuario no encontrado");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Contraseña incorrecta");

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return token;
};

export const registerUser = async (username: string, password: string) => {
  const salt = process.env.SALT || 10;
  const hashed = await bcrypt.hash(password, salt);
  await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashed]);
};
