import express from "express";
import { authorize } from "../basicAuth/admin.js";
import VendaController from "../controllers/venda/vendaController.js";

const router = express.Router();

router.post("/", authorize("admin", "cliente"), VendaController.insereVenda);
router.get(
  "/:vendaId",
  authorize("admin", "cliente"),
  VendaController.buscaVenda
);
router.get("/", VendaController.buscaVendas);

export default router;
