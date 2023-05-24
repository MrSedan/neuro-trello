import { Request, Response, NextFunction, RequestHandler } from "express";

import { config as dotenv_config } from "dotenv";

dotenv_config();
dotenv_config({ path: ".env.local", override: true });

export const userMiddleware: RequestHandler = (_req: Request, _res: Response, next: NextFunction) => {
    const authHandler = _req.headers.authorization;
    if (!authHandler) return _res.status(401).json({ error: "pass is missing" });
    if (authHandler === process.env.PASSWORD) return next();
    _res.status(401).json({ error: "wrong password" });
};
