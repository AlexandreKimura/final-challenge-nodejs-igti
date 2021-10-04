import ClienteRepository from "../../repositories/clienteRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";

async function insereCliente(cliente) {
  return await ClienteRepository.insereCliente(cliente);
}

async function atualizaCliente(cliente) {
  const existeCliente = await ClienteRepository.buscaCliente(cliente.clienteId);

  if (!existeCliente) {
    throw new Error("Cliente não existe!");
  }

  existeCliente.nome = cliente.nome;
  existeCliente.email = cliente.email;
  existeCliente.senha = cliente.senha;
  existeCliente.telefone = cliente.telefone;
  existeCliente.endereco = cliente.endereco;

  return await ClienteRepository.atualizaCliente(existeCliente);
}

async function deletaCliente(clienteId) {
  const existeCliente = await ClienteRepository.buscaCliente(clienteId);

  if (!existeCliente) {
    throw new Error("Cliente não existe!");
  }

  const existeVenda = await VendaRepository.encontraVendaPorCliente(clienteId);

  if (existeVenda && existeVenda.length > 0) {
    throw new Error("Existe(m) venda(s) com este cliente!");
  }

  await ClienteRepository.deletaCliente(existeCliente.clienteId);
  return {};
}

async function buscaClientes() {
  const clientes = await ClienteRepository.buscaClientes();
  const clientesSemSenha = [];
  let novoCliente;

  clientes.map((cliente) => {
    novoCliente = {
      cliente_id: cliente.clienteId,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
    };
    clientesSemSenha.push(novoCliente);
  });
  return clientesSemSenha;
}

async function buscaCliente(clienteId) {
  const cliente = await ClienteRepository.buscaCliente(clienteId);
  const clienteSemSenha = {
    cliente_id: cliente.clienteId,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    endereco: cliente.endereco,
  };

  return clienteSemSenha;
}

export default {
  insereCliente,
  atualizaCliente,
  deletaCliente,
  buscaClientes,
  buscaCliente,
};
