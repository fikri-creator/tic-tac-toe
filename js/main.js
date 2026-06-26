// filepath: js/main.js
//
// Entry point — wire the modules together once the DOM is ready.

document.addEventListener("DOMContentLoaded", () => {
  DisplayController.init({
    gameController: GameController,
    formEl: document.querySelector("#player-form"),
    boardEl: document.querySelector("#board"),
    statusEl: document.querySelector("#status"),
  });
});