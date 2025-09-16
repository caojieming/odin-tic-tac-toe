// gameboard factory
function Gameboard() {
    let board =
    [['', '', ''],
    ['', '', ''],
    ['', '', '']];

    // returns board as a 2d array
    const getBoard = () => board;

    // prints board out to console
    const printBoard = () => {
        for(let r = 0; r < board.length; r++) {
            let curRowStr = "";
            for(let c = 0; c < board[0].length; c++) {
                if(board[r][c] !== '') {
                    curRowStr += "[" + board[r][c] + "] ";
                }
                else {
                    // this is purely for aesthetics
                    curRowStr += "[ ] ";
                }
            }
            console.log(curRowStr);
        }
    };

    // marks a cell with x or o if the cell is empty
    //  returns true if marked successfully (inputs valid, cell was empty)
    //  returns false if didn't mark (inputs invalid, cell was already occupied)
    const markCell = (row, col, xo) => {
        if(board[row][col] === '') {
            board[row][col] = xo;
            return true;
        }
        else {
            return false;
        }
    };

    return {getBoard, printBoard, markCell};
}

/* Test code:
const board = Gameboard();
console.log(board.getBoard());
board.markCell(0, 0, 'x');
board.printBoard();
*/


// game logic factory
function GameController(player1 = "p1", player2 = "p2") {
    let board = Gameboard();
    let status = '';
    
    const players = [
        {
            name: player1,
            symbol: 'x'
        },
        {
            name: player2,
            symbol: 'o'
        }
    ];

    // list of 1d indices of winning positions, used for checkWin()
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];


    // defaulting to player 1's turn
    curPlayer = players[0];

    const getCurPlayer = () => curPlayer.name;

    const switchPlayerTurn = () => {
        if(curPlayer === players[0]) {
            curPlayer = players[1];
        }
        else {
            curPlayer = players[0];
        }
    };

    // convert 2d board to 1d array
    const get1DBoard = () => {
        return board.getBoard().flat(1)
    };

    // returns true if curPlayer has 3 in a row, false otherwise
    const checkWin = () => {
        // get converted 1d board so we can compare to winCombos
        const flatBoard = get1DBoard();

        for(let i = 0; i < winCombos.length; i++) {
            const [a, b, c] = winCombos[i];

            if(flatBoard[a] === curPlayer.symbol &&
                flatBoard[b] === curPlayer.symbol &&
                flatBoard[c] === curPlayer.symbol) {
                return true;
            }
        }
        return false;
    };

    // a single turn
    const playTurn = (row, col) => {
        // update board
        board.markCell(row, col, curPlayer.symbol);

        // check board for end of game scenarios

        // check if curPlayer has 3 in a row
        if(checkWin()) {
            status = curPlayer.name;
            return status;
        }
        // no playable spaces left
        if(!get1DBoard().includes('')) {
            status = "tie";
            return status;
        }

        // swap curPlayer for preparation of next turn
        switchPlayerTurn();

        // if it gets here, return a blank string, meaning no one has won yet
        return '';
    };

    return {
        playTurn,
        getCurPlayer,
        get1DBoard
    };
}


/* DOM code starts here */

function DisplayController() {
    let game;
    let gameIsOver = false;

    const boardDiv = document.querySelector("#board");
    const commentaryDiv = document.querySelector("#commentary");

    // converts board array to display elements
    const updateDisplay = () => {
        // clear display board
        boardDiv.textContent = '';

        // remake display board based off of game.get1DBoard()
        const cur1DBoard = game.get1DBoard();
        for(let i = 0; i < cur1DBoard.length; i++) {
            const curCell = document.createElement("button");
            curCell.classList.add("cell");
            curCell.setAttribute("id", `cell-${i+1}`);
            curCell.textContent = cur1DBoard[i];

            boardDiv.appendChild(curCell);
        }

        // initialize commentary box
        if(commentaryDiv.textContent == '') {
            commentaryDiv.textContent = `It's ${game.getCurPlayer()}'s turn!`;
        }
        
    };


    // click event handler for reset button
    const resetBtn = document.querySelector("#reset-button");
    resetBtn.addEventListener("click", resetClickHandler);

    function resetClickHandler() {
        // game object and display will be properly reset/updated in startClickHandler

        // reset commentary box (so it can be properly updated for next updateDisplay())
        commentaryDiv.textContent = '';
        // reset gameIsOver
        gameIsOver = false;
        // remove display board (will be regenerated in startClickHandler)
        boardDiv.textContent = '';
        // reveal startDiv
        startDiv.style.display = "block";
    }


    // click event handler for starting the game
    const startDiv = document.querySelector("#start");
    const startBtn = document.querySelector("#start-button");
    startBtn.addEventListener("click", startClickHandler);

    function startClickHandler() {
        // get player names
        const p1Name = startDiv.querySelector("#p1-name").value;
        const p2Name = startDiv.querySelector("#p2-name").value;
        // hide start div
        startDiv.style.display = "none";
        // start game (reset + update game object and display)
        game = GameController(p1Name, p2Name);
        updateDisplay();
    }


    // click event handler for board
    boardDiv.addEventListener("click", boardClickHandler);

    function boardClickHandler(event) {
        var element = event.target;
        let status = '';

        // only do something if game is not over and cell clicked is black
        if(!gameIsOver && element.textContent == '') {
            switch(element.id) {
                case "cell-1":
                    status = game.playTurn(0, 0);
                    break;
                case "cell-2":
                    status = game.playTurn(0, 1);
                    break;
                case "cell-3":
                    status = game.playTurn(0, 2);
                    break;
                case "cell-4":
                    status = game.playTurn(1, 0);
                    break;
                case "cell-5":
                    status = game.playTurn(1, 1);
                    break;
                case "cell-6":
                    status = game.playTurn(1, 2);
                    break;
                case "cell-7":
                    status = game.playTurn(2, 0);
                    break;
                case "cell-8":
                    status = game.playTurn(2, 1);
                    break;
                case "cell-9":
                    status = game.playTurn(2, 2);
                    break;
                default:
                    break;
            }

            // a move was made, so update display
            updateDisplay();

            if(status === '') {
                // no winner yet
                commentaryDiv.textContent = `It's ${game.getCurPlayer()}'s turn!`;
            }
            else if(status === "tie") {
                // state in commentary box that its a tie
                commentaryDiv.textContent = "It's a tie! No one wins!";
                gameIsOver = true;
            }
            else {
                // state the winner in the commentary box
                commentaryDiv.textContent = `Game over! ${status} wins!`;
                gameIsOver = true;
            }
        }

    }

}

DisplayController();
