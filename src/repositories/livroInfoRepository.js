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

export default {
  insereInfo,
  buscaLivroInfo,
};
