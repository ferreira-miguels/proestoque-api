import "dotenv/config";
import { app } from "./app";
import { prisma } from "./prisma/client";

const PORT = process.env.PORT ?? 3333;

async function iniciar() {
  try {
    await prisma.$connect();

    console.log("Banco conectado");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

iniciar();