import ClienteRepository from "../../repositories/clienteRepository.js";
import AutorRepository from "../../repositories/autorRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";

import ClienteService from "./clienteService.js";
import postgresConexao from "../../bd/postgresConexao.js";

describe.skip("Testes unitários para o cliente!", () => {
  beforeEach(async () => {
    await VendaRepository.limpaBanco();
    await ClienteRepository.limpaBanco();
    await LivroRepository.limpaBanco();
    await AutorRepository.limpaBanco();
  });

  afterAll(async () => postgresConexao.close());

  test("Deve ser possível criar um novo cliente", async () => {
    const cliente = {
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    };

    const res = await ClienteService.insereCliente(cliente);
    expect(res).toHaveProperty("clienteId");
  });

  test("Deve ser possível atualizar um cliente", async () => {
    const clienteCriado = await ClienteRepository.insereCliente({
      nome: "Alexandre Primeiro",
      email: "alexandr@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    });

    const clienteAtt = {
      clienteId: clienteCriado.clienteId,
      nome: "Alexandre Segundo",
      email: "alexandr@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    };

    const clienteAtualizado = await ClienteService.atualizaCliente(clienteAtt);
    expect(clienteAtualizado.nome).toBe(clienteAtt.nome);
    expect(clienteAtualizado.email).toBe(clienteAtt.email);
    expect(clienteAtualizado.senha).toBe(clienteAtt.senha);
    expect(clienteAtualizado.telefone).toBe(clienteAtt.telefone);
    expect(clienteAtualizado.endereco).toBe(clienteAtt.endereco);
  });

  test("Deve ser possível excluir um cliente", async () => {
    const clienteCriado = await ClienteRepository.insereCliente({
      nome: "Alexandre Primeiro",
      email: "alexandr@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    });

    const clienteExcluido = await ClienteService.deletaCliente(
      clienteCriado.clienteId
    );

    expect(clienteExcluido).toEqual({});
  });

  test("Não deve ser possível atualizar um cliente inexistente!", async () => {
    const clienteCriado = await ClienteRepository.insereCliente({
      nome: "Alexandre Primeiro",
      email: "alexandr@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    });

    const clienteErrado = {
      clienteId: 1431431,
      nome: "Alexandre Primeiro",
      email: "alexandr@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    };

    await expect(ClienteService.atualizaCliente(clienteErrado)).rejects.toThrow(
      "Cliente não existe!"
    );
  });

  test("Não deve ser possível excluir um cliente inexistente!", async () => {
    const clienteCriado = await ClienteRepository.insereCliente({
      nome: "Alexandre Primeiro",
      email: "alexandr@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    });

    await expect(ClienteService.deletaCliente(13243)).rejects.toThrow(
      "Cliente não existe!"
    );
  });

  test("Não deve ser possível excluir um cliente com vendas", async () => {
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

    await expect(
      ClienteService.deletaCliente(clienteCriado.clienteId)
    ).rejects.toThrow("Existe(m) venda(s) com este cliente!");
  });

  test("Deve ser possível retornar todos os clientes sem o campo senha", async () => {
    await ClienteRepository.insereCliente({
      nome: "Alexandre Primeiro",
      email: "alexandr@test.com.br",
      senha: "123",
      telefone: "9999-9999",
      endereco: "Rua teste1",
    });

    await ClienteRepository.insereCliente({
      nome: "Alexandre Segundo",
      email: "alexandre@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    });

    const clientes = await ClienteService.buscaClientes();
    expect(clientes.length).toBe(2);
    expect(clientes[0]).not.toHaveProperty("senha");
    expect(clientes[1]).not.toHaveProperty("senha");
  });

  test("Deve ser possível retornar um cliente específico sem o campo senha", async () => {
    const novoCliente = await ClienteRepository.insereCliente({
      nome: "Alexandre Primeiro",
      email: "alexandr@test.com.br",
      senha: "123",
      telefone: "9999-9999",
      endereco: "Rua teste1",
    });

    const cliente = await ClienteService.buscaCliente(novoCliente.clienteId);
    expect(cliente).toHaveProperty("cliente_id");
    expect(cliente).not.toHaveProperty("senha");
  });
});
