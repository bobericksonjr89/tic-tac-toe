// factory - what properties players have and what they can do
const Person = function(name, icon) {
    const getName = () => name;
    const getIcon = () => icon;

    const markSpace = (spaceIndex) => {
        gameBoard.boardArray[spaceIndex] = getIcon();   
        if (getIcon() == 'X') {
            gameBoard.scoreArray[spaceIndex] = 1;
            return;
        } // else
        gameBoard.scoreArray[spaceIndex] = -1;
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
                player1.markSpace(spaceIndex);
                checkTurns(turn, player1)
            } else {
                player2.markSpace(spaceIndex);
                checkTurns(turn, player2);
            }
            gameBoard.renderBoard();
        };
    }

    function checkTurns(turn, player) {
        if (turn >= 5) {
            if (detectWin()) {
                console.log(`${player.getName()} wins!`)
                endGame();
            } else if (turn == 9) {
                console.log("It's a tie!")
            }
        }
    }

    function detectWin() {  // MAGIC SQUARE ??
        const scoreArray = gameBoard.scoreArray;

        // row 1
        let score = scoreArray[0] + scoreArray[1] + scoreArray[2];
        if (score === 3 || score === -3) {
            return true;
        } 
        // row 2
        score = scoreArray[3] + scoreArray[4] + scoreArray[5];
        if (score === 3 || score === -3) {
            return true;
        } 

        // row 2
        score = scoreArray[6] + scoreArray[7] + scoreArray[8];
        if (score === 3 || score === -3) {
            return true;
        } 

        // column 1
        score = scoreArray[0] + scoreArray[3] + scoreArray[6];
        if (score === 3 || score === -3) {
            return true;
        } 

        // column 2
        score = scoreArray[1] + scoreArray[4] + scoreArray[7];
        if (score === 3 || score === -3) {
            return true;
        } 

        // column 3
        score = scoreArray[2] + scoreArray[5] + scoreArray[8];
        if (score === 3 || score === -3) {
            return true;
        } 
        
        // diag 1
        score = scoreArray[0] + scoreArray[4] + scoreArray[8];
        if (score === 3 || score === -3) {
            return true;
        } 

        // diag 2
        score = scoreArray[2] + scoreArray[4] + scoreArray[6];
        if (score === 3 || score === -3) {
            return true;
        } 
        return false;
    };

    function endGame() {
        boardSpaces.forEach(space=> space.removeEventListener('click', whoseTurn));
    }

    return {boardSpaces};
})();

// module - board rendering and updating
const gameBoard = (function() {
    const boardArray = ['', '', '', '', '', '', '', '', ''];
    const scoreArray = [];

    function renderBoard() {
        let index = 0;
        boardArray.forEach(marker => populateBoard(marker, index++));
    }

    function populateBoard(marker, index) {
        displayController.boardSpaces[index].innerText = marker;
    }

    renderBoard();

    return {boardArray, scoreArray, renderBoard};
})();