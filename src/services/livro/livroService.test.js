import AutorRepository from "../../repositories/autorRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";
import ClienteRepository from "../../repositories/clienteRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";

import LivroService from "./livroService.js";
import postgresConexao from "../../bd/postgresConexao.js";

describe("Testes unitários para o livro!", () => {
  beforeEach(async () => {
    await VendaRepository.limpaBanco();
    await LivroRepository.limpaBanco();
    await AutorRepository.limpaBanco();
    await ClienteRepository.limpaBanco();
  });

  afterAll(async () => postgresConexao.close());

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

  /*

  test("Deve ser possível consultar todos os autores", async () => {
    await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    await AutorRepository.insereAutor({
      nome: "Alexandre2",
      email: "alexandre2@test.com",
      telefone: "9998-9999",
    });

    const autores = await AutorService.buscaAutores();
    expect(autores.length).toBe(2);
  });

  test("Deve ser possível retornar um autor específico", async () => {
    const novoAutor = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const autor = await AutorService.buscaAutor(novoAutor.autorId);
    expect(autor).toHaveProperty("autorId");
    expect(autor.email).toEqual(novoAutor.email);
  });*/
});
