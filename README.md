# Tic Tac Toe

Score three in a row, column, or diagnal to win.  Play against a local human opponent, or the computer.

## Features

- Player objects created with a factory function.
- Modules to handle the flow of the game, appearance of the gameboard, and the logic of the computer oppponent.
- Closure & private functions.

## Player Factory

Player objects are created with a factory function.  The factory stores the player's name, icon, a boolean expressing whether or
or not the player is a computer, and the logic to make a move.  The getName, isComputer, and makeMove functions are public
so the modules can access them.

## Controller Module

- Controls the flow of the game.
- Handles the player selection and player name input & display.
- Deals with most of the DOM selectors and event handlers.
- Mostly private functions, with the startGame function and boardSpaces node array revealed to other modules.

## Board Module

- Controls the rendering and resetting of the game board.

## Computer Opponent Module

- Mostly private functions that find a random legal move for the computer opponent to play.

## Credit

Robert Erickson, 2021