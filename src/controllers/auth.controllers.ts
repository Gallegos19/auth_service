import { Request, Response } from "express";
import { loginUser, registerUser } from "../service/auth.service.js";


export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await loginUser(username, password);
    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("Faltan datos");
    }
    await registerUser(username, password);
    res.status(201).json({ message: "Usuario registrado" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
