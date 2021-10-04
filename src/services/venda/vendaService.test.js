import AutorRepository from "../../repositories/autorRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";
import ClienteRepository from "../../repositories/clienteRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";

import VendaService from "./vendaService.js";
import postgresConexao from "../../bd/postgresConexao.js";

describe.skip("Testes unitários para a venda!", () => {
  beforeEach(async () => {
    await VendaRepository.limpaBanco();
    await LivroRepository.limpaBanco();
    await AutorRepository.limpaBanco();
    await ClienteRepository.limpaBanco();
  });

  afterAll(async () => {
    await postgresConexao.close();
  });

  test("Deve ser possível cadastrar uma venda", async () => {
    const cliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 1,
      autorId: autorCriado.autorId,
    });

    const venda = await VendaService.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    const livroPosVenda = await LivroRepository.buscaLivro(livroCriado.livroId);

    expect(venda).toHaveProperty("vendaId");
    expect(livroPosVenda.estoque).toEqual(0);
  });

  test("Não deve ser possível cadastrar uma venda com livro sem estoque!", async () => {
    const cliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 0,
      autorId: autorCriado.autorId,
    });

    const venda = {
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    };

    await expect(VendaService.insereVenda(venda)).rejects.toThrow(
      "Livro sem estoque!"
    );
  });

  test("Deve ser possível cadastrar uma venda com valor atual do livro comprado!", async () => {
    const cliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 1,
      autorId: autorCriado.autorId,
    });

    let existeLivro = await LivroRepository.buscaLivro(livroCriado.livroId, 1);
    existeLivro.valor = 30;

    const livroPrecoNovo = await LivroRepository.atualizaLivro(existeLivro);

    const venda = await VendaService.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    expect(Number(venda.valor)).toEqual(Number(livroPrecoNovo.valor));
  });

  test("Deve ser possível consultar todas as vendas", async () => {
    const cliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 2,
      autorId: autorCriado.autorId,
    });

    await VendaRepository.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    await VendaService.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    const vendas = await VendaService.buscaVendas();
    expect(vendas.length).toEqual(2);
  });

  test("Deve ser possível consultar uma venda", async () => {
    const cliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 2,
      autorId: autorCriado.autorId,
    });

    const novaVenda = await VendaRepository.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    const venda = await VendaService.buscaVenda(novaVenda.vendaId);
    expect(novaVenda.vendaId).toEqual(venda.vendaId);
    expect(venda.data).toEqual(venda.data);
    expect(venda.valor).toEqual(venda.valor);
  });

  test("Deve ser possível consultar as vendas de um cliente", async () => {
    const cliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 2,
      autorId: autorCriado.autorId,
    });

    await VendaRepository.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    await VendaRepository.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    const vendas = await VendaService.buscaVendaPorCliente(cliente.clienteId);
    expect(vendas.length).toEqual(2);
  });

  test("Deve ser possível consultar as vendas que possuem um determinado livro", async () => {
    const cliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 2,
      autorId: autorCriado.autorId,
    });

    await VendaRepository.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    await VendaRepository.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    const vendas = await VendaService.buscaVendaPorLivro(livroCriado.livroId);
    expect(vendas.length).toEqual(2);
  });

  test("Deve ser possível consultar as vendas que possuem um determinado autor", async () => {
    const cliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    });

    const autorCriado = await AutorRepository.insereAutor({
      nome: "Alexandre",
      email: "alexandre@test.com",
      telefone: "9999-9999",
    });

    const livroCriado = await LivroRepository.insereLivro({
      nome: "Livro 1",
      valor: 25,
      estoque: 2,
      autorId: autorCriado.autorId,
    });

    await VendaRepository.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    await VendaRepository.insereVenda({
      valor: livroCriado.valor,
      data: new Date(),
      clienteId: cliente.clienteId,
      livroId: livroCriado.livroId,
    });

    const vendas = await VendaService.buscaVendaPorAutor(autorCriado.autorId);
    expect(vendas.length).toEqual(2);
  });
});
