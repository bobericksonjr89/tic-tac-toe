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
const gameController = (function() {

    //DOM
    const boardSpaces = document.querySelectorAll('.board-space')
    const nameButtons = document.querySelectorAll('.player-button');
    const nameFields = document.querySelectorAll('.player-input');
    const footer = document.querySelector('footer');

    //Events
    
    nameButtons.forEach(button => button.addEventListener('click', assignName));
    nameFields.forEach(field => field.addEventListener('keyup', detectEnter));

    // variables
    let turn;
    const people = [];

    function startGame() {
        document.querySelector("#board").style.display = 'flex';
        turn = 0;
        boardSpaces.forEach(space => space.addEventListener('click', whoseTurn));
    }

    function detectEnter(e) {
        if (e.keyCode === 13) {
         e.preventDefault();
         e.target.nextElementSibling.click();
        }
    }

    function assignName(e) {
        const name = e.target.previousElementSibling.value;
        const player = e.target.previousElementSibling.name;

        if (player === "X") {
            people[0] = Person(name, player);
        } else {
            people[1] = Person(name, player);
        }

        const parentElement = e.target.parentElement;

        parentElement.classList.remove('fade-in')
        parentElement.style.animationPlayState = "running";
        parentElement.addEventListener('animationend', (e) => {
            populateName(e, player, name)
        });

        if (people.length == 2) {
            setTimeout(startGame, 1500);
        }
    }

    function populateName(e, player, name) {
        const playerGroupDiv = e.target;
        playerGroupDiv.className = 'fade-in';
        playerGroupDiv.classList.add('player-name');
        playerGroupDiv.innerHTML = '';

        const para = document.createElement('p');
        para.innerText = `${name} is`;
        para.className = 'name-header';
        playerGroupDiv.appendChild(para)

        const header = document.createElement('h2');
        header.innerText = player;
        header.className = "player-header";
        if (header.innerText === 'X') {
            header.style.color = "var(--color-green)";
        } else {
            header.style.color = "var(--color-magenta)";
        }
        playerGroupDiv.appendChild(header);
    }

    function whoseTurn(e) {
        const spaceIndex = e.target.dataset.index;
        if (gameBoard.boardArray[spaceIndex] === '') {
            turn++;
            if (turn % 2 !== 0) {
                people[0].markSpace(spaceIndex);
                checkTurns(turn, people[0])
            } else {
                people[1].markSpace(spaceIndex);
                checkTurns(turn, people[1]);
            }
            gameBoard.renderBoard();
        };
    }

    function checkTurns(turn, player) {
        if (turn >= 5) {
            if (detectWin()) {
                endGame(player);
            } else if (turn == 9) {
                endGame('tie')
            }
        }
    }

    function detectWin() { 
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

    function endGame(player) {
        boardSpaces.forEach(space=> space.removeEventListener('click', whoseTurn));
        setTimeout(blurWindow, 500, player);
    }

    function blurWindow(player) {
        document.body.classList.add('blur');
        const winnerMessage = document.createElement('p');
        if (player === 'tie') {
            winnerMessage.innerText = "It's a tie!";
        } else {
            winnerMessage.innerText = `${player.getName()} won the game!`;
        }
        winnerMessage.className = "winner-message";
        const playAgain = document.createElement('button');
        playAgain.innerText = "Play Again"
        playAgain.className = "play-again";
        playAgain.addEventListener('click', restartGame);
        footer.appendChild(winnerMessage);
        footer.appendChild(playAgain);
    }

    function restartGame() {
        document.body.classList.remove('blur');
        const winnerMessage = document.querySelector('.winner-message');
        const playAgain = document.querySelector('.play-again');
        footer.removeChild(winnerMessage);
        footer.removeChild(playAgain);
        gameBoard.resetBoard();
    }

    return {boardSpaces, startGame};
})();

// module - board rendering and updating
const gameBoard = (function() {
    let boardArray = ['', '', '', '', '', '', '', '', ''];
    let scoreArray = [];

    function resetBoard() {
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = '';
        }

        for (let i = 0; i < scoreArray.length; i++) {
            scoreArray.pop();          
        }

        renderBoard();
        gameController.startGame();
    }


    function renderBoard() {
        let index = 0;
        boardArray.forEach(marker => populateBoard(marker, index++));
    }

    function populateBoard(marker, index) {
        gameController.boardSpaces[index].innerText = marker;
        if (marker === "X") {
            gameController.boardSpaces[index].style.color = 'var(--color-green)';
        } else if (marker === "O") {
            gameController.boardSpaces[index].style.color = 'var(--color-magenta)';
        }
    }
    

    renderBoard();

    return {boardArray, scoreArray, renderBoard, resetBoard};
})();