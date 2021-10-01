import express from "express";
import dotenv from "dotenv";
dotenv.config();

import clienteRouter from "./routes/clienteRoute.js";
import autorRouter from "./routes/autorRoute.js";
import livroRouter from "./routes/livroRoute.js";
import vendaRouter from "./routes/vendaRoute.js";

const app = express();
app.use(express.json());

app.use("/cliente", clienteRouter);
app.use("/autor", autorRouter);
app.use("/livro", livroRouter);
app.use("/venda", vendaRouter);

app.listen(3000, () => console.log("API Started!"));
