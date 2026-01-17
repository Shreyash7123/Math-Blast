let score = 0;
let timeLeft = 30;
let currentAnswer = 0;
let timer = null;
let gameActive = false;
let streak = 0;
let bestStreak = 0;

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const streakEl = document.getElementById("streak");
const questionEl = document.getElementById("question");
const answersGrid = document.getElementById("answersGrid");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const performance = document.getElementById("performance");

function startGame() {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  timeLeft = 30;
  streak = 0;
  bestStreak = 0;

  updateUI();
  gameOver.classList.remove("show");

  generateQuestion();
  startTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 5) {
      timerEl.classList.add("timer-warning");
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function generateQuestion() {
  if (!gameActive) return;

  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a = Math.floor(Math.random() * 15) + 1;
  let b = Math.floor(Math.random() * 15) + 1;

  if (op === "-" && b > a) [a, b] = [b, a];

  currentAnswer =
    op === "+" ? a + b :
    op === "-" ? a - b :
    a * b;

  questionEl.textContent = `${a} ${op} ${b} = ?`;
  createOptions();
}

function createOptions() {
  answersGrid.innerHTML = "";
  let options = [currentAnswer];

  while (options.length < 4) {
    let fake = currentAnswer + Math.floor(Math.random() * 10 - 5);
    if (!options.includes(fake) && fake >= 0) {
      options.push(fake);
    }
  }

  options.sort(() => Math.random() - 0.5);

  options.forEach(num => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = num;
    btn.onclick = () => validateAnswer(num, btn);
    answersGrid.appendChild(btn);
  });
}

function validateAnswer(choice, btn) {
  if (!gameActive) return;

  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach(b => b.disabled = true);

  if (choice === currentAnswer) {
    btn.classList.add("correct");
    score++;
    streak++;
    bestStreak = Math.max(bestStreak, streak);
  } else {
    btn.classList.add("wrong");
    streak = 0;
  }

  updateUI();

  setTimeout(generateQuestion, 700);
}

function updateUI() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
}

function endGame() {
  clearInterval(timer);
  gameActive = false;

  finalScore.textContent = `Your final score: ${score}`;
  performance.innerHTML = `Best streak: ${bestStreak}`;

  answersGrid.innerHTML = "";
  gameOver.classList.add("show");
}

function resetGame() {
  clearInterval(timer);
  gameActive = false;

  score = 0;
  timeLeft = 30;
  streak = 0;
  bestStreak = 0;

  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  streakEl.textContent = streak;
  timerEl.classList.remove("timer-warning");

  questionEl.textContent = "Click START to begin!";
  answersGrid.innerHTML = "";
  gameOver.classList.remove("show");
}
