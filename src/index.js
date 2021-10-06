import express from "express";
import basicAuth from "express-basic-auth";
import dotenv from "dotenv";
dotenv.config();

import clienteRouter from "./routes/clienteRoute.js";
import autorRouter from "./routes/autorRoute.js";
import livroRouter from "./routes/livroRoute.js";
import vendaRouter from "./routes/vendaRoute.js";

const app = express();
app.use(express.json());

//Autenticação
/*app.use(
  basicAuth({
    authorizer: (username, password) => {
      const userMatches = basicAuth.safeCompare(username, "admin");
      const pwdMatches = basicAuth.safeCompare(password, "desafio-igti-nodejs");

      return userMatches && pwdMatches;
    },
  })
);*/

app.use("/cliente", clienteRouter);
app.use("/autor", autorRouter);
app.use("/livro", livroRouter);
app.use("/venda", vendaRouter);

app.listen(3000, () => console.log("API Started!"));

export default app;
