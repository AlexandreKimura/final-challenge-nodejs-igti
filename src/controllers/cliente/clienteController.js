async function criaCliente(req, res) {
  try {
    let cliente = req.body;

    if (
      !cliente.nome ||
      !cliente.email ||
      !cliente.senha ||
      !cliente.telefone ||
      !cliente.endereco
    ) {
      throw new Error(
        "Nome, E-mail, Senha, Telefone e Endereço são obrigatórios!"
      );
    }

    //service
  } catch (err) {}
}
