import VendaService from "../../services/venda/vendaService.js";

async function insereVenda(req, res, next) {
  try {
    let venda = req.body;

    if (!venda.valor || !venda.data || !venda.clienteId || !venda.livroId) {
      throw new Error("Valor, data, clienteId e livroId são obrigatórios!");
    }
    venda = await VendaService.insereVenda(venda);
    res.status(201).json(venda);
  } catch (err) {
    //todo
  }
}

async function buscaVenda(req, res, next) {
  try {
    const vendaId = req.params.vendaId;
    const user = req.user;
    console.log(user);
    const venda = await VendaService.buscaVenda(vendaId);
    res.json(venda);
  } catch (err) {
    //todo
  }
}

async function buscaVendas(req, res, next) {
  try {
    const { clienteId, autorId, livroId } = req.query;

    if (clienteId) {
      const vendas = await VendaService.buscaVendaPorCliente(clienteId);
      return res.send(vendas);
    }

    if (autorId) {
      const vendas = await VendaService.buscaVendaPorAutor(autorId);
      return res.send(vendas);
    }

    if (livroId) {
      const vendas = await VendaService.buscaVendaPorLivro(livroId);
      return res.send(vendas);
    }
  } catch (err) {
    //todo
  }
}

export default {
  insereVenda,
  buscaVenda,
  buscaVendas,
};
