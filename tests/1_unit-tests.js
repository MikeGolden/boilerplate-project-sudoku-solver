const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {

  const validString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  
  const validBoard = [
    [0, 0, 9, 0, 0, 5, 0, 1, 0],
    [8, 5, 0, 4, 0, 0, 0, 0, 2],
    [4, 3, 2, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 6, 9, 0, 8, 3],
    [0, 9, 0, 0, 0, 0, 0, 6, 0],
    [6, 2, 0, 7, 1, 0, 0, 0, 9],
    [0, 0, 0, 0, 0, 0, 1, 9, 4],
    [5, 0, 0, 0, 0, 4, 0, 3, 7],
    [0, 4, 0, 3, 0, 0, 6, 0, 0]
  ];

  const solvedBoard = [
    [7, 6, 9, 2, 3, 5, 4, 1, 8],
    [8, 5, 1, 4, 9, 6, 3, 7, 2],
    [4, 3, 2, 1, 7, 8, 9, 5, 6],
    [1, 7, 4, 5, 6, 9, 2, 8, 3],
    [3, 9, 5, 8, 4, 2, 7, 6, 1],
    [6, 2, 8, 7, 1, 3, 5, 4, 9],
    [2, 8, 3, 6, 5, 7, 1, 9, 4],
    [5, 1, 6, 9, 2, 4, 8, 3, 7],
    [9, 4, 7, 3, 8, 1, 6, 2, 5]
  ];

  const invalidBoard = [
    [9, 0, 9, 0, 0, 5, 0, 1, 0],
    [8, 5, 0, 4, 0, 0, 0, 0, 2],
    [4, 3, 2, 0, 0, 0, 0, 0, 0],
    [1, 0, 5, 0, 6, 9, 0, 8, 3],
    [0, 9, 0, 0, 0, 0, 0, 6, 0],
    [6, 2, 0, 7, 1, 0, 0, 0, 9],
    [0, 0, 0, 8, 0, 0, 1, 9, 4],
    [5, 0, 0, 0, 0, 4, 0, 3, 7],
    [0, 4, 0, 3, 0, 3, 6, 0, 0]
  ];
  
  test('Logic handles a valid puzzle string of 81 characters', function() {
    assert.equal(solver.validate(validString), 'valid');
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
    assert.deepEqual(solver.validate('asdfq'), { error: 'Invalid characters in puzzle' });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    assert.deepEqual(solver.validate('9..5.1.85'), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Logic handles a valid row placement', function() {
    assert.isTrue(solver.checkRowPlacement(0, 0, 3, validBoard));
  });

  test('Logic handles an invalid row placement', function() {
    assert.isFalse(solver.checkRowPlacement(0, 0, 9, validBoard));
  });

  test('Logic handles a valid column placement', function() {
    assert.isTrue(solver.checkColPlacement(0, 0, 3, validBoard));
  });

  test('Logic handles an invalid column placement', function() {
    assert.isFalse(solver.checkColPlacement(0, 0, 8, validBoard));
  });

  test('Logic handles a valid region (3x3 grid) placement', function() {
    assert.isTrue(solver.checkRegionPlacement(0, 0, 6, validBoard));
  });

  test('Logic handles an invalid region (3x3 grid) placement', function() {
    assert.isFalse(solver.checkRegionPlacement(0, 0, 3, validBoard));
  });

  test('Valid puzzle strings pass the solver', function() {
    assert.isTrue(solver.solve(validBoard));
  });

  test('Invalid puzzle strings fail the solver', function() {
    assert.isFalse(solver.solve(invalidBoard));
  });

  test('Solver returns the expected solution for an incomplete puzzle', function() {
    solver.solve(validBoard);
    assert.deepEqual(solver.board, solvedBoard);
  });
});