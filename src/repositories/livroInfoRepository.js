import conexao from "../bd/mongodbConexao.js";

async function insereInfo(info) {
  const conexaoMongo = conexao();

  try {
    await conexaoMongo.connect();
    await conexaoMongo.db("livraria").collection("livroInfo").insertOne(info);
  } catch (err) {
    throw err;
  } finally {
    await conexaoMongo.close();
  }
}

async function buscaLivroInfo(livroId) {
  const conexaoMongo = conexao();

  try {
    await conexaoMongo.connect();
    return await conexaoMongo
      .db("livraria")
      .collection("livroInfo")
      .find({ livroId })
      .toArray();
  } catch (err) {
    throw err;
  } finally {
    await conexaoMongo.close();
  }
}

async function atualizaLivroInfo(livro) {
  const conexaoMongo = conexao();

  try {
    await conexaoMongo.connect();
    await conexaoMongo
      .db("livraria")
      .collection("livroInfo")
      .updateOne({ livroId: livro.livroId }, { $set: { ...livro } });
  } catch (err) {
    throw err;
  } finally {
    await conexaoMongo.close();
  }
}

async function deletaLivroInfo(livroId) {
  const conexaoMongo = conexao();

  try {
    await conexaoMongo.connect();
    await conexaoMongo
      .db("livraria")
      .collection("livroInfo")
      .deleteOne({ livroId });
  } catch (err) {
    throw err;
  } finally {
    await conexaoMongo.close();
  }
}

async function insereAvaliacao(avaliacao, livroId) {
  const conexaoMongo = conexao();

  try {
    await conexaoMongo.connect();
    const livroInfo = await buscaLivroInfo(livroId);
    livroInfo[0].avaliacoes.push(avaliacao);
    await atualizaLivroInfo(livroInfo[0]);
  } catch (err) {
    throw err;
  } finally {
    await conexaoMongo.close();
  }
}

async function deletaAvaliacao(livroId, index) {
  const conexaoMongo = conexao();

  try {
    await conexaoMongo.connect();
    const livroInfo = await buscaLivroInfo(livroId);
    livroInfo[0].avaliacoes.splice(index, 1);
    await atualizaLivroInfo(livroInfo[0]);
  } catch (err) {
    throw err;
  } finally {
    await conexaoMongo.close();
  }
}

async function limpaBanco() {
  const conexaoMongo = conexao();

  try {
    await conexaoMongo.connect();
    await conexaoMongo.db("livraria").collection("livroInfo").drop();
  } catch (err) {
    throw err;
  } finally {
    await conexaoMongo.close();
  }
}

export default {
  insereInfo,
  buscaLivroInfo,
  atualizaLivroInfo,
  deletaLivroInfo,
  insereAvaliacao,
  deletaAvaliacao,
  limpaBanco,
};
