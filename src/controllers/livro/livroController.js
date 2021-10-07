import LivroService from "../../services/livro/livroService.js";

async function insereLivro(req, res, next) {
  try {
    let livro = req.body;

    if (!livro.nome || !livro.valor || !livro.estoque || !livro.autorId) {
      throw new Error("Nome, valor, estoque e autorId são obrigatórios!");
    }
    livro = await LivroService.insereLivro(livro);
    res.status(201).json(livro);
  } catch (err) {
    //todo
  }
}

async function buscaLivro(req, res, next) {
  try {
    const livroId = req.params.livroId;
    const livro = await LivroService.buscaLivro(livroId);
    res.json(livro);
  } catch (err) {
    //todo
  }
}

export default {
  insereLivro,
  buscaLivro,
};
