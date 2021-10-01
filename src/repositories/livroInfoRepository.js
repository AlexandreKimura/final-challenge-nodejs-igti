import { conexao } from "../bd/mongodbConexao.js";

async function criarlivroInfo(cliente) {
  const conexaoMongo = conexao();

  try {
    await conexaoMongo.connect();
    await conexaoMongo.db("livraria").collection("livroInfo");
  } catch (err) {
    throw err;
  } finally {
    await conexaoMongo.close();
  }
}
