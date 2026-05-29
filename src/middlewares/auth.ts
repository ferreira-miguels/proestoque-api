import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "../config";
import { AppError } from "./errorHandler";
import type { JwtPayload } from "../controllers/auth.controller";

declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload;
    }
  }
}

export function autenticar(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    const [tipo, token] = authHeader.split(" ");

    if (tipo !== "Bearer" || !token) {
      throw new AppError(
        "Formato de token inválido",
        401
      );
    }

    const payload = jwt.verify(
      token,
      config.jwtSecret
    ) as JwtPayload;

    req.usuario = payload;

    next();
  } catch (error: any) {
    if (error?.name === "TokenExpiredError") {
      return next(
        new AppError(
          "Token expirado. Faça login novamente.",
          401
        )
      );
    }

    if (error?.name === "JsonWebTokenError") {
      return next(
        new AppError("Token inválido", 401)
      );
    }

    next(error);
  }
}