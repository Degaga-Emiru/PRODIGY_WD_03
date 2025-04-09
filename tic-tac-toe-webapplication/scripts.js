const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const scoreDisplay = document.getElementById('score');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');

let currentPlayer = 'X';
let gameActive = false;
let gameState = Array(9).fill('');
let isAI = false;
let scores = { X: 0, O: 0 };
let players = { X: 'Player X', O: 'Player O' };

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => cell.addEventListener('click', handleClick));

function startGame() {
  players.X = player1Input.value || 'Player X';
  players.O = player2Input.value || 'Player O';
  isAI = players.O.toLowerCase() === 'ai';
  gameState.fill('');
  cells.forEach(cell => cell.textContent = '');
  gameActive = true;
  currentPlayer = 'X';
  updateStatus();
  updateScore();
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || gameState[index]) return;

  makeMove(index);

  if (isAI && gameActive && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index) {
  gameState[index] = currentPlayer;
  cells[index].textContent = currentPlayer;

  if (checkWinner()) {
    statusText.textContent = `${players[currentPlayer]} wins!`;
    scores[currentPlayer]++;
    gameActive = false;
  } else if (!gameState.includes('')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }

  updateScore();
}

function checkWinner() {
  return winningConditions.some(([a, b, c]) => {
    return gameState[a] && gameState[a] === gameState[b] && gameState[b] === gameState[c];
  });
}

function resetGame() {
  gameState.fill('');
  cells.forEach(cell => cell.textContent = '');
  gameActive = true;
  currentPlayer = 'X';
  updateStatus();
}

function updateStatus() {
  statusText.textContent = `${players[currentPlayer]}'s turn`;
}

function updateScore() {
  scoreDisplay.textContent = `${players.X}: ${scores.X} | ${players.O}: ${scores.O}`;
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function aiMove() {
  // Easy AI: random empty cell
  const emptyIndices = gameState
    .map((val, i) => val === '' ? i : null)
    .filter(i => i !== null);

  const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  if (move !== undefined) makeMove(move);
}
