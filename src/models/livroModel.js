import Sequelize from "sequelize";
import sequelize from "../bd/postgresConexao.js";
import Autor from "./autorModel.js";

const Livro = sequelize.define(
  "livros",
  {
    livroId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    valor: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    estoque: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

Livro.belongsTo(Autor, { foreignKey: "autorId" });

export default Livro;
