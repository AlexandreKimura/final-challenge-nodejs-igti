import LivroRepository from "../../repositories/livroRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";

async function insereLivro(livro) {
  return await LivroRepository.insereLivro(livro);
}

async function atualizaLivro(livro) {
  const existeLivro = await LivroRepository.buscaLivro(livro.livroId);

  if (!existeLivro) {
    throw new Error("Livro não encontrado!");
  }

  existeLivro.valor = livro.valor;
  existeLivro.estoque = livro.estoque;

  const livroAtualizado = await LivroRepository.atualizaLivro(existeLivro);
  return livroAtualizado;
}

async function deletaLivro(livroId) {
  const existeLivro = await LivroRepository.buscaLivro(livroId);

  if (!existeLivro) {
    throw new Error("Livro não encontrado!");
  }

  const existeVenda = await VendaRepository.encontraVendaPorLivro(livroId);

  if (existeVenda && existeVenda.length > 0) {
    throw new Error("Existe(m) venda(s) com este livro!");
  }

  await LivroRepository.deletaLivro(livroId);
  return {};
}

export default {
  insereLivro,
  atualizaLivro,
  deletaLivro,
};
