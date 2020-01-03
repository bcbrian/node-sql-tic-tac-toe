module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define("Game", {
    player_1: DataTypes.STRING, // x or o
    player_2: DataTypes.STRING, // x or o
    current_turn: DataTypes.STRING, // x or o or pending
    winner: DataTypes.STRING, // x or o
    game: DataTypes.STRING // csv of "", x or o
  });
  return Game;
};
