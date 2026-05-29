import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const erros = error.errors.map((e) => ({
          campo: e.path.join("."),
          mensagem: e.message,
        }));

        res.status(422).json({
          erro: "Dados inválidos",
          detalhes: erros,
        });

        return;
      }

      next(error);
    }
  };
}