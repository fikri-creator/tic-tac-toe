// filepath: js/player.js
//
// Player factory — creates a player object with a name and a marker.
// Players are short-lived: we build new ones whenever a fresh game starts
// so each player can have whatever name the user typed in.

function createPlayer(name, marker) {
  return {
    name,
    marker,
  };
}

if (typeof window !== "undefined") {
  window.createPlayer = createPlayer;
}
if (typeof globalThis !== "undefined") {
  globalThis.createPlayer = createPlayer;
}