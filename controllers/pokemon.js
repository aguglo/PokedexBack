const listaPokemon = require("../models/listaPokemon");
const bcrypt = require("bcrypt");


//POST
exports.addpkmn = (req, res) => {
  const pokemon = req.body;
  listaPokemon.push(pokemon);
  res.send("Pokemon agregado: ");
};

//PUT
exports.putpokemon = (req, res) => {
  const pokemon = req.body;
  const { id } = req.params;
  const indiceAcualizar = listaPokemon.findIndex((pk) => pk.number == id);
  const pokemonProp = Object.keys(pokemon);
  pokemonProp.forEach((key) => {
    if (listaPokemon[indiceAcualizar][key] === pokemon[key]) {
      res.sendStatus(304);
      return;
    }
  });
  const poku = { ...listaPokemon[indiceAcualizar], ...pokemon };
  listaPokemon[indiceAcualizar] = poku;
  console.log(listaPokemon);
  res.sendStatus(204);
};

exports.deletepokemon = (req, res) => {
  const { id } = req.params;

  const borrarpokemon = listaPokemon.findIndex(
    (pokemon) => pokemon.number == id
  );
  listaPokemon.splice(borrarpokemon, 1);

  res.sendStatus(200);
};

exports.pruebapgadmin = (req, res) => {
  pool.query("SELECT * from public.prueba", (err, rows, fields) => {
    if (err) throw err;
    res.send(rows[0]);
  });
};

exports.insertUser = async (req, res) => {
  console.log(req.body);
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  try {
    pool.query(
      "INSERT INTO public.usuario (mail, password,name ) VALUES ($1, $2, $3)",
      [req.body.mail, password, req.body.name]
    );
    res.send("usuario creado correctamente");
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = pool.query("SELECT * FROM public.usuario WHERE mail=$1)", [
      req.body.mail,
    ]);
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    console.log(user[0]);
    const validPassword = await bcrypt.compare(
      req.body.password,
      user[0].password
    );
    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña no válida" });
    }
    return res.status(200).json({ error: null, data: "login ok", token });
  } catch (error) {
    res.status(400).send(error);
  }
};
// select *from public.usuario where mail= $1 ""
// [req.body.mail]
