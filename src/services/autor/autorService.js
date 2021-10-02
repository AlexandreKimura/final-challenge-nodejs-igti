import AutorRepository from "../../repositories/autorRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";

async function insereAutor(autor) {
  return await AutorRepository.insereAutor(autor);
}

async function atualizaAutor(autor) {
  const existeAutor = await AutorRepository.encontraAutor(autor.autorId);

  if (!existeAutor) {
    throw new Error("Autor não existe!");
  }

  existeAutor.nome = autor.nome;
  existeAutor.email = autor.email;
  existeAutor.telefone = autor.telefone;

  return await AutorRepository.atualizaAutor(existeAutor);
}

async function deletaAutor(autorId) {
  const existeLivro = await LivroRepository.encontraLivroPorAutor(autorId);

  if (existeLivro && existeLivro.length > 0) {
    throw new Error("Existe(m) livro(s) com este autor!");
  }

  const existeAutor = await AutorRepository.encontraAutor(autorId);

  if (!existeAutor) {
    throw new Error("Autor não existe!");
  }

  await AutorRepository.deletaAutor(existeAutor.autorId);
  return {};
}

async function buscaAutores() {
  return await AutorRepository.buscaAutores();
}

async function buscaAutor(autorId) {
  return await AutorRepository.encontraAutor(autorId);
}

export default {
  insereAutor,
  atualizaAutor,
  deletaAutor,
  buscaAutores,
  buscaAutor,
};
