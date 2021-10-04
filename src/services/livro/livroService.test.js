import AutorRepository from "../../repositories/autorRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";
import ClienteRepository from "../../repositories/clienteRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";
import LivroInfoRepository from "../../repositories/livroInfoRepository.js";

import LivroService from "./livroService.js";
import postgresConexao from "../../bd/postgresConexao.js";

describe.skip("Testes unitários para o livro!", () => {
  beforeEach(async () => {
    await VendaRepository.limpaBanco();
    await LivroRepository.limpaBanco();
    await AutorRepository.limpaBanco();
    await ClienteRepository.limpaBanco();
  });

  afterAll(async () => {
    await LivroInfoRepository.limpaBanco();
    postgresConexao.close();
  });

  test("Deve ser possível cadastrar um livro", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livro = {
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    };

    const livroCriado = await LivroService.insereLivro(livro);
    expect(livroCriado).toHaveProperty("livroId");
  });

  test("Deve ser possível atualizar um livro", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    const atualizaLivro = {
      livroId: livroCriado.livroId,
      nome: "Livro 2",
      valor: 30,
      estoque: 11,
      autorId: 123,
    };

    const livroAtualizado = await LivroService.atualizaLivro(atualizaLivro);
    //Precisa ser igual à crição
    expect(livroAtualizado.nome).toEqual(livroCriado.nome);
    expect(livroAtualizado.autorId).toEqual(livroCriado.autorId);

    //Valores alterados
    expect(livroAtualizado.valor).toEqual(atualizaLivro.valor);
    expect(livroAtualizado.estoque).toEqual(atualizaLivro.estoque);
  });

  test("Não deve ser possível atualizar um livro inexistente!", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    const atualizaLivro = {
      livroId: -1,
      nome: "Livro 2",
      valor: 30,
      estoque: 11,
      autorId: 123,
    };

    await expect(LivroService.atualizaLivro(atualizaLivro)).rejects.toThrow(
      "Livro não encontrado!"
    );
  });

  test("Não deve ser possível excluir um livro com vendas", async () => {
    const clienteCriado = await ClienteRepository.insereCliente({
      nome: "Alexandre Primeiro",
      email: "alexandr@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro teste",
      valor: 34,
      estoque: 1,
      autorId: autorCriado.autorId,
    });

    await VendaRepository.insereVenda({
      valor: 13.3,
      data: new Date(),
      clienteId: clienteCriado.clienteId,
      livroId: livroCriado.livroId,
    });

    await expect(LivroService.deletaLivro(livroCriado.livroId)).rejects.toThrow(
      "Existe(m) venda(s) com este livro!"
    );
  });

  test("Deve ser possível excluir um livro", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livro = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    const livroExcluido = await LivroService.deletaLivro(livro.livroId);

    expect(livroExcluido).toEqual({});
  });

  test("Não deve ser possível excluir um livro inexistente", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    await expect(LivroService.deletaLivro(-1)).rejects.toThrow(
      "Livro não encontrado!"
    );
  });

  test("Deve ser possível consultar todos os livros", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const segundoAutorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre2",
      email: "alexandre2@test.com",
      telefone: "9998-9999",
    });

    await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    await LivroRepository.insereLivro({
      nome: "Livro 2",
      valor: 30,
      estoque: 15,
      autorId: segundoAutorCriado.autorId,
    });

    const livros = await LivroService.buscaLivros();
    expect(livros.length).toBe(2);
    expect(livros[0].nome).toEqual("Livro 1");
    expect(livros[1].estoque).toEqual(15);
  });

  test("Deve ser possível consultar todos os livros a partir de um autor", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const segundoAutorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre2",
      email: "alexandre2@test.com",
      telefone: "9998-9999",
    });

    await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    await LivroRepository.insereLivro({
      nome: "Livro 2",
      valor: 30,
      estoque: 15,
      autorId: segundoAutorCriado.autorId,
    });

    await LivroRepository.insereLivro({
      nome: "Livro 3",
      valor: 35,
      estoque: 20,
      autorId: segundoAutorCriado.autorId,
    });

    const livros = await LivroService.buscaLivros(segundoAutorCriado.autorId);

    expect(livros.length).toBe(2);
    expect(livros[0].nome).toEqual("Livro 2");
    expect(livros[1].estoque).toEqual(20);
  });

  test("Deve ser possível cadastrar informações de um livro", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livro = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    const livroInfo = {
      livroId: livro.livroId,
      descricao: "Primeira descrição",
      paginas: 250,
      editora: "UEL",
      avaliacoes: [
        {
          nome: "Alexandre avaliação 1",
          nota: 5,
          avaliacao: "Descrição da avaliação",
        },
      ],
    };

    await LivroService.insereInfo(livroInfo);
    const res = await LivroService.buscaLivroInfo(livro.livroId);
    expect(res.info[0].livroId).toEqual(livro.livroId);
    expect(res.info[0]).toHaveProperty("descricao");
    expect(res.info[0]).toHaveProperty("paginas");
    expect(res.info[0]).toHaveProperty("editora");
    expect(res.info[0]).toHaveProperty("avaliacoes");
  }, 30000);

  test("Deve ser possível consultar um livro e retornar suas informações", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livro = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    const livroInfo = {
      livroId: livro.livroId,
      descricao: "Primeira descrição",
      paginas: 250,
      editora: "UEL",
      avaliacoes: [
        {
          nome: "Alexandre avaliação 1",
          nota: 5,
          avaliacao: "Descrição da avaliação",
        },
      ],
    };

    const livroInfo2 = {
      livroId: livro.livroId,
      descricao: "Segunda descrição",
      paginas: 150,
      editora: "UTFPR",
      avaliacoes: [
        {
          nome: "Alexandre avaliação 2",
          nota: 4,
          avaliacao: "Descrição da avaliação",
        },
      ],
    };

    await LivroService.insereInfo(livroInfo);
    await LivroService.insereInfo(livroInfo2);
    const res = await LivroService.buscaLivroInfo(livro.livroId);
    expect(res.info[0]).toEqual(livroInfo);
    expect(res.info[1]).toEqual(livroInfo2);
  }, 30000);

  test("Deve ser possível atualizar informações de um livro", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livro = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    await LivroService.insereInfo({
      livroId: livro.livroId,
      descricao: "Primeira descrição",
      paginas: 250,
      editora: "UEL",
      avaliacoes: [
        {
          nome: "Alexandre avaliação 1",
          nota: 5,
          avaliacao: "Descrição da avaliação",
        },
      ],
    });

    const livroAtualizaInfo = {
      livroId: livro.livroId,
      descricao: "Primeira descrição atualizada",
      paginas: 300,
      editora: "UTFPR",
      avaliacoes: [
        {
          nome: "Alexandre avaliação 2",
          nota: 6,
          avaliacao: "Descrição da avaliação atualizada",
        },
      ],
    };

    const res = await LivroService.atualizaLivroInfo(livroAtualizaInfo);
    expect(res.info[0].livroId).toEqual(livroAtualizaInfo.livroId);
    expect(res.info[0].descricao).toEqual(livroAtualizaInfo.descricao);
    expect(res.info[0].paginas).toEqual(livroAtualizaInfo.paginas);
    expect(res.info[0].editora).toEqual(livroAtualizaInfo.editora);
    expect(res.info[0].avaliacoes).toEqual(livroAtualizaInfo.avaliacoes);
  }, 30000);

  test("Deve ser possível excluir informações de um livro", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livro = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    await LivroService.insereInfo({
      livroId: livro.livroId,
      descricao: "Primeira descrição",
      paginas: 250,
      editora: "UEL",
      avaliacoes: [
        {
          nome: "Alexandre avaliação 1",
          nota: 5,
          avaliacao: "Descrição da avaliação",
        },
      ],
    });

    const res = await LivroService.deletaLivroInfo(livro.livroId);
    expect(res.info.length).toBe(0);
  }, 30000);

  test("Deve ser possível cadastrar uma avaliação de um livro", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livro = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    await LivroService.insereInfo({
      livroId: livro.livroId,
      descricao: "Primeira descrição",
      paginas: 250,
      editora: "UEL",
      avaliacoes: [
        {
          nome: "Alexandre avaliação 1",
          nota: 5,
          avaliacao: "Descrição da avaliação",
        },
      ],
    });

    const novaAvaliacao = {
      nome: "Nova avaliacao",
      nota: 9,
      avaliacao: "Descrição da nova avaliação",
    };

    const res = await LivroService.insereAvaliacao(
      novaAvaliacao,
      livro.livroId
    );
    expect(res.info[0].avaliacoes.length).toBe(2);
    expect(res.info[0].avaliacoes[1].nome).toEqual(novaAvaliacao.nome);
    expect(res.info[0].avaliacoes[1].nota).toEqual(novaAvaliacao.nota);
    expect(res.info[0].avaliacoes[1].avaliacao).toEqual(
      novaAvaliacao.avaliacao
    );
  }, 30000);

  test("Deve ser possível excluir uma avaliação de um livro", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livro = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 10,
      autorId: autorCriado.autorId,
    });

    await LivroService.insereInfo({
      livroId: livro.livroId,
      descricao: "Primeira descrição",
      paginas: 250,
      editora: "UEL",
      avaliacoes: [
        {
          nome: "Alexandre avaliação 1",
          nota: 5,
          avaliacao: "Descrição da avaliação",
        },
        {
          nome: "Alexandre avaliação 2",
          nota: 6,
          avaliacao: "Descrição da avaliação 2",
        },
        {
          nome: "Alexandre avaliação 3",
          nota: 8,
          avaliacao: "Descrição da avaliação 3",
        },
      ],
    });

    const res = await LivroService.deletaAvaliacao(livro.livroId, 0);
    expect(res.info[0].avaliacoes.length).toBe(2);
    expect(res.info[0].avaliacoes[0].nome).toEqual("Alexandre avaliação 2");
    expect(res.info[0].avaliacoes[0].nota).toEqual(6);
    expect(res.info[0].avaliacoes[0].avaliacao).toEqual(
      "Descrição da avaliação 2"
    );
  }, 30000);
});
