import Cliente from "../models/clienteModel.js";

async function insereCliente(cliente) {
  try {
    return await Cliente.create(cliente);
  } catch (err) {
    throw err;
  }
}

async function atualizaCliente(cliente) {
  try {
    const existeCliente = await encontraCliente(cliente.clienteId);

    existeCliente.nome = cliente.nome;
    existeCliente.email = cliente.email;
    existeCliente.senha = cliente.senha;
    existeCliente.telefone = cliente.telefone;
    existeCliente.endereco = cliente.endereco;

    const clienteAtualizado = await existeCliente.save();

    return clienteAtualizado;
  } catch (err) {
    throw err;
  }
}

async function encontraCliente(clienteId) {
  try {
    return await Cliente.findOne({ where: { cliente_id: clienteId } });
  } catch (err) {
    throw err;
  }
}

export default {
  insereCliente,
  atualizaCliente,
  encontraCliente,
};
