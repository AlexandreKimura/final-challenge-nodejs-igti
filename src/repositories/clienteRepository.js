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
    return await cliente.save();
  } catch (err) {
    throw err;
  }
}

async function limpaBanco() {
  try {
    await Cliente.destroy({ where: {} });
  } catch (err) {
    throw err;
  }
}

async function deletaCliente(clienteId) {
  try {
    await Cliente.destroy({ where: { cliente_id: clienteId } });
  } catch (err) {
    throw err;
  }
}

async function buscaClientes() {
  try {
    return await Cliente.findAll({ where: {} });
  } catch (err) {
    throw err;
  }
}

async function buscaCliente(clienteId) {
  try {
    return await Cliente.findOne({ where: { cliente_id: clienteId } });
  } catch (err) {
    throw err;
  }
}

export default {
  insereCliente,
  atualizaCliente,
  limpaBanco,
  deletaCliente,
  buscaClientes,
  buscaCliente,
};
