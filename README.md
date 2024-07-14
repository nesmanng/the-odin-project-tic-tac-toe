# Tic Tac Toe Project

## Overview
This project implements a web-based Tic Tac Toe game using HTML, CSS, and JavaScript. The game supports both multiplayer and single-player (vs computer) modes, with additional features like undoing moves and switching player markers (from 'X' to 'O' and vice-versa).

## Approach

### HTML Structure
- The game is structured within a main container div.
- It includes a header section with the game title and a brief description.
- The game board is represented by a 3x3 grid of cells.
- There are 3 buttons provided for (i) game restart; (ii) Undoing moves; and (iii) switching player's marker.
- Mode selection buttons allow toggling between multiplayer and computer opponent modes.

### CSS Styling
- The entire game - from header to gameboard - follows a centered layout.
- A grid system is implemented for the game board.
- Styles are applied to create an attractive and intuitive user interface.
- Responsive design principles are used to ensure the game looks good on various screen sizes.
-  Winning combinations are styled with green background when the game is over.

### JavaScript Implementation
The JavaScript code is organized using the module pattern and immediately invoked function expressions (IIFE) to encapsulate functionality:

1. **gameBoard Module**: 
   - Manages the game's state and gameboard operation
   - Maintains the gameboard as an array of 9 elements.
   - Provides methods:
    - `getBoard()`: Returns the current state of the board.
    - `playerMove(position, marker)`: Places a marker on the board, either actively by a player or by the computer (when in the `Computer Mode`).
    - `undoMove(position)`: Removes a marker from a specific position.
    - `resetBoard()`: Clears the board for a new game.

2. **Player Factory Function**: 
   - Creates player objects with names and markers
   - Takes `name` and `marker` as parameters.
   - Returns an object with methods:
    - `getName()`: Returns the player's name
    - `getMarker()`: Returns the player's marker (`X` or `O`)

3. **gameDisplay Module**: 
   - Handles the visual representation of the game board
   - Updates the game status messages
   - Provides methods:
    - `updateBoard()`: Refreshes the visual gameboard based on the gameBoard state.
    - `setMessage(message)`: Updates the game status message.

4. **Game Module**: 
   - Controls the overall game flow and logic
   - Manages player turns, win/draw conditions, and game mode switches
   - Implements computer player moves
   - Handles marker switching and move undoing
   - Implements key game functions:
    - `gameStart()`: Initializes or resets the game.
    - `toggleGameMode(isComputer)`: Switches between multiplayer and computer modes.
    - `switchMarker()`: Alternates the player's marker between X and O.
    - `playerMove(position)`: Handles a player's move, including win/draw checks.
    - `undoLastMove()`: Reverts the last move made.
    - `computerMove()`: Implements a simple AI for computer moves.
    - `checkWin(marker)` and `checkDraw()`: Evaluate game end conditions.
    - `highlightWinningCells(winningCombo)`: Visually indicates the winning combination.

5. **Utility Functions**: 
   - Includes a `customConfirm` function for displaying confirmation dialogs when any of the 3 buttons (`restart`, `back`, `switch`) is clicked. This is to prevent any accidental clicking to have an impact.

6. **Event Listeners**: 
   - Set up to handle user interactions with the game buttons and board

### Key Features
- Multiplayer and single-player (vs computer) modes
- Ability to switch player markers (X and O)
- Move undo functionality
- Game restart option
- Winning combination highlight
- Confirmation dialogs for important actions

### Design Patterns and Principles
- Module Pattern: Used to encapsulate and organize code
- Factory Functions: Employed for creating player objects
- Event-Driven Programming: Utilized for handling user interactions
- Separation of Concerns: Different aspects of the game are managed by separate modules

## Conclusion
This Tic Tac Toe implementation demonstrates a structured approach to web game development, incorporating modern JavaScript practices and design patterns. The project showcases skills in DOM manipulation, event handling, and game logic implementation.