import ClienteService from "../services/cliente/clienteService.js";

async function verificaCliente(email, senha) {
  //todo
  //const cliente = await ClienteService.;
}

export function authorize() {
  return (req, res, next) => {
    if (req.auth.user && req.auth.password) {
      const verificado = verificaCliente(req.auth.user, req.auth.password);

      if (verificado) {
        next();
      } else {
        res.status(401).send("Usuário sem permissão");
      }
    } else {
      res.status(403).send("Usuário não encontrado");
    }
  };
}
