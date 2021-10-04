import Livro from "../models/livroModel.js";
import Venda from "../models/vendaModel.js";

async function insereVenda(venda) {
  try {
    return await Venda.create(venda);
  } catch (err) {
    throw err;
  }
}

async function encontraVendaPorCliente(clienteId) {
  try {
    return await Venda.findAll({ where: { clienteId } });
  } catch (err) {
    throw err;
  }
}

async function encontraVendaPorLivro(livroId) {
  try {
    return await Venda.findAll({ where: { livroId } });
  } catch (err) {
    throw err;
  }
}

async function buscaVendas() {
  try {
    return await Venda.findAll({ where: {} });
  } catch (err) {
    throw err;
  }
}

async function buscaVenda(vendaId) {
  try {
    return await Venda.findOne({ where: { vendaId } });
  } catch (err) {
    throw err;
  }
}

async function buscaVendaPorAutor(autorId) {
  try {
    return await Venda.findAll({
      include: [
        {
          model: Livro,
          where: { autorId: autorId },
        },
      ],
      raw: true,
    });
  } catch (err) {
    throw err;
  }
}

async function limpaBanco() {
  try {
    await Venda.destroy({ where: {} });
  } catch (err) {
    throw err;
  }
}

export default {
  insereVenda,
  encontraVendaPorCliente,
  encontraVendaPorLivro,
  limpaBanco,
  buscaVendas,
  buscaVenda,
  buscaVendaPorAutor,
};
