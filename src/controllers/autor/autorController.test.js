import request from "supertest";
import app from "../../index.js";

import AutorRepository from "../../repositories/autorRepository.js";

describe.skip("Testes de integração - Autor", () => {
  beforeEach(async () => {
    await AutorRepository.limpaBanco();
  });

  const novoAutor = {
    nome: "Alexandre",
    email: "Alexandre@test.com",
    telefone: "9999-9999",
  };

  test("Cadastrar um autor", async () => {
    const res = await request(app).post(`/autor`).send(novoAutor);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("autorId");
  });

  test("Validar o cadastro de um autor", async () => {
    const autor = await request(app).post(`/autor`).send(novoAutor);

    const res = await request(app).get(`/autor/${autor.body.autorId}`);
    expect(res.status).toBe(200);
    expect(res.body.autorId).toEqual(autor.body.autorId);
  });
});
