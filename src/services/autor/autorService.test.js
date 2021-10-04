import AutorRepository from "../../repositories/autorRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";
import ClienteRepository from "../../repositories/clienteRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";

import AutorService from "./autorService.js";
import postgresConexao from "../../bd/postgresConexao.js";

describe("Testes unitários para o autor!", () => {
  beforeEach(async () => {
    await VendaRepository.limpaBanco();
    await LivroRepository.limpaBanco();
    await AutorRepository.limpaBanco();
    await ClienteRepository.limpaBanco();
  });

  afterAll(async () => await postgresConexao.close());

  test("Deve ser possível cadastrar um autor", async () => {
    const autor = {
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    };

    const autorCriado = await AutorService.insereAutor(autor);
    expect(autorCriado).toHaveProperty("autorId");
  });

  test("Deve ser possível atualizar um autor", async () => {
    const autorCriado = await AutorService.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const autor = {
      autorId: autorCriado.autorId,
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    };

    const autorAtualizado = await AutorService.atualizaAutor(autor);
    expect(autorAtualizado.nome).toEqual(autor.nome);
    expect(autorAtualizado.email).toEqual(autor.email);
    expect(autorAtualizado.telefone).toEqual(autor.telefone);
  });

  test("Não deve ser possível atualizar um autor inexistente!", async () => {
    await AutorService.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const autor = {
      autorId: 122341242,
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    };

    await expect(AutorService.atualizaAutor(autor)).rejects.toThrow(
      "Autor não existe!"
    );
  });

  test("Não deve ser possível excluir um autor com livros", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    await LivroRepository.insereLivro({
      nome: "Livro teste",
      valor: 34,
      estoque: 1,
      autorId: autorCriado.autorId,
    });

    await expect(AutorService.deletaAutor(autorCriado.autorId)).rejects.toThrow(
      "Existe(m) livro(s) com este autor!"
    );
  });

  test("Deve ser possível excluir um autor", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const autorExcluido = await AutorService.deletaAutor(autorCriado.autorId);

    expect(autorExcluido).toEqual({});
  });

  test("Não deve ser possível excluir um autor inexistente", async () => {
    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    await expect(AutorService.deletaAutor(-1)).rejects.toThrow(
      "Autor não existe!"
    );
  });

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
  });
});
