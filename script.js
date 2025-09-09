
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
    //  returns true if marked successfully (cell was empty)
    //  returns false if didn't mark (cell was already occupied)
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
    board = Gameboard();
    
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

    // defaulting to player 1's turn
    curPlayer = players[0];

    const switchPlayerTurn = () => {
        if(curPlayer === players[0]) {
            curPlayer = players[1];
        }
        else {
            curPlayer = players[0];
        }
    };
    
    const getCurPlayer = () => curPlayer;

    const playRound = () => {
        console.log(`It's ${curPlayer.name}'s turn!`);

        // inputs don't have a safeguard against invalid inputs
        let inputRow = prompt("Which row would you like to mark? (0, 1, 2)");
        let inputCol = prompt("Which column would you like to mark? (0, 1, 2)");

        board.markCell(parseInt(inputRow), parseInt(inputCol), curPlayer.symbol);

        console.log("Current board: ");
        board.printBoard();

        switchPlayerTurn();

    };

    return {
        playRound,
        getCurPlayer
    };

}

const game = GameController();
