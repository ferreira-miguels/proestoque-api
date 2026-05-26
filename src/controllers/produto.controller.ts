import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma/client";
import { AppError } from "../middlewares/errorHandler";

export class ProdutoController {

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { busca, categoriaId } = req.query;

      const produtos = await prisma.produto.findMany({
        where: {
          ...(busca && {
            nome: {
              contains: String(busca),
            },
          }),

          ...(categoriaId && {
            categoriaId: String(categoriaId),
          }),
        },

        include: {
          categoria: true,
        },

        orderBy: {
          nome: "asc",
        },
      });

      res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const produto = await prisma.produto.findUnique({
        where: { id },

        include: {
          categoria: true,
        },
      });

      if (!produto) {
        throw new AppError("Produto não encontrado", 404);
      }

      res.json(produto);
    } catch (error) {
      next(error);
    }
  }

  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        nome,
        categoriaId,
        quantidade,
        quantidadeMinima,
        preco,
        unidade,
        observacao,
        foto,
      } = req.body;

      if (!nome || !categoriaId || preco === undefined) {
        throw new AppError(
          "Campos obrigatórios: nome, categoriaId e preco"
        );
      }

      const categoriaExiste = await prisma.categoria.findUnique({
        where: {
          id: categoriaId,
        },
      });

      if (!categoriaExiste) {
        throw new AppError("Categoria não encontrada", 404);
      }

      const produto = await prisma.produto.create({
        data: {
          nome: String(nome).trim(),
          categoriaId,
          quantidade: Number(quantidade ?? 0),
          quantidadeMinima: Number(quantidadeMinima ?? 0),
          preco: Number(preco),
          unidade: String(unidade ?? "un"),
          observacao: observacao ? String(observacao) : null,
          foto: foto ? String(foto) : null,
        },

        include: {
          categoria: true,
        },
      });

      res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const produtoExiste = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produtoExiste) {
        throw new AppError("Produto não encontrado", 404);
      }

      const produto = await prisma.produto.update({
        where: { id },

        data: {
          ...req.body,
          ultimaMovimentacao: new Date(),
        },

        include: {
          categoria: true,
        },
      });

      res.json(produto);
    } catch (error) {
      next(error);
    }
  }

  async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const produtoExiste = await prisma.produto.findUnique({
        where: { id },
      });

      if (!produtoExiste) {
        throw new AppError("Produto não encontrado", 404);
      }

      await prisma.produto.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}