const startForm = document.querySelector(".selections");
const selectionEl = document.querySelector(".selection");
const selections = document.querySelectorAll(".selection");
const btnStart = document.getElementById("start-button");
const form = document.querySelector(".form");
const countdown = document.querySelector(".countdown");
const itemsContainer = document.querySelector(".items");
const bestScoreEls = document.querySelectorAll(".score-time");

const sectionContainer = document.querySelector(".section");
const startPage = document.querySelector(".section-1");
const countdownPage = document.querySelector(".section-2");
const gameStartPage = document.querySelector(".section-3");
const resultPage = document.querySelector(".section-4");

const wrongBtn = document.getElementById("wrong");
const rightBtn = document.getElementById("right");
const playAgainBtn = document.querySelector(".play-again");

let questionAmount = 0;
let equationsArray = [];
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];
let playerGuessArray = [];
let valueY = 0;
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let bestScoreArray = [];

const updateBestScore = function () {
  bestScoreArray.forEach((score, index) => {
    if (questionAmount === score.questions) {
      const savedBestScore = +bestScoreArray[index].bestScore;
      if (savedBestScore === 0 || savedBestScore > finalTime)
        bestScoreArray[index].bestScore = finalTime.toFixed(1);
    }
  });
  bestScoresToDom();
  localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
};

const bestScoresToDom = function () {
  bestScoreEls.forEach((e, i) => {
    const bestSCoreEl = e;
    bestSCoreEl.textContent = `${bestScoreArray[i].bestScore}s`;
  });
};

const getSavedBestScores = function () {
  if (localStorage.getItem("bestScores")) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTime.toFixed(1) },
      { questions: 25, bestScore: finalTime.toFixed(1) },
      { questions: 50, bestScore: finalTime.toFixed(1) },
      { questions: 99, bestScore: finalTime.toFixed(1) },
    ];
    localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
  }
  bestScoresToDom();
};

const containerMove = function () {
  itemsContainer.scrollTo({ top: 0, behavior: "instant" });
};

const playAgain = function () {
  selections.forEach((el) => el.classList.remove("selected"));
  resultPage.classList.add("hidden");
  startPage.classList.remove("hidden");
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  questionAmount = 0;
  playAgainBtn.classList.add("hidden");
};

const startTimer = function () {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
};

const addTime = function () {
  timePlayed += 0.1;
  checkTime();
};

const checkScore = function () {
  equationsArray.forEach((e, i) => {
    if (e.evaluated !== playerGuessArray[i]) penaltyTime += 0.5;
  });
  finalTime = timePlayed + penaltyTime;
  updateBestScore();
};

const scoreToDom = function () {
  document.querySelector(".time-number").textContent = `${finalTime.toFixed(
    1
  )}s`;
  document.querySelector(
    ".time-base"
  ).textContent = `Base Time: ${timePlayed.toFixed(1)}s`;
  document.querySelector(
    ".time-penalty"
  ).textContent = `Penalty: +${penaltyTime.toFixed(1)}s`;
  gameStartPage.classList.add("hidden");
  resultPage.classList.remove("hidden");
  setTimeout(() => {
    playAgainBtn.classList.remove("hidden");
  }, 1000);
};

const checkTime = function () {
  if (playerGuessArray.length === questionAmount) {
    clearInterval(timer);
    checkScore();
    scoreToDom();
  }
};

const countdownStart = function () {
  countdown.textContent = "3";
  setTimeout(() => {
    countdown.textContent = "2";
  }, 1000);
  setTimeout(() => {
    countdown.textContent = "1";
  }, 2000);
  setTimeout(() => {
    countdown.textContent = "Go!";
  }, 3000);
};

const showCountdown = function () {
  if (questionAmount) {
    startPage.classList.add("hidden");
    countdownPage.classList.remove("hidden");
    countdownStart();
    setTimeout(() => {
      countdownPage.classList.add("hidden");
      gameStartPage.classList.remove("hidden");
      startTimer();
      containerMove();
    }, 4000);
  }
  return;
};

const selectQuestionAmount = function (e) {
  e.preventDefault();
  showCountdown();
  populateGamePage();
};

const startRound = function (e) {
  selections.forEach((el) => el.classList.remove("selected"));
  const clicked = e.target.closest(".selection");
  if (!clicked) return;
  clicked.classList.add("selected");
  questionAmount = +clicked.dataset.amount;
};

const getRandomNumbers = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

const createEquations = function () {
  const correctEquations = getRandomNumbers(questionAmount);
  const wrongEquations = questionAmount - correctEquations;

  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomNumbers(9);
    secondNumber = getRandomNumbers(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }

  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomNumbers(9);
    secondNumber = getRandomNumbers(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[2] = `${firstNumber} x ${secondNumber} = ${equationValue + 1}`;
    const formatChoice = getRandomNumbers(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
};

const equationsToDOM = function () {
  equationsArray.forEach((element) => {
    const item = document.createElement("div");
    item.classList.add("item-container");
    const equation = document.createElement("h2");
    equation.classList.add("item");
    equation.textContent = element.value;
    item.appendChild(equation);
    itemsContainer.appendChild(item);
  });
};

const populateGamePage = function () {
  itemsContainer.textContent = "";
  const topSpace = document.createElement("div");
  topSpace.classList.add("top-height");
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  itemsContainer.append(topSpace, selectedItem);

  createEquations();
  equationsToDOM();

  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("bottom-height");
  itemsContainer.appendChild(bottomSpacer);
};

const select = function (condition) {
  valueY += 70;
  itemsContainer.scroll(0, valueY);
  return condition
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
};

startForm.addEventListener("click", startRound);
form.addEventListener("submit", selectQuestionAmount);
getSavedBestScores();
