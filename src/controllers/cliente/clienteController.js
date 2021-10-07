import ClienteService from "../../services/cliente/clienteService.js";

async function insereCliente(req, res, next) {
  try {
    let cliente = req.body;

    if (
      !cliente.nome ||
      !cliente.email ||
      !cliente.senha ||
      !cliente.telefone ||
      !cliente.endereco
    ) {
      throw new Error(
        "Nome, E-mail, Senha, Telefone e Endereço são obrigatórios!"
      );
    }

    cliente = await ClienteService.insereCliente(cliente);
    return res.status(201).json(cliente);
  } catch (err) {}
}

async function buscaCliente(req, res, next) {
  try {
    const clienteId = req.params.clienteId;

    const cliente = await ClienteService.buscaCliente(clienteId);
    return res.json(cliente);
  } catch (err) {}
}

export default {
  insereCliente,
  buscaCliente,
};
