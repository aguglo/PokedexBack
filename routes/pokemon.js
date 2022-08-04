const express = require("express");
const router = express.Router();
const {
  
  addpkmn,
  putpokemon,
  deletepokemon,
  pruebapgadmin,
  insertUser,
} = require("../controllers/pokemon");
const { verifyToken } = require("../controllers/validar");

router.post("/addpkmn", verifyToken, addpkmn);
router.put("/putpokemon/:id", verifyToken, putpokemon);
router.delete("/deletepokemon/:id", verifyToken, deletepokemon);
router.post("/register", insertUser);

router.get("/pruebapgadmin", pruebapgadmin);
module.exports = router;
