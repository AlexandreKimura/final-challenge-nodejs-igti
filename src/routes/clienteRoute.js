import express from "express";
import ClienteController from "../controllers/cliente/clienteController.js";

const router = express.Router();

router.post("/", ClienteController.insereCliente);
router.get("/:clienteId", ClienteController.buscaCliente);

export default router;
