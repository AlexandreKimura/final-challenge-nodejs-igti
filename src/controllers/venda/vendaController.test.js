import request from "supertest";
import app from "../../index.js";

import AutorRepository from "../../repositories/autorRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";
import ClienteRepository from "../../repositories/clienteRepository.js";
import VendaRepository from "../../repositories/vendaRepository.js";

describe.skip("Testes de integração - Venda", () => {
  beforeEach(async () => {
    await VendaRepository.limpaBanco();
    await LivroRepository.limpaBanco();
    await AutorRepository.limpaBanco();
    await ClienteRepository.limpaBanco();
  });

  const novoAutor = {
    nome: "Alexandre",
    email: "Alexandre@test.com",
    telefone: "9999-9999",
  };

  const novoLivro = {
    nome: "Livro 1",
    valor: 50,
    estoque: 10,
  };

  const novoCliente = {
    nome: "Alexandre",
    email: "Alexandre@test.com",
    senha: "1234",
    telefone: "9999-9999",
    endereco: "Rua teste",
  };

  test("Cadastrar uma venda", async () => {
    const autor = await request(app).post(`/autor`).send(novoAutor);

    const livro = await request(app)
      .post(`/livro`)
      .send({ ...novoLivro, autorId: autor.body.autorId });

    const cliente = await request(app).post(`/cliente`).send(novoCliente);

    const venda = await request(app).post(`/venda`).send({
      valor: livro.body.valor,
      data: new Date(),
      clienteId: cliente.body.clienteId,
      livroId: livro.body.livroId,
    });

    expect(venda.status).toBe(201);
    expect(venda.body).toHaveProperty("vendaId");
  });

  test("Validar o cadastro de uma venda", async () => {
    const autor = await request(app).post(`/autor`).send(novoAutor);

    const livro = await request(app)
      .post(`/livro`)
      .send({ ...novoLivro, autorId: autor.body.autorId });

    const cliente = await request(app).post(`/cliente`).send(novoCliente);

    const venda = await request(app).post(`/venda`).send({
      valor: livro.body.valor,
      data: new Date(),
      clienteId: cliente.body.clienteId,
      livroId: livro.body.livroId,
    });

    const vendaCriada = await request(app).get(`/venda/${venda.body.vendaId}`);

    expect(vendaCriada.status).toBe(200);
    expect(vendaCriada.body.vendaId).toEqual(venda.body.vendaId);
    expect(vendaCriada.body.clienteId).toEqual(cliente.body.clienteId);
    expect(vendaCriada.body.livroId).toEqual(livro.body.livroId);
  });
});
