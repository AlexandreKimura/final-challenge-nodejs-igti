import basicAuth from "express-basic-auth";

import ClienteService from "../services/cliente/clienteService.js";

async function compare(username, password, isAdmin = 0) {
  if (isAdmin) {
    const userAdmin = basicAuth.safeCompare(username, "admin");
    const passwordAdmin = basicAuth.safeCompare(
      password,
      "desafio-igti-nodejs"
    );

    return userAdmin && passwordAdmin;
  }

  const cliente = await ClienteService.buscaClientePorEmailESenha(
    username,
    password
  );

  if (cliente && cliente.length > 0) {
    return cliente;
  }

  return false;
}

//Autenticação
export function authorize(...tipo) {
  return (req, res, next) => {
    const base64Credentials = req.headers.authorization.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");
    if (username && password) {
      let check = 0;
      console.log(tipo);
      if (tipo.length === 1) {
        check = compare(username, password, 1);
      } else {
        req.user = check = compare(username, password);
      }

      if (check) {
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    } else {
      res.status(403).send("User not found");
    }
  };
}
