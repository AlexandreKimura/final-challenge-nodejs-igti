import express from "express";
import AutorController from "../controllers/autor/autorController.js";

const router = express.Router();

router.post("/", AutorController.insereAutor);
router.get("/:autorId", AutorController.buscaAutor);

export default router;
