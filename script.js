// factory - what properties players have and what they can do
const Person = function(name, icon, isComputer) {
    const getName = () => name;
    const getIcon = () => icon;
    const getIsComputer = () => isComputer;

    const markSpace = (spaceIndex) => {
        gameBoard.boardArray[spaceIndex] = getIcon();   
        if (getIcon() == 'X') {
            gameBoard.scoreArray[spaceIndex] = 1;
            return;
        } // else
        gameBoard.scoreArray[spaceIndex] = -1;
    };

    return {getName, getIsComputer, markSpace};
};

// module - controls the flow
const gameController = (function() {

    //DOM
    const boardSpaces = document.querySelectorAll('.board-space')
    const player1NameButton = document.querySelector('.player1-name-button');
    const player2NameButton = document.querySelector('.player2-name-button');
    const nameFields = document.querySelectorAll('.player-input');
    const footer = document.querySelector('footer');
    const humanButton = document.querySelector('#human');
    const computerButton = document.querySelector('#computer');
    const secondGroup = document.querySelector('.second-group');

    //Events
    player1NameButton.addEventListener('click', assignName);
    player2NameButton.addEventListener('click', waitForAnimationToEnd);
    nameFields.forEach(field => field.addEventListener('keyup', detectEnter));
    humanButton.addEventListener('click', assignHuman);
    computerButton.addEventListener('click', assignComputer);

    // variables
    let turn;
    const people = [];
    const MIN_TURNS = 5;  // minimum turns before a win
    const MAX_TURNS = 9; 

    // functions
    function detectEnter(e) {
        if (e.keyCode === 13) {
         e.preventDefault();
         e.target.nextElementSibling.click();
        }
    }

    function assignHuman(e) {
        const parentContainer = e.target.parentElement.parentElement;
        parentContainer.style.animationPlayState = "running";
        parentContainer.addEventListener('animationend', (e) => {
            parentContainer.style.animationPlayState = "paused";
            parentContainer.style.display = "none";
            secondGroup.style.display = 'flex';
            secondGroup.style.animationPlayState = "running";
            secondGroup.addEventListener('animationend', toggleAnimation);
        });
    }

    function toggleAnimation() {
        secondGroup.style.animationPlayState = "paused";
        secondGroup.classList.add('fade-out');
        secondGroup.removeEventListener('animationend', toggleAnimation);    
    }

    function assignComputer(e) {
        const parentContainer = e.target.parentElement.parentElement;
        parentContainer.style.animationPlayState = "running";

        people[1] = Person('Computer', 'O', true);
        parentContainer.addEventListener('animationend', (e) => {
            populateName(e, 'O', 'Computer');
        })

        detectPeople();
    }

    function waitForAnimationToEnd(e) {
        console.log(e);
        if (e.target.parentElement.style.animationPlayState === "running") {
            console.log("running")
            return;
        } else {
            assignName(e);
        }
        
    }

    function assignName(e) {
        console.log(e);
        const name = e.target.previousElementSibling.value;
        if (!name) {
            return;
        }
        const player = e.target.previousElementSibling.name;
        console.log(name, player);

        if (player === "X") {
            people[0] = Person(name, player, false);
        } else {
            people[1] = Person(name, player, false);
        }

        const parentElement = e.target.parentElement;

        parentElement.classList.remove('fade-in')
        parentElement.style.animationPlayState = "running";
        parentElement.addEventListener('animationend', (e) => {
            populateName(e, player, name)
        });

        detectPeople();
    }

    function detectPeople() {
        if (people[0] && people[1]) {
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

    function startGame() {
        document.querySelector("#board").style.display = 'flex';
        turn = 0;
        boardSpaces.forEach(space => space.addEventListener('click', whoseTurn));
    }

    function whoseTurn(e) {
        const spaceIndex = e.target.dataset.index;
        if (gameBoard.boardArray[spaceIndex] === '') {
            turn++;
            if (turn % 2 !== 0) {
                people[0].markSpace(spaceIndex);
                if(!checkTurns(turn, people[0])) { // make sure game isn't over
                    if (people[1].getIsComputer() === true) {
                        gameBoard.renderBoard();
                        const index = computerOpponent.computerTurn();
                        setTimeout(() => boardSpaces[index].click(), 500);
                        return;
                    }
                }
            } else {
                people[1].markSpace(spaceIndex);
                checkTurns(turn, people[1]);
            }

            gameBoard.renderBoard();
        };
    }

    function checkTurns(turn, player) {
        if (turn >= MIN_TURNS) {
            if (detectWin()) {
                endGame(player);
                return true;
            } else if (turn === MAX_TURNS) {
                endGame('tie')
                return true;
            }
        }
        return false;
    }

    function detectWin() { 
        const scoreArray = gameBoard.scoreArray;

        // row 1
        let score = scoreArray[0] + scoreArray[1] + scoreArray[2];
        if (checkScore(score)) {
            return true;
        } 
        // row 2
        score = scoreArray[3] + scoreArray[4] + scoreArray[5];
        if (checkScore(score)) {
            return true;
        } 

        // row 2
        score = scoreArray[6] + scoreArray[7] + scoreArray[8];
        if (checkScore(score)) {
            return true;
        } 

        // column 1
        score = scoreArray[0] + scoreArray[3] + scoreArray[6];
        if (checkScore(score)) {
            return true;
        } 

        // column 2
        score = scoreArray[1] + scoreArray[4] + scoreArray[7];
        if (checkScore(score)) {
            return true;
        } 

        // column 3
        score = scoreArray[2] + scoreArray[5] + scoreArray[8];
        if (checkScore(score)) {
            return true;
        } 
        
        // diag 1
        score = scoreArray[0] + scoreArray[4] + scoreArray[8];
        if (checkScore(score)) {
            return true;
        } 

        // diag 2
        score = scoreArray[2] + scoreArray[4] + scoreArray[6];
        if (checkScore(score)) {
            return true;
        } 
        return false;
    };

    function checkScore(score) {
        if (score === 3 || score === -3) {
            return true;
        }
        return false;
    }

    function endGame(player) {
        boardSpaces.forEach(space=> space.removeEventListener('click', whoseTurn));
        setTimeout(blurWindow, 200, player);
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

    // variables
    let boardArray = ['', '', '', '', '', '', '', '', ''];
    let scoreArray = [];

    // functions
    function resetBoard() {
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = '';
        }

        for (let i = 0; i < 9; i++) {
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

// module - AI
const computerOpponent = (function () {

    // variable
    let randomInt;

    // functions
    function getRandomInt() { 
        min = Math.ceil(0);
        max = Math.floor(9);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
      }

    function computerTurn() {
        do {
            randomInt = getRandomInt();
        } while (gameBoard.boardArray[randomInt] != '');
        return randomInt;
    }

    return {computerTurn};

})();