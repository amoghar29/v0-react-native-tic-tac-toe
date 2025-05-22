// Function to check if there's a winner or a draw
export function checkWinner(
  board: (string | null)[][],
  boardSize: number,
): { winner: string | null; isDraw: boolean; winningCells?: [number, number][] } {
  // Check rows
  for (let row = 0; row < boardSize; row++) {
    if (board[row][0] && board[row].every((cell) => cell === board[row][0])) {
      return {
        winner: board[row][0],
        isDraw: false,
        winningCells: Array.from({ length: boardSize }, (_, i) => [row, i] as [number, number]),
      }
    }
  }

  // Check columns
  for (let col = 0; col < boardSize; col++) {
    if (board[0][col] && board.every((row) => row[col] === board[0][col])) {
      return {
        winner: board[0][col],
        isDraw: false,
        winningCells: Array.from({ length: boardSize }, (_, i) => [i, col] as [number, number]),
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  if (board[0][0] && board.every((row, i) => row[i] === board[0][0])) {
    return {
      winner: board[0][0],
      isDraw: false,
      winningCells: Array.from({ length: boardSize }, (_, i) => [i, i] as [number, number]),
    }
  }

  // Check diagonal (top-right to bottom-left)
  if (board[0][boardSize - 1] && board.every((row, i) => row[boardSize - 1 - i] === board[0][boardSize - 1])) {
    return {
      winner: board[0][boardSize - 1],
      isDraw: false,
      winningCells: Array.from({ length: boardSize }, (_, i) => [i, boardSize - 1 - i] as [number, number]),
    }
  }

  // Check for draw
  const isDraw = board.every((row) => row.every((cell) => cell !== null))
  return { winner: null, isDraw }
}

// AI move logic
export function getAIMove(
  board: (string | null)[][],
  aiSymbol: string,
  playerSymbol: string,
  boardSize: number,
): { row: number; col: number } | null {
  // Try to win
  const winMove = findWinningMove(board, aiSymbol, boardSize)
  if (winMove) return winMove

  // Block player from winning
  const blockMove = findWinningMove(board, playerSymbol, boardSize)
  if (blockMove) return blockMove

  // Take center if available (for any board size)
  const centerIndex = Math.floor(boardSize / 2)
  if (board[centerIndex][centerIndex] === null) {
    return { row: centerIndex, col: centerIndex }
  }

  // Take a corner if available
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: boardSize - 1 },
    { row: boardSize - 1, col: 0 },
    { row: boardSize - 1, col: boardSize - 1 },
  ]

  for (const corner of corners) {
    if (board[corner.row][corner.col] === null) {
      return corner
    }
  }

  // Take any available cell
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === null) {
        return { row, col }
      }
    }
  }

  return null
}

// Helper function to find a winning move
function findWinningMove(
  board: (string | null)[][],
  symbol: string,
  boardSize: number,
): { row: number; col: number } | null {
  // Check each empty cell to see if placing the symbol there would result in a win
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === null) {
        // Try placing the symbol
        const newBoard = board.map((r) => [...r])
        newBoard[row][col] = symbol

        // Check if this move would win
        const result = checkWinner(newBoard, boardSize)
        if (result.winner === symbol) {
          return { row, col }
        }
      }
    }
  }

  return null
}
