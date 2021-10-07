import request from "supertest";
import app from "../../index.js";

import AutorRepository from "../../repositories/autorRepository.js";
import LivroRepository from "../../repositories/livroRepository.js";

describe.skip("Testes de integração - Livro", () => {
  beforeEach(async () => {
    await LivroRepository.limpaBanco();
    await AutorRepository.limpaBanco();
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

  test("Cadastrar um livro", async () => {
    const autor = await request(app).post(`/autor`).send(novoAutor);

    const livro = await request(app)
      .post(`/livro`)
      .send({ ...novoLivro, autorId: autor.body.autorId });

    expect(livro.status).toBe(201);
    expect(livro.body).toHaveProperty("livroId");
  });

  test("Validar o cadastro de um livro", async () => {
    const autor = await request(app).post(`/autor`).send(novoAutor);

    const livro = await request(app)
      .post(`/livro`)
      .send({ ...novoLivro, autorId: autor.body.autorId });
    const livroCriado = await request(app).get(`/livro/${livro.body.livroId}`);

    expect(livroCriado.status).toBe(200);
    expect(livroCriado.body).toHaveProperty("livroId");
    expect(livroCriado.body.autorId).toEqual(autor.body.autorId);
  });
});
