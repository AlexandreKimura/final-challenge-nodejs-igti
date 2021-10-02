import mongodb from "mongodb";

function mongodbConexao() {
  const uri = process.env.MONGO_URL;
  return new mongodb.MongoClient(uri);
}

export default mongodbConexao;
