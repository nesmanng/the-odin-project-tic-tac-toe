// Gameboard (IIFE)
const gameBoard = (function () {
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    // Place a marker on the gameboard at the specified position
    const placeMarker = (position, marker) => {
        if (board[position] === '') {
            board[position] = marker;
            return true; // Move was successful
        }
        return false; // Move was invalid
    };

    // Remove a marker from the gameboard at the specified position
    const undoMove = (position) => {
        board[position] = '';
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    // Return objects containing references to the functions that should be publicly accessible
    return { getBoard, placeMarker, resetBoard, undoMove };
})();

// Player factory function
const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
};

// Module to create a visual representation of the gameboard
const gameDisplay = (() => {
    const boardElement = document.getElementById('game-board');
    const messageElement = document.getElementById('game-status');

    const updateBoard = () => {
        boardElement.innerHTML = '';
        gameBoard.getBoard().forEach((gridCell, position) => {
            const gridCellElement = document.createElement('div');
            gridCellElement.classList.add('grid-cell');
            gridCellElement.setAttribute('data-position', position);
            gridCellElement.textContent = gridCell;
            gridCellElement.addEventListener('click', () => Game.playerMove(position));
            boardElement.appendChild(gridCellElement);
        });
    };

    const setMessage = (message) => {
        messageElement.textContent = message;
    };

    return { updateBoard, setMessage };
})();

// Game - control the overall game flow and logic
const Game = (() => {
    let players;
    let currentPlayerTurn;
    let gameOver;
    let isComputerOpponent = false; // Default to multiplayer mode
    let player1Marker = 'X'; // Default marker for player 1
    let moveHistory = []; // Store the history of moves made in the game


    const gameStart = () => {
        // Create two player objects with names and markers using the Player factory function
        players = [
            Player('Player 1', player1Marker),
            Player(isComputerOpponent ? 'Computer' : 'Player 2', player1Marker === 'X' ? 'O' : 'X')
        ];
        currentPlayerTurn = 0; // Player 1 starts the game
        gameOver = false;
        moveHistory = [];
        gameBoard.resetBoard(); 
        gameDisplay.updateBoard();
        gameDisplay.setMessage(`${players[currentPlayerTurn].getName()}'s turn (${players[currentPlayerTurn].getMarker()})`);
    };

    // Toggle between multiplayer and single player mode
    const toggleGameMode = (isComputer) => {
        isComputerOpponent = isComputer;
        const multiplayerButton = document.getElementById('multiplayer-mode');
        const computerButton = document.getElementById('computer-mode');
        
        if (isComputerOpponent) {
            multiplayerButton.classList.remove('checked');
            computerButton.classList.add('checked');
        } else {
            multiplayerButton.classList.add('checked');
            computerButton.classList.remove('checked');
        }
        
        gameStart(); // Restart the game when mode changes
    };

    const switchMarker = () => {
        player1Marker = player1Marker === 'X' ? 'O' : 'X';
        gameStart(); // Restart the game when marker changes
    };

    const playerMove = (position) => {
        // Check if the game is over or the grid cell is already occupied
        if (!gameOver && gameBoard.placeMarker(position, players[currentPlayerTurn].getMarker())) {
            moveHistory.push(position);
            gameDisplay.updateBoard();
            if (checkWin(players[currentPlayerTurn].getMarker())) {
                gameOver = true;
                gameDisplay.setMessage(`${players[currentPlayerTurn].getName()} wins!`);
            } else if (checkDraw()) {
                gameOver = true;
                gameDisplay.setMessage('It\'s a draw!');
            } else {
                currentPlayerTurn = currentPlayerTurn === 0 ? 1 : 0;
                gameDisplay.setMessage(`${players[currentPlayerTurn].getName()}'s turn (${players[currentPlayerTurn].getMarker()})`);

                if (isComputerOpponent && currentPlayerTurn === 1) {
                    setTimeout(computerMove, 300);
                }
            }
        }
    };

    const undoLastMove = () => {
        if (moveHistory.length > 0) {
            const lastMove = moveHistory.pop();
            gameBoard.undoMove(lastMove);
            if (isComputerOpponent && moveHistory.length > 0) {
                const playerLastMove = moveHistory.pop();
                gameBoard.undoMove(playerLastMove);
            }
            currentPlayerTurn = currentPlayerTurn === 0 ? 1 : 0;
            gameOver = false;
            gameDisplay.updateBoard();
            gameDisplay.setMessage(`${players[currentPlayerTurn].getName()}'s turn (${players[currentPlayerTurn].getMarker()})`);
        }
    };

    const computerMove = () => {
        if (!gameOver) {
            // Iterate through the gameboard to find unchecked grid cells
            const availablePositions = gameBoard.getBoard().reduce((acc, gridCell, position) => {
                // Add the position to the accumulator if the grid cell is empty
                if (gridCell === '') {
                    acc.push(position);
                }
                // Return the final accumulator containing all empty positions on the gameboard
                return acc;
            }, []);

            if (availablePositions.length > 0) {
                // Generate a random position from the available positions and make the move
                const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
                playerMove(randomPosition);
            }
        }
    };

    const checkWin = (marker) => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        // Find a winning combination defined in the winningCombos array
        const winningCombo = winningCombos.find(combination => 
            combination.every(position => gameBoard.getBoard()[position] === marker)
        );
        
        if (winningCombo) {
            highlightWinningCells(winningCombo);
            return true;
        }
        return false;
    };

    const highlightWinningCells = (winningCombo) => {
        winningCombo.forEach(position => {
            const gridCellElement = document.querySelector(`.grid-cell[data-position="${position}"]`);
            gridCellElement.classList.add('winning-cell');
        });
    };

    const checkDraw = () => {
        return gameBoard.getBoard().every(gridCell => gridCell !== '');
    };

    const getCurrentPlayer = () => currentPlayerTurn;
    const getIsComputerOpponent = () => isComputerOpponent;

    return { gameStart, playerMove, toggleGameMode, getCurrentPlayer, getIsComputerOpponent, switchMarker, undoLastMove};
})();

const customConfirm = (message) => {
    return  window.confirm(message);
};

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const multiplayerButton = document.getElementById('multiplayer-mode');
    const computerButton = document.getElementById('computer-mode');

    // Set up initial game mode (multiplayer)
    multiplayerButton.classList.add('checked');
    computerButton.classList.remove('checked');

    // Start game in multiplayer mode
    Game.gameStart();

    document.getElementById('restart-button').addEventListener('click', async() =>{
        const confirmed = await customConfirm('Are you sure you want to restart the game?');
        if (confirmed) {
            Game.gameStart();
        }
    });

    document.getElementById('switch-button').addEventListener('click', async() => {
        const confirmed = await customConfirm('Are you sure you want to switch markers? This will cause the game to restart.');
        if (confirmed) {
            Game.switchMarker();
        }
    });

    document.getElementById('back-button').addEventListener('click', async() => {
        const confirmed = await customConfirm('Are you sure you want to undo the last move?');
        if (confirmed) {
            Game.undoLastMove();
        }
    });
    
    multiplayerButton.addEventListener('click', () => {
        Game.toggleGameMode(false);
    });

    computerButton.addEventListener('click', () => {
        Game.toggleGameMode(true);
    });
});