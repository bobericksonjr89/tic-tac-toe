// factory
const Person = function(name, icon) {
    const getName = () => name;
    const getIcon = () => icon;

    return {getName, getIcon};
};

// module
const gameBoard = (function() {
    const board = ['', '', '', '', '', '', '', '', ''];
    return {board};
})();

// module
const displayController = (function() {

    //DOM
    const boardSpaces = document.querySelectorAll('.board-space')

    //Events
    boardSpaces.forEach(space=> space.addEventListener('click', markSpace));

    let turn = 0;

    const player1 = Person("Player 1", "X");
    const player2 = Person("Player 2", "O");

    //functions
    function markSpace(e) {
        const spaceIndex = e.target.dataset.index;
        if (gameBoard.board[spaceIndex] === '') {
            const icon = whoseTurn();
            gameBoard.board[spaceIndex] = icon;
            renderBoard(gameBoard.board);     
            detectWin();
        }       
    }

    function whoseTurn() {
        turn++;
        if (turn % 2 !== 0) {
            return player1.getIcon();
        } else {
            return player2.getIcon();
        }
    }

    function detectWin() {

    };

    function renderBoard() {
        let index = 0;
        gameBoard.board.forEach(marker => populateBoard(marker, index++));
    }

    function populateBoard(marker, index) {
        boardSpaces[index].innerText = marker;
    }

    renderBoard();
})();