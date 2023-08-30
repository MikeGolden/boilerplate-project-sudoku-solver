class SudokuSolver {
  constructor() {
    this.board = []; 
  }

  validate(puzzleString) {
    // validate string to have only [1-9.] with regex
    switch (true) {
      case !(/^[1-9.]+$/.test(puzzleString)):
        return { error: 'Invalid characters in puzzle' };
      case (puzzleString.length !== 81):
        return { error: 'Expected puzzle to be 81 characters long' };
      default:
        return 'valid';
    }
  }

  checkRowPlacement(row, col, value, board) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] == value && i !== col) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(row, col, value, board) {
    for (let i = 0; i < 9; i++) {
      if (board[i][col] == value && i !== row) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(row, col, value, board) {
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[rowStart + i][colStart + j] == value && board[rowStart + i][colStart + j] !== board[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  solve(board) {
    let isEmpty = false;
    let row;
    let col;
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          row = i;
          col = j;
          isEmpty = true;
          break;
        }
      }
      if (isEmpty) {
        break;
      }
    }
  
    if (!isEmpty) {
      this.board = board;
      return true;
    }
    
    for (let value = 1; value < 10; value++) {
      if (this.checkRowPlacement(row, col, value, board) && this.checkColPlacement(row, col, value, board) && this.checkRegionPlacement(row, col, value, board)) {
        board[row][col] = value;
        if (this.solve(board)) {
          return true;
        } else {
          board[row][col] = 0;
        }
      }
    }
    return false;
  }
}

module.exports = SudokuSolver;

