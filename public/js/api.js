console.log("I am a module");
export default {
  getGame: function(id) {
    return fetch(`/api/games/${id}`).then(res => res.json());
  },
  startGame: function() {
    return fetch("/api/games", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then(res => res.json());
  },
  updateGame: function(game) {
    console.log("GAME >>> ", game);
    console.log("GAME >>> STR", JSON.stringify(game));
    return fetch(`/api/games/${game.id}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "PUT",
      body: JSON.stringify(game)
    }).then(res => res.json());
  }
};
