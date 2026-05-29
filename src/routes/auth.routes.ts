import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { autenticar } from "../middlewares/auth";

import {
  registroSchema,
  loginSchema,
} from "../schemas/auth.schema";

const router = Router();
const controller = new AuthController();

router.post(
  "/registro",
  validate(registroSchema),
  controller.registrar.bind(controller)
);

router.post(
  "/login",
  validate(loginSchema),
  controller.login.bind(controller)
);

router.get(
  "/me",
  autenticar,
  controller.perfil.bind(controller)
);

export { router as authRouter };