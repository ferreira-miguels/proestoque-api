import express from "express";
import cors from "cors";
import { router } from "../src/routes";
import { errorHandler } from "../src/middlewares/errorHandler";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    app: "ProEstoque API",
  });
});

app.use("/api", router);

app.use(errorHandler);

export { app };