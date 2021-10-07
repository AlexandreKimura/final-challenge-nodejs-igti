import express from "express";
import LivroController from "../controllers/livro/livroController.js";

const router = express.Router();

router.post("/", LivroController.insereLivro);
router.get("/:livroId", LivroController.buscaLivro);

export default router;
