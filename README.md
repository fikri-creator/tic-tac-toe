# Tic-Tac-Toe

Two implementations of Tic-Tac-Toe in this repo:

| Implementation   | Stack                                         | How to run                     |
| ---------------- | --------------------------------------------- | ------------------------------ |
| `tic_tac_toe.rb` | Ruby CLI (OOP)                                | `ruby tic_tac_toe.rb`          |
| `index.html`     | Browser (vanilla HTML/CSS/JS, module pattern) | open `index.html` in a browser |

## Browser implementation

The browser version follows the "build a house from the inside out"
approach — game logic first, then DOM on top:

```
js/
├── gameboard.js        # IIFE — owns the cells array + win / tie checks
├── player.js           # factory — `{ name, marker }`
├── gameController.js   # IIFE — turn flow, end-state, status messages
├── displayController.js# IIFE — DOM rendering, subscribes to game events
└── main.js             # wires everything together on DOMContentLoaded
```

- `Gameboard` and `GameController` are wrapped in IIFEs because we only
  ever need a single instance of each.
- `createPlayer` is a factory called by `GameController` whenever a new
  game starts (so player names can change between rounds).
- `DisplayController` knows nothing about game rules — it just renders
  whatever the controller tells it to.
- The game logic was verified end-to-end before any DOM was wired up
  (`test_console.js`, 17 assertions covering wins, ties, occupied-cell
  rejection, and post-game rejection).

### Console tests

```bash
node test_console.js
```

### Design choices

- Cells are stored as an array of length 9, `""` for empty.
- Win detection checks all 8 lines (3 rows, 3 cols, 2 diagonals).
- Cell buttons are disabled after a win/tie so the UI matches the
  internal `isOver` flag — the click handler rejects moves regardless,
  the disabled attribute is just belt-and-suspenders.
- Names default to "Player One" / "Player Two" if the form fields are
  blank.

## Ruby CLI version

Game Tic-Tac-Toe sederhana berbasis Command Line yang dimainkan oleh dua orang secara bergantian. Dibuat menggunakan implementasi Object-Oriented Programming (OOP) di Ruby.

### Cara Bermain

1. Jalankan perintah berikut di terminal:
   ```bash
   ruby tic_tac_toe.rb
   ```
