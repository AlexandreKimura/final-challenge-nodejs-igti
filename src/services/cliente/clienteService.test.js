import ClienteRepository from "../../repositories/clienteRepository.js";

describe("Testes unitários para o cliente!", () => {
  test.skip("Deve ser possível criar um novo cliente", async () => {
    const cliente = {
      nome: "Alexandre Fukano",
      email: "alexandre@test.com.br",
      senha: "123",
      telefone: "3244-9999",
      endereco: "Rua teste",
    };

    const res = await ClienteRepository.insereCliente(cliente);
    expect(res).toHaveProperty("clienteId");
  });

  test.skip("Deve ser possível atualizar um cliente", async () => {
    //Melhorar
    const cliente = {
      clienteId: 6,
      nome: "Alexandre Segundo",
      email: "alexandr@test.com.br",
      senha: "1234",
      telefone: "3245-9999",
      endereco: "Rua teste2",
    };

    //const clienteCriado = await ClienteRepository.insereCliente(cliente);
    const clienteAtualizado = await ClienteRepository.atualizaCliente(cliente);
    expect(clienteAtualizado.nome).toBe(cliente.nome);
    expect(clienteAtualizado.email).toBe(cliente.email);
    expect(clienteAtualizado.senha).toBe(cliente.senha);
    expect(clienteAtualizado.telefone).toBe(cliente.telefone);
    expect(clienteAtualizado.endereco).toBe(cliente.endereco);
  });
});
