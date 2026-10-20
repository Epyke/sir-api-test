/**
 * Nota:
 * Problemas nos endpoints, apesar de usar typescript, este é compilado em javascript, logo
 * 1. Tenho de verificar manualmente o tipo de cada variavel, por exemplo:
 * se fizer uma post request com um aluno chamado 1 que é um number e não uma string, este é aceite
 * 2. Outro problema, se numa POST request dar apenas um campo, este cria um aluno só com esse campo, igual
 * numa PUT request, se dar apenas o nome, o aluno é overrided pelo novo, deixando apenas um campo
 * 3.PATCH request se adicionar um campo que nao existe este vai ser adicionado ao item
 * A solução mais prática é usar a biblioteca zod (estudar mais tarde)
 */

import express from "express";
import studentsRoutes from "./routes/students.js";
import coursesRoutes from "./routes/courses.js";
import mongoose from "mongoose";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "..", "frontend");
const app = express();
const PORT = 5001;

app.use(express.static(frontendPath));
app.use(express.json());
app.use(cors());
app.use("/students", studentsRoutes);
app.use("/courses", coursesRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

async function startServer() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

startServer();
