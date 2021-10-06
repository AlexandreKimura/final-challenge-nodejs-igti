import AutorService from "../../services/autor/autorService.js";

async function insereAutor(req, res, next) {
  try {
    let autor = req.body;

    if (!autor.nome || !autor.email || !autor.telefone) {
      throw new Error("Nome, email e telefone são obrigatórios!");
    }
    autor = await AutorService.insereAutor(autor);
    res.status(201).json(autor);
  } catch (err) {
    //todo
  }
}

async function buscaAutor(req, res, next) {
  try {
    const autorId = req.params.autorId;
    const autor = await AutorService.buscaAutor(autorId);
    res.json(autor);
  } catch (err) {
    //todo
  }
}

export default {
  insereAutor,
  buscaAutor,
};
