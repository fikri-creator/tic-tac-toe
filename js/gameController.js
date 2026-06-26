// filepath: js/gameController.js
//
// GameController module — IIFE / module pattern.
// Owns the high-level flow of the game: who plays next, whether the
// last move ended the game, and what message should be shown to the
// user. The DOM layer subscribes to `onChange` to re-render.

const GameController = (function () {
  // Single instance exposed by gameboard.js. In the browser `Gameboard` is a
  // global (script load order); in Node tests we attach it to `globalThis`.
  // We resolve at call-time so module load order doesn't matter.
  function resolveBoard() {
    if (typeof Gameboard !== "undefined") return Gameboard;
    if (typeof globalThis !== "undefined" && globalThis.Gameboard) {
      return globalThis.Gameboard;
    }
    throw new Error("Gameboard module not loaded");
  }
  function resolveCreatePlayer() {
    if (typeof createPlayer !== "undefined") return createPlayer;
    if (typeof globalThis !== "undefined" && globalThis.createPlayer) {
      return globalThis.createPlayer;
    }
    throw new Error("player module not loaded");
  }

  let players = [];
  let activeIndex = 0;     // 0 -> player one, 1 -> player two
  let isOver = false;
  let winner = null;       // marker string, or null while in progress / on tie
  let listeners = [];

  function getActivePlayer() {
    return players[activeIndex];
  }

  function getWinner() {
    return winner;
  }

  function getIsOver() {
    return isOver;
  }

  function getPlayers() {
    return players.map((p) => ({ ...p }));
  }

  function statusMessage() {
    if (!isOver) {
      return `${getActivePlayer().name}'s turn (${getActivePlayer().marker})`;
    }
    if (winner) {
      const winningPlayer = players.find((p) => p.marker === winner);
      return `${winningPlayer.name} wins! 🎉`;
    }
    return "It's a tie! 🤝";
  }

  function emit() {
    listeners.forEach((fn) => fn());
  }

  function onChange(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }

  function playRound(index) {
    const board = resolveBoard();
    if (isOver) return { ok: false, reason: "game-over" };
    if (!board.isEmpty(index)) return { ok: false, reason: "occupied" };

    const player = getActivePlayer();
    board.placeMarker(index, player.marker);

    const winnerMarker = board.getWinnerMarker();
    if (winnerMarker) {
      isOver = true;
      winner = winnerMarker;
    } else if (board.isTie()) {
      isOver = true;
      winner = null;
    } else {
      activeIndex = activeIndex === 0 ? 1 : 0;
    }

    emit();
    return { ok: true };
  }

  function startNewGame(playerOneName, playerTwoName) {
    const board = resolveBoard();
    const cp = resolveCreatePlayer();
    board.reset();
    const name1 = (playerOneName || "Player One").trim() || "Player One";
    const name2 = (playerTwoName || "Player Two").trim() || "Player Two";
    players = [cp(name1, "X"), cp(name2, "O")];
    activeIndex = 0;
    isOver = false;
    winner = null;
    emit();
  }

  // Auto-start with default names so the console has something to play with
  // before any DOM has been wired up. Skip in environments where the
  // dependencies haven't been loaded yet.
  if (typeof Gameboard !== "undefined" || (typeof globalThis !== "undefined" && globalThis.Gameboard)) {
    startNewGame("Player One", "Player Two");
  }

  return {
    playRound,
    startNewGame,
    getActivePlayer,
    getWinner,
    getIsOver,
    getPlayers,
    statusMessage,
    onChange,
    getBoard: resolveBoard,
  };
})();

if (typeof window !== "undefined") {
  window.GameController = GameController;
}
if (typeof globalThis !== "undefined") {
  globalThis.GameController = GameController;
}