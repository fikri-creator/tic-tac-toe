// filepath: test_console.js
//
// Node-only sanity check for the game modules. Simulates a couple of
// games (a win for X and a tie) without touching the DOM.
//
// Run with:  node test_console.js

// Minimal `window` shim so the IIFEs that check `typeof window` still
// expose themselves on something we can read here.
global.window = {};

require("./js/gameboard.js");
require("./js/player.js");
require("./js/gameController.js");

const { Gameboard: Board, GameController: Game } = global.window;
const { createPlayer } = global.window;

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed += 1;
    console.log(`  ✓ ${msg}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${msg}`);
  }
}

// --- Game 1: X wins via the top row (0,1,2) ---
console.log("Game 1 — X wins across top row");
Game.startNewGame("Alice", "Bob");
assert(Game.statusMessage().includes("Alice"), "starts with Alice's turn");
assert(Game.playRound(0).ok, "Alice plays top-left");
assert(Game.playRound(3).ok, "Bob plays middle-left");
assert(Game.playRound(1).ok, "Alice plays top-middle");
assert(Game.playRound(4).ok, "Bob plays center");
assert(Game.playRound(2).ok, "Alice plays top-right");
assert(Game.getIsOver(), "game is over");
assert(Game.getWinner() === "X", "X is the winner");
assert(Game.statusMessage().includes("Alice wins"), "status reports Alice's win");

// Reject moves after the game is over
assert(!Game.playRound(5).ok, "cannot move after game over");

// --- Game 2: Tie ---
console.log("\nGame 2 — Tie");
Game.startNewGame("Alice", "Bob");
// Sequence that fills the board without a winner:
// X O X
// X O O
// O X X
const tieMoves = [0, 1, 2, 4, 7, 3, 5, 8, 6]; // 9th move (6) finishes the tie
for (let i = 0; i < tieMoves.length; i += 1) {
  const result = Game.playRound(tieMoves[i]);
  if (!result.ok) {
    console.error(`  ✗ move ${i} (cell ${tieMoves[i]}) was rejected: ${result.reason}`);
    failed += 1;
  }
}
assert(Game.getIsOver(), "tie game is over");
assert(Game.getWinner() === null, "no winner in a tie");
assert(Game.statusMessage().includes("tie"), "status reports a tie");

// --- Game 3: Occupied cell rejection ---
console.log("\nGame 3 — Occupied cell rejection");
Game.startNewGame("Alice", "Bob");
Game.playRound(4); // Alice plays center
const rejected = Game.playRound(4); // Bob tries the same square
assert(!rejected.ok && rejected.reason === "occupied", "occupied cell rejected");

// --- Game 4: Diagonal win for O ---
console.log("\nGame 4 — O wins on a diagonal");
Game.startNewGame("Alice", "Bob");
const diagMoves = [0, 2, 1, 4, 3]; // X=0,1,3 ; O=2,4 -> diag 2,4,6 needs cell 6 next
Game.playRound(diagMoves[0]);
Game.playRound(diagMoves[1]);
Game.playRound(diagMoves[2]);
Game.playRound(diagMoves[3]);
Game.playRound(8); // X plays corner-9
const finalO = Game.playRound(6); // O plays bottom-left -> O wins diagonal 2,4,6
assert(finalO.ok, "O plays bottom-left");
assert(Game.getWinner() === "O", "O wins the diagonal");
assert(Game.statusMessage().includes("Bob wins"), "status reports Bob's win");

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);