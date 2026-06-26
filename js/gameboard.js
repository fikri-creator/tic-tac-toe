// filepath: js/gameboard.js
//
// Gameboard module — IIFE / module pattern.
// Only one board is needed in the entire app, so we expose a single
// instance via `Gameboard`. Internally the cells are stored as an
// array of length 9 (`""` means empty, otherwise the player's marker).

const Gameboard = (function () {
  const cells = Array(9).fill("");

  const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  function getCells() {
    // Return a copy so callers can't mutate our internal state directly.
    return cells.slice();
  }

  function isEmpty(index) {
    return cells[index] === "";
  }

  function placeMarker(index, marker) {
    if (index < 0 || index > 8) return false;
    if (!isEmpty(index)) return false;
    cells[index] = marker;
    return true;
  }

  function getWinnerMarker() {
    for (const [a, b, c] of WINNING_LINES) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  }

  function isFull() {
    return cells.every((cell) => cell !== "");
  }

  function isTie() {
    return getWinnerMarker() === null && isFull();
  }

  function isGameOver() {
    return getWinnerMarker() !== null || isTie();
  }

  function reset() {
    for (let i = 0; i < cells.length; i += 1) {
      cells[i] = "";
    }
  }

  return {
    getCells,
    isEmpty,
    placeMarker,
    getWinnerMarker,
    isFull,
    isTie,
    isGameOver,
    reset,
  };
})();

// Expose on window for browser use; also on globalThis so the modules are
// available for Node testing (each CommonJS module has its own scope, so we
// need a shared global to reach the IIFE return value from a sibling module).
if (typeof window !== "undefined") {
  window.Gameboard = Gameboard;
}
if (typeof globalThis !== "undefined") {
  globalThis.Gameboard = Gameboard;
}