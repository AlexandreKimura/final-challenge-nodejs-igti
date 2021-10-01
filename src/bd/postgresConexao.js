import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const postgresConexao = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});

export default postgresConexao;
