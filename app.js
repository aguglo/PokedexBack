const express = require("express");
const pokemonruta = require("./routes/pokemon");
const cors = require("cors");
const authRouter = require("./routes/auth");
const app = express();
const PORT = 3010;
const db = require('./controllers/index');

app.use (cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", pokemonruta, authRouter);

app.get("/pokemones", async (req, res, next) => {
  try {
    const pokemonResults = [];

    const pokemones = await db.query(`SELECT p.id pokemon_id,
                                     p.name,
                                     p.description,
                                     type_1,
                                     type_2,
                                      a.weight,
                                      a.height,
                                       a.moves,
                                       bs.hp,
                                       bs.def,
                                       bs.atk,
                                       bs.satk,
                                       bs.sdef,
                                       bs.spd,
                                      img
                                    FROM   pokemon p
                                      JOIN about a
                                        ON a.id = p.about_id
                                      JOIN base_stats bs
                                        ON bs.id = p.base_stats_id `);
for (let index = 0; index < pokemones.rows.length; index++) {
      pokemonResults.push({
        id: pokemones.rows[index].pokemon_id,
        name: pokemones.rows[index].name,
        img: pokemones.rows[index].img,
        about: {
          info: pokemones.rows[index].description,
          height: pokemones.rows[index].height,
          weight: pokemones.rows[index].weight,
          moves: pokemones.rows[index].moves,
        },
        types: {
          element1: pokemones.rows[index].type_1,
          element2: pokemones.rows[index].type_2,
        },
        baseStats: {
          hp: pokemones.rows[index].hp,
          def: pokemones.rows[index].def,
          atk: pokemones.rows[index].atk,
          satk: pokemones.rows[index].satk,
          sdef: pokemones.rows[index].sdef,
          spd: pokemones.rows[index].spd,
        },
      });
    }

    return res
      .status(200)
      .json({ loading: false, data: { results: pokemonResults } });
  } catch (error) {
    return next(error);
  }
});

app.listen(PORT, () =>
  console.log(`Server listening in http://localhost:${PORT}`)
);
