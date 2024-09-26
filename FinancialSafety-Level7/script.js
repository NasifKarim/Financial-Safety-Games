document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    hangmanGame: document.querySelector(".hangman-game"),
    hangmanWord: document.querySelector(".hangman-word"),
    hangmanLetters: document.querySelector(".hangman-letters"),
    hangmanStatus: document.querySelector(".hangman-status"),
    restartHangman: document.querySelector(".restart-hangman"),
    nextLevel: document.querySelector(".next-level"),
    hangmanHint: document.querySelector(".hangman-hint"),
    audioCorrect: document.querySelector(".audio-correct"),
    audioWrong: document.querySelector(".audio-wrong"),
    audioGameOver: document.querySelector(".audio-game-over"),
    audioNext: document.querySelector(".audio-next"),
    audioComplete: document.querySelector(".audio-complete"), 
  };

  const levels = {
    1: [
      { word: "budget", hint: "A plan for managing income and expenses." },
      { word: "fraud", hint: "Deception intended to result in financial gain." },
      { word: "debt", hint: "Money that is owed or due." },
      { word: "credit", hint: "An agreement to borrow money." },
      { word: "loan", hint: "A thing that is borrowed, especially money." },
    ],
    2: [
      { word: "investment", hint: "Putting money into something for future gain." },
      { word: "mortgage", hint: "A loan used to purchase a home." },
      { word: "security", hint: "Protection of financial assets." },
      { word: "insurance", hint: "A contract for financial protection." },
      { word: "retirement", hint: "The act of leaving one's job and ceasing to work." },
    ],
    3: [
      { word: "identity theft", hint: "Fraudulent use of someone's personal information." },
      { word: "cybersecurity threat", hint: "A potential cause of harm to an internet-connected system." },
      { word: "financial planning", hint: "A comprehensive evaluation of one's financial situation." },
      { word: "retirement savings", hint: "Money set aside for after you stop working." },
      { word: "credit score", hint: "A numerical expression of a person's creditworthiness." },
    ]
  };

  let level = 1;
  let maxMistakes = 11;  
  let hangmanWord = "";
  let hangmanGuessed = [];
  let hangmanMistakes = 0;

  const initializeHangman = () => {
    const selectedWordObj = levels[level][Math.floor(Math.random() * levels[level].length)];
    hangmanWord = selectedWordObj.word.toLowerCase();
    hangmanGuessed = [];
    hangmanMistakes = 0;

    // Check if the elements exist before attempting to set properties
    if (elements.hangmanHint) {
      elements.hangmanHint.textContent = `Hint: ${selectedWordObj.hint}`;
    } 
    else {
      console.error("Element hangmanHint not found during initialization.");
    }

    updateHangmanDisplay();
    if (elements.hangmanStatus) {
      elements.hangmanStatus.textContent = "";
    }
    clearCanvas();
    createAlphabetButtons();
    if (elements.nextLevel) {
      elements.nextLevel.style.display = "none";
    }
    if (elements.hangmanGame) {
      elements.hangmanGame.querySelector("h2").textContent = `Hangman Game - Level ${level}`;
    }
  };

  const updateHangmanDisplay = () => {
    if (elements.hangmanWord) {
      elements.hangmanWord.innerHTML = hangmanWord
        .split("")
        .map((letter) =>
          hangmanGuessed.includes(letter) || letter === " " ? `<span>${letter}</span>` : `<span>_</span>`
        )
        .join("");
    }
  };

  const createAlphabetButtons = () => {
    if (elements.hangmanLetters) {
      elements.hangmanLetters.innerHTML = "";

      for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i).toLowerCase();
        const button = document.createElement("button");
        button.textContent = letter;
        button.addEventListener("click", () => handleGuess(button, letter));
        elements.hangmanLetters.appendChild(button);
      }
    }
  };

  const handleGuess = (button, letter) => {
    button.disabled = true;
    hangmanGuessed.push(letter);

    if (hangmanWord.includes(letter)) {
      elements.audioCorrect?.play();
      updateHangmanDisplay();

      if (!hangmanWord.split("").some((letter) => !hangmanGuessed.includes(letter) && letter !== " ")) {
        elements.hangmanStatus.textContent = "Congratulations! You've guessed the word!";
        elements.audioNext?.play();
        if (level < 3) {
          elements.nextLevel.style.display = "block";
        } else {
          elements.hangmanStatus.textContent += " You've completed all levels!";
          elements.audioComplete?.play(); 
        }
      }
    } else {
      hangmanMistakes++;
      drawHangmanPart(hangmanMistakes);
      elements.audioWrong?.play();

      if (hangmanMistakes >= maxMistakes) {
        elements.hangmanStatus.textContent = `Game Over! The word was: ${hangmanWord}`;
        elements.hangmanWord.innerHTML = hangmanWord.split("").join("");
        elements.audioGameOver?.play();
        disableAllButtons();
      }
    }
  };

  const disableAllButtons = () => {
    if (elements.hangmanLetters) {
      elements.hangmanLetters.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
      });
    }
  };

  const clearCanvas = () => {
    const canvas = document.querySelector(".hangman-drawing");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawHangmanPart = (partNumber) => {
    const canvas = document.querySelector(".hangman-drawing");
    const context = canvas.getContext("2d");

    context.strokeStyle = "#000";
    context.lineWidth = 3;

    const drawLine = (fromX, fromY, toX, toY) => {
      context.beginPath();
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.stroke();
    };

    const drawCircle = (x, y, radius) => {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.stroke();
    };

    switch (partNumber) {
      case 1:
        drawLine(10, 190, 60, 190); 
        break;
      case 2:
        drawLine(35, 10, 35, 190); 
        break;
      case 3:
        drawLine(35, 10, 100, 10); 
        break;
      case 4:
        drawLine(100, 10, 100, 30); 
        break;
      case 5:
        drawCircle(100, 50, 20); 
        break;
      case 6:
        drawLine(100, 70, 100, 120); 
        break;
      case 7:
        drawLine(100, 80, 80, 100); 
        break;
      case 8:
        drawLine(100, 80, 120, 100); 
        break;
      case 9:
        drawLine(100, 120, 80, 140); 
        break;
      case 10:
        drawLine(100, 120, 120, 140); 
        break;
      case 11:
        context.font = "30px Arial";
        context.fillText("😵", 82, 60); 
        break;
    }
  };

  elements.restartHangman.addEventListener("click", initializeHangman);

  elements.nextLevel.addEventListener("click", () => {
    level++;
    initializeHangman();
  });

  initializeHangman(); 
});
