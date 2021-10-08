import express from "express";
import { authorize } from "../basicAuth/admin.js";
import LivroController from "../controllers/livro/livroController.js";

const router = express.Router();

router.post("/", LivroController.insereLivro);
router.get("/:livroId", LivroController.buscaLivro);
router.get("/:clienteId", LivroController.buscaLivro);

export default router;
