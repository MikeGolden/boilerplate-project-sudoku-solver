'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coordinate = req.body.coordinate;
      let value = req.body.value;
      const rowsLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
      
      if (!coordinate || !value || !puzzle) {
        return res.json({ error: 'Required field(s) missing' });
      }
      
      const validatedPuzzle = solver.validate(puzzle);

      if (validatedPuzzle !== 'valid') {
        return res.json(validatedPuzzle);
      }

      if (!/^[A-I][1-9]$/i.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate'});
      }

      if (!/^[1-9]$/.test(value.toString())) {
        return res.json({ error: 'Invalid value' });
      }
      
      const board = parsePuzzleToArray(puzzle);
      const rowLetter = coordinate.split('')[0];
      const row = rowsLetters.indexOf(rowLetter.toUpperCase());
      const col = coordinate.split('')[1] - 1;
      
      const checkRow = solver.checkRowPlacement(row, col, value, board);
      const checkCol = solver.checkColPlacement(row, col, value, board);
      const checkRegion = solver.checkRegionPlacement(row, col, value, board);
      const obj = {
        row: checkRow,
        column: checkCol,
        region: checkRegion
      }
      
      let valid = false;
      let conflict = [];
      
      if (checkRow && checkCol && checkRegion) {
        valid = true;
      }
            
      for (let prop in obj) {
        if (obj[prop] === false) {
          conflict.push(prop);
        }
      }

      if (conflict.length > 0) {
        return res.json({ valid: valid, conflict: conflict });
      } else {
        return res.json({ valid: valid });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      
      const validatedPuzzle = solver.validate(puzzle);    
      
      if (validatedPuzzle !== 'valid') {
        return res.json(validatedPuzzle);
      }

      const board = parsePuzzleToArray(puzzle);

      if (solver.solve(board)) {
        let boardString = '';
        for (let i = 0; i < solver.board.length; i++) {
          for (let j = 0; j < solver.board[i].length; j++) {
            boardString += solver.board[i][j];
          }
        }

        return res.json({ solution: boardString });
      } else {
        // If it isn't solved return 
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      
    });

  function parsePuzzleToArray(puzzle) {
    let board = [];    
    let row = [];
    for (let i=0; i < puzzle.length; i++) {  
      if (puzzle[i] === '.') {
        row.push(0);
      } else {
        row.push(parseInt(puzzle[i]));
      }
      if (row.length === 9) {
        board.push(row);
        row = [];
      }
    }
    return board;
  }
};
