// factory - what properties players have and what they can do
const Person = function(name, icon) {
    const getName = () => name;
    const getIcon = () => icon;

    const markSpace = (e, spaceIndex) => {
        gameBoard.boardArray[spaceIndex] = getIcon();   
    };

    return {getName, markSpace};
};

// module - controls the flow
const displayController = (function() {

    //DOM
    const boardSpaces = document.querySelectorAll('.board-space')

    //Events
    boardSpaces.forEach(space=> space.addEventListener('click', whoseTurn));

    let turn = 0;

    const player1 = Person("Player 1", "X");
    const player2 = Person("Player 2", "O");

    function whoseTurn(e) {
        const spaceIndex = e.target.dataset.index;
        if (gameBoard.boardArray[spaceIndex] === '') {
            turn++;
            if (turn % 2 !== 0) {
                player1.markSpace(e, spaceIndex);
            } else {
                player2.markSpace(e, spaceIndex);
            }
            gameBoard.renderBoard();
            detectWin();
        };
    }

    function detectWin() {  // MAGIC SQUARE ??
        return;
    };

    return {boardSpaces};
})();

// module - board rendering and updating
const gameBoard = (function() {
    const boardArray = ['', '', '', '', '', '', '', '', ''];

    function renderBoard() {
        let index = 0;
        boardArray.forEach(marker => populateBoard(marker, index++));
    }

    function populateBoard(marker, index) {
        displayController.boardSpaces[index].innerText = marker;
    }

    renderBoard();

    return {boardArray, renderBoard};
})();