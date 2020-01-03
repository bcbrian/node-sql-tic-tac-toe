var db = require("../models");

module.exports = {
  createGame: async function() {
    const g = await db.Game.create({
      player_1: "x", // x or o
      current_turn: "pending", // x or o or pending
      game: ",,,,,,,," // csv of "", x or o
    });
    return g.toJSON();
  },
  getGame: async function(id) {
    const g = await db.Game.findAll({ where: { id } });
    return g[0].toJSON();
  },
  api: function(app) {
    // Start Game
    app.post("/api/games", async (req, res) => {
      const dbGames = await db.Game.findAll({ where: { player_2: null } });
      if (dbGames[0]) {
        const dbGame = dbGames[0].toJSON();
        try {
          await db.Game.update(
            { ...dbGames[0], player_2: "o", current_turn: "x" },
            { where: { id: dbGame.id } }
          );
        } catch (e) {
          console.log(e);
        }
        const g = await this.getGame(dbGame.id);
        return res.json(g);
      }
      const g = await this.createGame();
      return res.json(g);
    });

    app.get("/api/games/:id", async (req, res) => {
      const g = await this.getGame(req.params.id);
      res.json(g);
    });

    // Create a new example
    // app.post("/api/games", this.postGameApi);

    // Delete an example by id
    app.put("/api/games/:id", async (req, res) => {
      console.log("SDJKFGHSDLJKFGH");
      await db.Game.update(req.body, { where: { id: req.params.id } });
      const g = await this.getGame(req.params.id);
      return res.json(g);
    });
  }
};
