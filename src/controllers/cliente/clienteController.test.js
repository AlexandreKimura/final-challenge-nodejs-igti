import request from "supertest";
import app from "../../index.js";

import ClienteRepository from "../../repositories/clienteRepository.js";

describe("Testes de integração - Cliente", () => {
  beforeEach(async () => {
    await ClienteRepository.limpaBanco();
  });

  const novoCliente = {
    nome: "Alexandre",
    email: "Alexandre@test.com",
    senha: "1234",
    telefone: "9999-9999",
    endereco: "Rua teste",
  };

  test("Cadastrar um cliente", async () => {
    const cliente = await request(app).post(`/cliente`).send(novoCliente);

    expect(cliente.status).toBe(201);
    expect(cliente.body).toHaveProperty("clienteId");
  });

  test("Validar o cadastro de um cliente", async () => {
    const cliente = await request(app).post(`/cliente`).send(novoCliente);

    const clienteCriado = await request(app).get(
      `/cliente/${cliente.body.clienteId}`
    );

    expect(clienteCriado.status).toBe(200);
    expect(clienteCriado.body.cliente_id).toEqual(cliente.body.clienteId);
    expect(clienteCriado.body.email).toEqual(cliente.body.email);
    expect(clienteCriado.body.endereco).toEqual(cliente.body.endereco);
  });
});
