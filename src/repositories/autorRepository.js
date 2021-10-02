import Autor from "../models/autorModel.js";

async function insereAutor(autor) {
  try {
    return await Autor.create(autor);
  } catch (err) {
    throw err;
  }
}

async function atualizaAutor(autor) {
  try {
    return await autor.save(autor);
  } catch (err) {
    throw err;
  }
}

async function encontraAutor(autorId) {
  try {
    return await Autor.findOne({ where: { autor_id: autorId } });
  } catch (err) {
    throw err;
  }
}

async function deletaAutor(autorId) {
  try {
    await Autor.destroy({ where: { autor_id: autorId } });
  } catch (err) {
    throw err;
  }
}

async function buscaAutores() {
  try {
    return await Autor.findAll({ where: {} });
  } catch (err) {
    throw err;
  }
}

async function limpaBanco() {
  try {
    await Autor.destroy({ where: {} });
  } catch (err) {
    throw err;
  }
}

export default {
  insereAutor,
  limpaBanco,
  atualizaAutor,
  encontraAutor,
  deletaAutor,
  buscaAutores,
};
