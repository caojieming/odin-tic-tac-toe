
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
    let gameDone = false;
    
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

    const getCurPlayer = () => curPlayer;

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
    const playTurn = () => {
        console.log(`It's ${curPlayer.name}'s turn!`);

        let validInput = false;
        let inputRC = '';
        while(!validInput) {
            inputRC = prompt(`Which row+column would you like to mark? Format like "13", which means row 1 column 3.`);

            try {
                const inputRow = parseInt(inputRC.substring(0,1)) - 1;
                const inputCol = parseInt(inputRC.substring(1,2)) - 1;
                const validCell = board.markCell(inputRow, inputCol, curPlayer.symbol);
                if(validCell) {
                    validInput = true;
                }
                else {
                    console.log("Cell occupied, please try again.");
                    continue;
                }
            }
            catch(err) {
                console.log("Invalid input, please try again.");
                continue;
            }
        }
        
        console.log("Current board: ");
        board.printBoard();
        // console.log(get1DBoard());
        console.log("===================================================================");


        // check board for end of game scenarios

        // check if curPlayer has 3 in a row
        if(checkWin()) {
            gameDone = true;
            console.log(`${curPlayer.name} wins!`);
        }
        // no playable spaces left
        if(!get1DBoard().includes('')) {
            gameDone = true;
            console.log("No possible moves left. Tie!");
        }

        // swap curPlayer for preparation of next turn
        switchPlayerTurn();
    };

    // playing a full game
    const playGame = () => {
        // gameDone is a GameController local var defaulting to false, only set to true in playTurn under appropriate circumstances
        while(!gameDone) {
            // play a turn
            playTurn();
        }
    };

    return {
        playTurn,
        getCurPlayer,
        playGame
    };
}

const game = GameController();
