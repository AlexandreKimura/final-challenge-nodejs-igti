import Livro from "../models/livroModel.js";

async function insereLivro(livro) {
  try {
    return await Livro.create(livro);
  } catch (err) {
    throw err;
  }
}

async function limpaBanco() {
  try {
    await Livro.destroy({ where: {} });
  } catch (err) {
    throw err;
  }
}

async function atualizaLivro(livro) {
  try {
    return await livro.save();
  } catch (err) {
    throw err;
  }
}

async function buscaLivro(livroId) {
  try {
    return await Livro.findOne({ where: { livro_id: livroId }, raw: true });
  } catch (err) {
    throw err;
  }
}

async function buscaLivros() {
  try {
    return await Livro.findAll({ where: {} });
  } catch (err) {
    throw err;
  }
}

async function encontraLivroPorAutor(autorId) {
  try {
    return await Livro.findAll({ where: { autorId } });
  } catch (err) {
    throw err;
  }
}

async function deletaLivro(livroId) {
  try {
    await Livro.destroy({ where: { livroId } });
  } catch (err) {
    throw err;
  }
}

export default {
  insereLivro,
  limpaBanco,
  encontraLivroPorAutor,
  buscaLivro,
  buscaLivros,
  atualizaLivro,
  deletaLivro,
};
