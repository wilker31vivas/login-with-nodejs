import { Router } from "express";
import { USERS_BBDD } from "../bbdd.js";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";

const authRouter = Router();

authRouter.post("/autenticado", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(401);

  try {
    const user = authByEmailPwd(email, password);
    return res.send(`User autenticado ${user.name}`);
  } catch (error) {
    return res.sendStatus(401);
  }
});

authRouter.post("/autorizado", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(401);

  try {
    const user = authByEmailPwd(email, password);
    if (user.role !== "admin") return res.sendStatus(401);
    return res.send(`User autorizado ${user.name}`);
  } catch (error) {
    return res.sendStatus(401);
  }
});

export default authRouter