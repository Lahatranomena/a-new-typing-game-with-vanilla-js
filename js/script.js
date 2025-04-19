let startTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const restartButton = document.getElementById("restart-button"); 
const words = {
  easy: ["apple ", "banana ", "grape ", "orange ", "cherry "],
  medium: ["keyboard ", "monitor ", "printer ", "charger  ", "battery "],
  hard: ["synchronize ", "complicated ", "development ", "extravagant ", "misconception "]
};


const getRandomWord = (mode) => {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
};

const startTest = (wordCount = 20) => {
  wordsToType.length = 0;
  wordDisplay.innerHTML = "";
  currentWordIndex = 0;
  startTime = null;
  inputField.disabled = false;
  inputField.focus();
  results.textContent = "";

  for (let i = 0; i < wordCount; i++) {
    wordsToType.push(getRandomWord(modeSelect.value));
  }

  wordsToType.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word + " "; 
    if (index === 0) span.style.color = "red";
    wordDisplay.appendChild(span);
  });

  highlightNextWord();
  inputField.value = "";
};


const startTimer = () => {
  if (!startTime) startTime = Date.now();
};


const getCurrentStats = () => {
  const elapsedTime = (Date.now() - startTime) / 1000; 
  const totalCharsTyped = wordsToType
    .slice(0, currentWordIndex + 1)
    .reduce((sum, word) => sum + word.length, 0);

  const wpm = (totalCharsTyped / 5) / (elapsedTime / 60);

  const expected = wordsToType[currentWordIndex];
  const typed = inputField.value.trim();
  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === expected[i]) correctChars++;
  }

  const accuracy = typed.length === 0 ? 0 : (correctChars / typed.length) * 100;

  return {
    wpm: wpm.toFixed(2),
    accuracy: accuracy.toFixed(2)
  };
};


const resetTest = () => {
  startTest(); 
};


const updateWord = (event) => {
  if (event.key === " ") {
    event.preventDefault();

    if (currentWordIndex >= wordsToType.length) return;

    const expected = wordsToType[currentWordIndex];
    const typed = inputField.value.trim();

    const feedback = typed === expected ? " Correct Word !" : " Incorrect Word";

    const { wpm, accuracy } = getCurrentStats();
    results.textContent = `${feedback} WPM: ${wpm}, Precision: ${accuracy}%`;

    currentWordIndex++;
    highlightNextWord();
    inputField.value = "";

    if (currentWordIndex >= wordsToType.length) {
      results.textContent += " Test Finished !";
      inputField.disabled = true;
    }
  }
};

const highlightNextWord = () => {
  const wordElements = wordDisplay.children;

  if (currentWordIndex < wordElements.length) {
    if (currentWordIndex > 0) {
      wordElements[currentWordIndex - 1].style.color = "black";
    }

    const currentWord = wordsToType[currentWordIndex];
    const span = wordElements[currentWordIndex];

    span.innerHTML = "";
    for (let char of currentWord) {
      const letterSpan = document.createElement("span");
      letterSpan.textContent = char;
      span.appendChild(letterSpan);
    }
  }
};


const updateLiveInputHighlight = () => {
  const wordElements = wordDisplay.children;
  const currentSpan = wordElements[currentWordIndex];
  const letterSpans = currentSpan?.children;
  const typed = inputField.value;

  for (let i = 0; i < letterSpans.length; i++) {
    if (i < typed.length) {
      if (typed[i] === letterSpans[i].textContent) {
        letterSpans[i].style.color = "green"; 
      } else {
        letterSpans[i].style.color = "red"; 
      }
    } else {
      letterSpans[i].style.color = "white"; 
    }
  }
};

inputField.addEventListener("keydown", (event) => {
  startTimer();
  updateWord(event);
});

inputField.addEventListener("input", updateLiveInputHighlight);

modeSelect.addEventListener("change", () => startTest());

restartButton.addEventListener("click", resetTest); 

startTest();