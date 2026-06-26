// filepath: js/displayController.js
//
// DisplayController — owns the DOM. Subscribes to GameController changes
// and re-renders. Exposes nothing the game logic cares about, so the two
// stay decoupled.

const DisplayController = (function () {
  // The DOM lookups are deferred until `init()` is called so that this file
  // is safe to require/load before the DOM is parsed (e.g. for testing).
  let cells = [];
  let statusEl = null;
  let boardEl = null;
  let nameForm = null;
  let name1Input = null;
  let name2Input = null;
  let startBtn = null;
  let game = null;

  function render() {
    const boardCells = game.getBoard().getCells();
    for (let i = 0; i < boardCells.length; i += 1) {
      const cellEl = cells[i];
      const value = boardCells[i];
      cellEl.textContent = value;
      cellEl.classList.toggle("taken", value !== "");
      cellEl.classList.toggle("x", value === "X");
      cellEl.classList.toggle("o", value === "O");
      cellEl.disabled = value !== "" || game.getIsOver();
    }

    statusEl.textContent = game.statusMessage();
    statusEl.classList.toggle("winner", game.getIsOver() && game.getWinner() !== null);
    statusEl.classList.toggle("tie", game.getIsOver() && game.getWinner() === null);
  }

  function handleCellClick(event) {
    const cellEl = event.target.closest("[data-index]");
    if (!cellEl) return;
    const index = Number(cellEl.dataset.index);
    game.playRound(index);
  }

  function handleStart(event) {
    if (event) event.preventDefault();
    const n1 = name1Input.value || "Player One";
    const n2 = name2Input.value || "Player Two";
    game.startNewGame(n1, n2);
    statusEl.classList.remove("winner", "tie");
  }

  function init({ gameController, formEl, boardEl: boardRoot, statusEl: statusRoot }) {
    game = gameController;
    boardEl = boardRoot;
    statusEl = statusRoot;
    nameForm = formEl;
    name1Input = formEl.querySelector("#player-one-name");
    name2Input = formEl.querySelector("#player-two-name");
    startBtn = formEl.querySelector("#start-btn");

    cells = Array.from(boardEl.querySelectorAll("[data-index]"));

    boardEl.addEventListener("click", handleCellClick);
    nameForm.addEventListener("submit", handleStart);
    startBtn.addEventListener("click", handleStart);

    game.onChange(render);
    render();
  }

  return { init };
})();

if (typeof window !== "undefined") {
  window.DisplayController = DisplayController;
} else if (typeof globalThis !== "undefined") {
  globalThis.DisplayController = DisplayController;
}