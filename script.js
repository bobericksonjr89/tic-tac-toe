// module
const gameBoard = (function() {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];
    return {board};
})();

// module
const displayController = (function() {

    //DOM
    const spaceArray = document.querySelectorAll('.board-space')

    function renderBoard(board) {
        let index = 0;
        board.forEach(space => populateBoard(space, index++));
    }

    function populateBoard(space, index) {
        let para = document.createElement('p');
        para.innerText = space;
        para.className = 'game-marker';

        spaceArray[index].appendChild(para);
        console.log(spaceArray[index]);
    }

    renderBoard(gameBoard.board);
})();

// factory
const Person = function(name) {

};