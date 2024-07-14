// Gameboard (IIFE)
const gameBoard = (function () {
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const playerMove = (position, marker) => {
        if (board[position] === '') {
            board[position] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    return { getBoard, playerMove, resetBoard };
})();

// Player
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


    const gameStart = () => {
        players = [
            Player('Player 1', 'X'),
            Player(isComputerOpponent ? 'Computer' : 'Player 2', 'O')
        ];
        currentPlayerTurn = 0;
        gameOver = false;
        gameBoard.resetBoard();
        gameDisplay.updateBoard();
        gameDisplay.setMessage(`${players[currentPlayerTurn].getName()}'s turn`);
    };

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

    const playerMove = (position) => {
        if (!gameOver && gameBoard.playerMove(position, players[currentPlayerTurn].getMarker())) {
            gameDisplay.updateBoard();
            if (checkWin(players[currentPlayerTurn].getMarker())) {
                gameOver = true;
                gameDisplay.setMessage(`${players[currentPlayerTurn].getName()} wins!`);
            } else if (checkDraw()) {
                gameOver = true;
                gameDisplay.setMessage('It\'s a draw!');
            } else {
                currentPlayerTurn = currentPlayerTurn === 0 ? 1 : 0;
                gameDisplay.setMessage(`${players[currentPlayerTurn].getName()}'s turn`);

                if (isComputerOpponent && currentPlayerTurn === 1) {
                    setTimeout(computerMove, 500);
                }
            }
        }
    };

    const computerMove = () => {
        if (!gameOver) {
            const availablePositions = gameBoard.getBoard().reduce((acc, cell, index) => {
                if (cell === '') {
                    acc.push(index);
                }
                return acc;
            }, []);

            if (availablePositions.length > 0) {
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
        return winningCombos.some(combination => {
            return combination.every(position => gameBoard.getBoard()[position] === marker);
        });
    };

    const checkDraw = () => {
        return gameBoard.getBoard().every(gridCell => gridCell !== '');
    };

    const getCurrentPlayer = () => currentPlayerTurn;
    const getIsComputerOpponent = () => isComputerOpponent;

    return { gameStart, playerMove, toggleGameMode, getCurrentPlayer, getIsComputerOpponent};
})();

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const multiplayerButton = document.getElementById('multiplayer-mode');
    const computerButton = document.getElementById('computer-mode');

    // Set up initial game mode (multiplayer)
    multiplayerButton.classList.add('checked');
    computerButton.classList.remove('checked');

    // Start game in multiplayer mode
    Game.gameStart();

    document.getElementById('restart-button').addEventListener('click', Game.gameStart);

    multiplayerButton.addEventListener('click', () => {
        Game.toggleGameMode(false);
    });

    computerButton.addEventListener('click', () => {
        Game.toggleGameMode(true);
    });
});