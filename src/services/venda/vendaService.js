import ClienteRepository from "../../repositories/clienteRepository.js";
import AutorRepository from "../../repositories/autorRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";

async function insereVenda(venda) {
  const livro = await LivroRepository.buscaLivro(venda.livroId, 1);
  if (livro.estoque <= 0) {
    throw new Error("Livro sem estoque!");
  }

  if (livro.valor !== venda.valor) {
    venda.valor = livro.valor;
  }

  const novaVenda = await VendaRepository.insereVenda(venda);

  livro.estoque--;
  await LivroRepository.atualizaLivro(livro);

  return novaVenda;
}

async function buscaVendas() {
  return await VendaRepository.buscaVendas();
}

async function buscaVenda(vendaId) {
  return await VendaRepository.buscaVenda(vendaId);
}

async function buscaVendaPorCliente(clienteId) {
  const cliente = await ClienteRepository.buscaCliente(clienteId);
  if (!cliente) {
    throw new Error("Cliente não encontrado!");
  }

  const vendas = await VendaRepository.encontraVendaPorCliente(clienteId);
  return vendas;
}

async function buscaVendaPorLivro(livroId) {
  const livro = await LivroRepository.buscaLivro(livroId);
  if (!livro) {
    throw new Error("Livro não encontrado!");
  }

  const vendas = await VendaRepository.encontraVendaPorLivro(livroId);
  return vendas;
}

async function buscaVendaPorAutor(autorId) {
  const autor = await AutorRepository.encontraAutor(autorId);
  if (!autor) {
    throw new Error("Autor não encontrado!");
  }

  const vendas = await VendaRepository.buscaVendaPorAutor(autorId);
  return vendas;
}

export default {
  insereVenda,
  buscaVendas,
  buscaVenda,
  buscaVendaPorCliente,
  buscaVendaPorLivro,
  buscaVendaPorAutor,
};
