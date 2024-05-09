const rulesDiv = document.querySelector(".rules-container");
const toggleRulesBtn = document.getElementById("rules-btn");
const allDiesList = document.getElementsByClassName("die");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const scoreSpans = document.querySelectorAll("#score-options span");
const getScoreBtn = document.getElementById("keep-score-btn");
const rollsEl = document.getElementById("current-round-rolls");
const roundsEl = document.getElementById("current-round");
const totalScoreEl = document.getElementById("total-score");
const scoreHistoyList = document.getElementById("score-history");

const radioButtons = document.querySelectorAll("#score-options input");

// state variables
let totalScore = 0;
let rollsCount = 0;
let roundCount = 1;
let diceNumbers = Array.from({ length: 5 });
let scoreHistoy = [];

const countNumberRepetitions = (array) =>
  array.reduce((acc, current) => {
    return {
      ...acc,
      [current]: (acc[current] || 0) + 1,
    };
  }, {});

// TODO: CHECL STRAIGHT CASES (4\5 numeros concecutivos)
const testRuleFunctions = {
  largeStraight: function (array) {
    const sortedArray = array.sort((a, b) => a - b);

    const uniqueNumbers = Array.from(new Set(sortedArray));
    const fiveStraight = "12345";

    return fiveStraight === uniqueNumbers.join("");
  },
  smallStraight: function (array) {
    const sortedArray = array.sort((a, b) => a - b);

    const uniqueNumbers = Array.from(new Set(sortedArray));
    const fourStraight = ["1234", "2345", "3456"];

    return fourStraight.some((straigth) =>
      uniqueNumbers.join("").includes(straigth)
    );
  },
  fullHouse: function (array) {
    const repetitions = countNumberRepetitions(array);

    return (
      Object.values(repetitions).includes(3) &&
      Object.values(repetitions).includes(2)
    );
  },
  fourOfAKind: function (array) {
    const repetitions = countNumberRepetitions(array);

    return Object.values(repetitions).includes(4);
  },
  threeOfAKind: function (array) {
    const repetitions = countNumberRepetitions(array);
    return Object.values(repetitions).includes(3);
  },
};

const scoreRules = [
  {
    name: "three-of-a-kind",
    active: null,
    testFn: testRuleFunctions.threeOfAKind,
  },

  {
    name: "four-of-a-kind",
    active: null,
    testFn: testRuleFunctions.fourOfAKind,
  },

  {
    name: "full-house",
    active: null,
    testFn: testRuleFunctions.fullHouse,
  },

  {
    name: "small-straight",
    active: null,
    value: 40,
    testFn: testRuleFunctions.smallStraight,
  },

  {
    name: "large-straight",
    active: null,
    value: 50,
    testFn: testRuleFunctions.largeStraight,
  },

  {
    name: "none",
    active: false,
    value: 0,
  },
];

function rollDice() {
  if (rollsCount === 3)
    return alert(
      "You have made three rolls this round. Please select a score."
    );

  rollsCount++;
  diceNumbers = diceNumbers.map(() => Math.floor(Math.random() * 6) + 1);
  updateDice();
  updateStats();

  checkPossibleScores();
}

function keepScore() {
  const selectedRadio = [...radioButtons].find((radio) => radio.checked);
  if (!selectedRadio) return alert("Please select an option or roll the dice ");

  resetRadios();
  roundCount++;
  rollsCount = 0;
  updateStats();
  totalScore += Number(selectedRadio.value);
  totalScoreEl.textContent = totalScore;
  const li = `<li>${selectedRadio.id.replace(/-/g, " ")} - ${
    selectedRadio.value
  } points</li>`;
  scoreHistoyList.insertAdjacentHTML("afterbegin", li);

  if (roundCount > 6) {
    alert(`Game Over: your total score was ${totalScore} points!!`);
    // TODO: reset the game
    resetGame();
  }
}

function checkPossibleScores() {
  resetRadios();
  updateRadioOption(5, 0);

  scoreRules.forEach((rule) => {
    if (rule.name !== "none") {
      rule.active = rule.testFn(diceNumbers);
    }
  });

  const sumOfAllDice = diceNumbers.reduce((a, b) => a + b, 0);

  const matchedRules = scoreRules.filter((rule) => rule.active == true);

  radioButtons.forEach((radio, index) => {
    if (matchedRules.map((rule) => rule.name).includes(radio.id)) {
      updateRadioOption(
        index,
        matchedRules.find((rule) => rule.name === radio.id).value ||
          sumOfAllDice
      );
    }
  });
}

function updateDice() {
  [...allDiesList].forEach((dieEl, index) => {
    dieEl.textContent = diceNumbers[index];
  });
}

function updateStats() {
  rollsEl.textContent = rollsCount;
  roundsEl.textContent = roundCount;
}

function updateRadioOption(optionIndex, score) {
  radioButtons[optionIndex].disabled = false;
  radioButtons[optionIndex].value = score;
  scoreSpans[optionIndex].textContent = `, score = ${score}`;
}

function toggleRules() {
  rulesDiv.classList.toggle("hidden");
  toggleRulesBtn.textContent = rulesDiv.classList.contains("hidden")
    ? "Show"
    : "Hide";
}

function resetGame() {
  scoreHistoy = [];
  diceNumbers = [0, 0, 0, 0, 0];
  dice = [];
  totalScore = 0;
  rollsCount = 0;
  roundCount = 1;

  scoreHistoyList.innerHTML = "";
  resetRadios();
  updateStats();
  updateDice();
}

function init() {
  toggleRulesBtn.addEventListener("click", toggleRules);
  rollDiceBtn.addEventListener("click", rollDice);

  getScoreBtn.addEventListener("click", keepScore);
  resetRadios();
}

function resetRadios() {
  radioButtons.forEach((radio) => {
    radio.disabled = true;
    radio.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
}

init();
