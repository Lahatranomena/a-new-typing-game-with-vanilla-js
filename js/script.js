let startTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
  easy: ["apple ", "banana ", "grape ", "orange ", "cherry "],
  medium: ["keyboard ", "monitor ", "printer ", "charger  ", "battery "],
  hard: ["synchronize ", "complicated ", "development ", "extravagant ", "misconception "]
};

// Génère un mot aléatoire en fonction du mode sélectionné
const getRandomWord = (mode) => {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialise le test de frappe
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
    span.textContent = word + " "; // L'espace est important ici
    if (index === 0) span.style.color = "red"; // Premier mot mis en évidence
    wordDisplay.appendChild(span);
  });

  highlightNextWord();
  inputField.value = "";
};

// Démarre le chronomètre dès que l'utilisateur commence à taper
const startTimer = () => {
  if (!startTime) startTime = Date.now();
};

// Calcule et retourne le WPM et la précision
const getCurrentStats = () => {
  const elapsedTime = (Date.now() - startTime) / 1000; // secondes
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

// Passe au mot suivant dès que l'utilisateur appuie sur espace
const updateWord = (event) => {
  if (event.key === " ") {
    event.preventDefault();

    if (currentWordIndex >= wordsToType.length) return;

    const expected = wordsToType[currentWordIndex];
    const typed = inputField.value.trim();

    const feedback = typed === expected ? " Mot correct !" : " Mot incorrect";

    const { wpm, accuracy } = getCurrentStats();
    results.textContent = `${feedback} WPM: ${wpm}, Précision: ${accuracy}%`;

    currentWordIndex++;
    highlightNextWord();
    inputField.value = "";

    if (currentWordIndex >= wordsToType.length) {
      results.textContent += " Test terminé !";
      inputField.disabled = true;
    }
  }
};

// Prépare le mot courant en le découpant en lettres pour pouvoir les colorer individuellement
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

// Met à jour le surlignage en temps réel des lettres du mot en cours, en tenant compte des espaces
const updateLiveInputHighlight = () => {
  const wordElements = wordDisplay.children;
  const currentSpan = wordElements[currentWordIndex];
  const letterSpans = currentSpan?.children;
  const typed = inputField.value;

  for (let i = 0; i < letterSpans.length; i++) {
    if (i < typed.length) {
      if (typed[i] === letterSpans[i].textContent) {
        letterSpans[i].style.color = "green"; // Lettre correcte
      } else {
        letterSpans[i].style.color = "red"; // Lettre incorrecte
      }
    } else {
      letterSpans[i].style.color = "white"; // Lettre non encore frappée
    }
  }
};

// Événements
inputField.addEventListener("keydown", (event) => {
  startTimer();
  updateWord(event);
});

inputField.addEventListener("input", updateLiveInputHighlight);

modeSelect.addEventListener("change", () => startTest());

startTest();
