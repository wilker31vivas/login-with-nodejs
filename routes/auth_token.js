import { Router } from "express";
import { USERS_BBDD } from "../bbdd.js";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";
import { SignJWT, jwtVerify } from "jose";

const authTokenRouter = Router();

authTokenRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(401);

  try {
    const { guid } = authByEmailPwd(email, password);

    const jwtConstructor = new SignJWT({ guid });
    const jwtSecret = process.env.JWT_PRIMATE_KEY;

    if (!jwtSecret) return res.status(500).send("JWT secret not configured");

    const encoder = new TextEncoder();
    const jwt = await jwtConstructor
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(encoder.encode(jwtSecret));

    return res.send({ jwt });
  } catch (error) {
    return res.sendStatus(401);
  }
});

authTokenRouter.get("/profile", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) return res.sendStatus(401);

  try {
    const jwtSecret = process.env.JWT_PRIMATE_KEY;
    if (!jwtSecret) return res.status(500).send("JWT secret not configured");

    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : authorization;

    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(
      token,
      encoder.encode(jwtSecret),
    );

    const user = USERS_BBDD.find((item) => item.guid === payload.guid);

    if (!user) return res.sendStatus(401);

    delete user.password;

    return res.send(user);
  } catch (error) {
    return res.sendStatus(401);
  }
});

export default authTokenRouter;
