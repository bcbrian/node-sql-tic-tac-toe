import API from "/js/api.js";

function playGame() {
  let game = null;
  let board = [];
  let player = null;
  async function startGame() {
    game = await API.startGame();
    board = game.game.split(",");
    renderBoard();
    console.log(game);

    //
    localStorage.setItem(game.id, game.player_2 ? "o" : "x");
    player = game.player_2 ? "o" : "x";
  }
  startGame();

  async function getGame(cb) {
    console.log("YO GETTING THE GAME?");
    if (!game) {
      console.log("no game");
      cb();
      return;
    }
    game = await API.getGame(game.id);
    console.log("GOT GAME?", game);
    board = game.game.split(",");
    renderBoard();
    console.log(game);
    cb();
  }

  function gameLoop() {
    setTimeout(function() {
      if (!game) {
        return gameLoop();
      }
      console.log(
        "HI",
        game.current_turn,
        player,
        game.current_turn !== player
      );
      if (game.current_turn !== player) {
        getGame(gameLoop);
      }
    }, 100);
  }
  gameLoop();

  function renderBoard() {
    const gameContainerEl = document.getElementById("game-container");
    if (game.current_turn === "pending") {
      return (gameContainerEl.innerHTML = game.current_turn);
    }
    gameContainerEl.innerHTML = `
      <div class="row">
        <div id="0" class="col col--${board[0] || "n"}">
          ${board[0]}
        </div>
        <div id="1" class="col col--${board[1] || "n"}">
          ${board[1]}
        </div>
        <div id="2" class="col col--${board[2] || "n"}">
          ${board[2]}
        </div>
      </div>
      <div class="row">
        <div id="3" class="col col--${board[3] || "n"}">
          ${board[3]}
        </div>
        <div id="4" class="col col--${board[4] || "n"}">
          ${board[4]}
        </div>
        <div id="5" class="col col--${board[5] || "n"}">
          ${board[5]}
        </div>
      </div>
      <div class="row">
        <div id="6" class="col col--${board[6] || "n"}">
          ${board[6]}
        </div>
        <div id="7" class="col col--${board[7] || "n"}">
          ${board[7]}
        </div>
        <div id="8" class="col col--${board[8] || "n"}">
          ${board[8]}
        </div>
      </div>
    `;
  }

  function handleClick() {
    const gameContainerEl = document.getElementById("game-container");
    gameContainerEl.addEventListener("click", function(event) {
      // check to see if it is thier turn,
      // if not then return

      // get clicked square
      const { target } = event;
      const targetId = parseInt(target.id, 10);
      // check to see if it is taken
      // if taken... do nothing
      if (board[targetId]) {
        return;
      }

      // if they can go there
      board[targetId] = game.current_turn;
      // send an update to the back end
      renderBoard(game);
      API.updateGame({
        ...game,
        current_turn: game.current_turn === "x" ? "o" : "x",
        game: board.join(",")
      }).then(theGame => {
        game = theGame;
        board = game.game.split(",");
        gameLoop();
      });
    });
  }
  handleClick();
}
playGame();

/*
// Get references to page elements
const exampleTextEl = document.getElementById("example-text");
const exampleDescriptionEl = document.getElementById("example-description");
const submitBtnEl = document.getElementById("submit");
const exampleListEl = document.getElementById("example-list");

// The API object contains methods for each kind of request we'll make
const API = {
  saveExample: function(example) {
    return fetch("/api/examples", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(example)
    }).then(res => res.json());
  },
  getExamples: function() {
    return fetch("/api/examples").then(res => res.json());
  },
  deleteExample: function(id) {
    return fetch("/api/examples/" + id, {
      method: "DELETE"
    }).then(res => res.json);
  }
};

// refreshExamples gets new examples from the db and repopulates the list
const refreshExamples = function() {
  API.getExamples().then(function(data) {
    const exampleEls = data.map(function(example) {
      const aEl = document.createElement("a");
      aEl.innerHTML = example.text;
      aEl.setAttribute("href", "/example/" + example.id);

      const liEl = document.createElement("li");
      liEl.classList.add("list-group-item");
      liEl.setAttribute("data-id", example.id);
      liEl.append(aEl);

      const buttonEl = document.createElement("button");
      buttonEl.classList.add("btn", "btn-danger", "float-right", "delete");
      buttonEl.innerHTML = "ｘ";
      buttonEl.addEventListener("click", handleDeleteBtnClick);

      liEl.append(buttonEl);

      return liEl;
    });

    exampleListEl.innerHTML = "";
    exampleListEl.append(...exampleEls);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
const handleFormSubmit = function(event) {
  event.preventDefault();

  const example = {
    text: exampleTextEl.value.trim(),
    description: exampleDescriptionEl.value.trim()
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  exampleTextEl.value = "";
  exampleDescriptionEl.value = "";
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
const handleDeleteBtnClick = function(event) {
  const idToDelete = event.target.parentElement.getAttribute("data-id");
  debugger;
  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
submitBtnEl.addEventListener("click", handleFormSubmit);
document.querySelectorAll(".delete").forEach(btn => {
  btn.addEventListener("click", handleDeleteBtnClick);
});

*/
