import LivroRepository from "../../repositories/livroRepository.js";
import LivroInfoRepository from "../../repositories/livroInfoRepository.js";
import AutorRepository from "../../repositories/autorRepository.js";
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

async function buscaLivros(autorId) {
  if (autorId) {
    const existeAutor = AutorRepository.encontraAutor(autorId);

    if (!existeAutor) {
      throw new Error("Autor não encontrado!");
    }

    return await LivroRepository.encontraLivroPorAutor(autorId);
  }

  return await LivroRepository.buscaLivros();
}

async function insereInfo(livroInfo) {
  const existeLivro = await LivroRepository.buscaLivro(livroInfo.livroId);

  if (!existeLivro) {
    throw new Error("Livro não encontrado!");
  }

  return await LivroInfoRepository.insereInfo(livroInfo);
}

async function buscaLivroInfo(livroId) {
  const existeLivro = await LivroRepository.buscaLivro(livroId);

  if (!existeLivro) {
    throw new Error("Livro não encontrado!");
  }

  const info = await LivroInfoRepository.buscaLivroInfo(livroId);
  existeLivro.info = info;

  return existeLivro;
}

export default {
  insereLivro,
  atualizaLivro,
  deletaLivro,
  buscaLivros,
  insereInfo,
  buscaLivroInfo,
};
