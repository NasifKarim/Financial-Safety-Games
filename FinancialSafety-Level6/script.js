document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    startGameButton: document.getElementById("start-game"),
    userNameInput: document.getElementById("user-name"),
    userNamePlaceholders: document.querySelectorAll(
      "#user-name-placeholder, #user-name-placeholder-2"
    ),
    gameIntro: document.getElementById("game-intro"),
    tasks: [
      document.getElementById("task-1"),
      document.getElementById("task-2"),
      document.getElementById("task-3"),
    ],
    taskResults: [
      document.getElementById("task-1-result"),
      document.getElementById("task-2-result"),
      document.getElementById("task-3-result"),
    ],
    submitTaskButtons: [
      document.getElementById("submit-task-1"),
      document.getElementById("submit-task-2"),
      document.getElementById("submit-task-3"),
    ],
    restartTaskButton: document.getElementById("restart-task"),
    emails: document.querySelectorAll(".email-gmail-style"),
    transactions: document.querySelectorAll(".transaction"),
    questions: document.querySelectorAll(".question"),
    answers: document.querySelectorAll(".answer"),
    winScreen: document.getElementById("win-screen"),
    gameOver: document.getElementById("game-over"),
    gameOverMessage: document.getElementById("game-over-message"),
    timerDisplays: [
      document.getElementById("timer1"),
      document.getElementById("timer2"),
      document.getElementById("timer3"),
    ],
    modal: document.getElementById("modal"),
    modalContent: document.getElementById("modal-content"),
    audios: {
      start: document.getElementById("game-start-audio"),
      congrats: document.getElementById("congrats-audio"),
      timeReminder: document.getElementById("time-reminder-audio"),
      correct: document.getElementById("correct-audio"),
      incorrect: document.getElementById("incorrect2-audio"),
      over: document.getElementById("game-over-audio"),
    },
  };

  let timerInterval;
  let currentTask = 0;
  let currentAudio = null;
  let currentSlide = 0;

  const updateSlidePosition = () => {
    const carouselInner = document.querySelector(".carousel-inner");
    const totalSlides = document.querySelectorAll(".carousel-item").length;
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelector(".carousel-control-prev").style.display =
      currentSlide === 0 ? "block" : "block";
    document.querySelector(".carousel-control-next").style.display =
      currentSlide === totalSlides - 1 ? "block" : "block";
  };

  const nextSlide = () => {
    const totalSlides = document.querySelectorAll(".carousel-item").length;
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlidePosition();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlidePosition();
    }
  };

  document.querySelectorAll(".answer").forEach((answerButton) => {
    answerButton.addEventListener("click", () => {
      const currentQuestion = document.querySelectorAll(".carousel-item")[
        currentSlide
      ];
      const correctAnswer = currentQuestion.getAttribute("data-correct-answer");
      const selectedAnswer = answerButton.getAttribute("data-answer");
      const dropZone = currentQuestion.querySelector(".drop-zone");
      dropZone.textContent = answerButton.textContent;
      dropZone.setAttribute("data-answer", selectedAnswer);
      if (selectedAnswer === correctAnswer) nextSlide();
    });
  });

  document
    .querySelector(".carousel-control-prev")
    .addEventListener("click", prevSlide);
  document
    .querySelector(".carousel-control-next")
    .addEventListener("click", nextSlide);

  const playAudio = async (audioElement) => {
    if (!audioElement) {
      console.error("Audio element is null");
      return;
    }

    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    currentAudio = audioElement;
    audioElement.currentTime = 0;

    try {
      await audioElement.play();
      console.log("Audio playing");
    } catch (error) {
      console.error("Audio play failed:", error);
    }
  };

  const setTaskTimer = (timerDisplay, duration, callback) => {
    let timeLeft = duration;
    timerDisplay.textContent = timeLeft;
    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        callback();
      } else {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
      }
    }, 1000);
  };

  const handleSelection = (item) => item.classList.toggle("selected");

  const handleTaskSubmission = (taskNumber) => {
    let correctCount = 0;
    let incorrectCount = 0;
    let totalItems, selectedItems, checkAttribute;

    if (taskNumber === 0) {
      totalItems = document.querySelectorAll(
        ".email-gmail-style[data-phishing='true']"
      ).length;
      selectedItems = document.querySelectorAll(
        "input[name='phishing']:checked"
      );
      checkAttribute = "data-phishing";
    } else {
      totalItems = elements.transactions.length;
      selectedItems = elements.transactions;
      checkAttribute = "data-unauthorized";
    }

    selectedItems.forEach((item) => {
      const isCorrect = item.getAttribute(checkAttribute) === "true";
      if (isCorrect) correctCount++;
      else incorrectCount++;
    });  const setTaskTimer = (timerDisplay, duration, callback) => {
      let timeLeft = duration;
      timerDisplay.textContent = timeLeft;
      timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          callback();
        } else {
          timeLeft--;
          timerDisplay.textContent = timeLeft;
        }
      }, 1000);
    };

    if (incorrectCount === 0 && correctCount === totalItems) {
      clearInterval(timerInterval);
      playAudio(elements.audios.correct);
      elements.taskResults[taskNumber].textContent = "Correct!";
      elements.tasks[taskNumber].style.display = "none";
      if (taskNumber < 2) {
        elements.tasks[taskNumber + 1].style.display = "block";
        updateModalContent(
          `Congratulations on making it to Task ${taskNumber + 2}!`
        );
        setTaskTimer(
          elements.timerDisplays[taskNumber + 1],
          120,
          handleTaskTimeouts[taskNumber + 1]
        );
        currentTask = taskNumber + 1;
      } else {
        updateModalContent("Congratulations, you have completed the game!");
        showModal();
        playAudio(elements.audios.congrats);
      }
    } else {
      playAudio(elements.audios.incorrect);
      elements.taskResults[taskNumber].textContent =
        "Some answers are incorrect. Please try again!";
    }
  };

  const handleTaskTimeouts = [
    () => {
      elements.tasks[0].style.display = "none";
      elements.gameOver.style.display = "block";
      elements.gameOverMessage.textContent = "You've been hacked. Time's up for Task 1!";
      playAudio(elements.audios.over);
    },
    () => {
      elements.tasks[1].style.display = "none";
      elements.gameOver.style.display = "block";
      elements.gameOverMessage.textContent = "You've been hacked. Time's up for Task 2!";
      playAudio(elements.audios.over);
    },
    () => {
      elements.tasks[2].style.display = "none";
      elements.gameOver.style.display = "block";
      elements.gameOverMessage.textContent = "You've been hacked. Time's up for Task 3!";
      playAudio(elements.audios.over);
    },
  ];

  const startGame = () => {
    const userName = elements.userNameInput.value.trim();
    if (userName === "") {
      alert("Please enter your name to start the game.");
      return;
    }

    elements.userNamePlaceholders.forEach(
      (placeholder) => (placeholder.textContent = userName)
    );
    elements.gameIntro.style.display = "none";
    elements.tasks[0].style.display = "block";
    setTaskTimer(elements.timerDisplays[0], 120, handleTaskTimeouts[0]);
    currentTask = 1;
  };

  const restartTask = () => {
    clearInterval(timerInterval);
    elements.gameOver.style.display = "none";
    elements.winScreen.style.display = "none";
    elements.tasks.forEach((task) => (task.style.display = "none"));
    elements.taskResults.forEach((result) => (result.textContent = ""));
    currentTask = 1;
    startGame();
  };

  const updateModalContent = (message) => {
    elements.modalContent.innerHTML = `<p>${message}</p>`;
    if (currentTask < 3) {
      const continueButton = document.createElement("button");
      continueButton.className = "continue-button";
      continueButton.textContent = "Continue to next task";
      continueButton.addEventListener(
        "click",
        () => (elements.modal.style.display = "none")
      );
      elements.modalContent.appendChild(continueButton);
    }
  };

  const showModal = () => {
    elements.modal.style.display = "block";
    setTimeout(() => {
      elements.modal.style.display = "none";
    }, 3000);
  };

  elements.submitTaskButtons.forEach((button, index) =>
    button.addEventListener("click", () => handleTaskSubmission(index))
  );
  elements.restartTaskButton.addEventListener("click", restartTask);
  elements.startGameButton.addEventListener("click", startGame);

  window.addEventListener("click", (event) => {
    if (event.target === elements.modal) elements.modal.style.display = "none";
  });

  elements.transactions.forEach((transaction) =>
    transaction.addEventListener("click", () => handleSelection(transaction))
  );

  const dragStartHandler = (event) => {
    event.dataTransfer.setData("text/plain", event.target.dataset.answer);
    event.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      event.target.style.display = "none";
    }, 0);
  };

  const dragEndHandler = (event) => {
    event.target.style.display = "block";
  };

  const dragOverHandler = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    event.target.classList.add("drag-over");
  };

  const dragLeaveHandler = (event) => {
    event.target.classList.remove("drag-over");
  };

  const dropHandler = (event) => {
    event.preventDefault();
    event.target.classList.remove("drag-over");
    const answer = event.dataTransfer.getData("text/plain");
    const dropZone = event.target;
    if (dropZone.classList.contains("drop-zone")) {
      const draggedElement = document.querySelector(
        `[data-answer="${answer}"]`
      );
      dropZone.textContent = draggedElement.textContent;
      dropZone.setAttribute("data-answer", answer);
      draggedElement.style.display = "none";
    }
  };

  elements.answers.forEach((answer) => {
    answer.addEventListener("dragstart", dragStartHandler);
    answer.addEventListener("dragend", dragEndHandler);
  });

  elements.questions.forEach((question) => {
    const dropZone = question.querySelector(".drop-zone");
    dropZone.addEventListener("dragover", dragOverHandler);
    dropZone.addEventListener("dragleave", dragLeaveHandler);
    dropZone.addEventListener("drop", dropHandler);
  });

  // For Task 1 email selection
  const handleTask1Submission = () => {
    const selectedEmails = document.querySelectorAll(
      "input[name='phishing']:checked"
    );
    let correctCount = 0;
    let incorrectCount = 0;
    const totalPhishingEmails = document.querySelectorAll(
      ".email-gmail-style[data-phishing='true']"
    ).length;

    selectedEmails.forEach((input) => {
      const emailMarker = input.value;
      const email = document.querySelector(
        `.email-gmail-style[data-marker='${emailMarker}']`
      );
      if (email.getAttribute("data-phishing") === "true") {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    if (incorrectCount === 0 && correctCount === totalPhishingEmails) {
      clearInterval(timerInterval);
      playAudio(elements.audios.correct);
      elements.taskResults[0].textContent =
        "Correct! Here is the code to unlock the virtual safe: 1234";
      elements.tasks[0].style.display = "none";
      elements.tasks[1].style.display = "block";
      setTaskTimer(elements.timerDisplays[1], 120, handleTaskTimeouts[1]);
      currentTask = 1;
    } else {
      playAudio(elements.audios.incorrect);
      elements.taskResults[0].textContent =
        "There are more suspicious emails! Please select all the correct phishing emails.";
    }
  };

  elements.submitTaskButtons[0].addEventListener(
    "click",
    handleTask1Submission
  );

  // For Task 2 transaction selection
  const handleTask2Submission = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    const selectedTransactions = document.querySelectorAll(
      ".transaction.selected"
    );
    const totalUnauthorizedTransactions = document.querySelectorAll(
      ".transaction[data-unauthorized='true']"
    ).length;

    selectedTransactions.forEach((transaction) => {
      const isUnauthorized =
        transaction.getAttribute("data-unauthorized") === "true";
      if (isUnauthorized) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    if (
      incorrectCount === 0 &&
      correctCount === totalUnauthorizedTransactions
    ) {
      clearInterval(timerInterval);
      playAudio(elements.audios.correct);
      elements.taskResults[1].textContent =
        "Correct! You have identified all unauthorized transactions.";
      elements.tasks[1].style.display = "none";
      elements.tasks[2].style.display = "block";
      setTaskTimer(elements.timerDisplays[2], 120, handleTaskTimeouts[2]);
      currentTask = 2;
    } else {
      playAudio(elements.audios.incorrect);
      elements.taskResults[1].textContent =
        "Some selections are incorrect. Please try again.";
    }
  };

  elements.submitTaskButtons[1].addEventListener(
    "click",
    handleTask2Submission
  );

  // Task 3
  const handleTask3Submission = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    elements.questions.forEach((question) => {
      const correctAnswer = question.getAttribute("data-correct-answer");
      const userAnswer = question
        .querySelector(".drop-zone")
        .getAttribute("data-answer");

      if (userAnswer === correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    if (incorrectCount === 0 && correctCount === elements.questions.length) {
      clearInterval(timerInterval);
      playAudio(elements.audios.correct);
      elements.taskResults[2].textContent =
        "Correct! You have answered all questions correctly.";
      elements.tasks[2].style.display = "none";
      updateModalContent("Congratulations, you have completed the game!");
      showModal();
      elements.winScreen.style.display = "block";
      playAudio(elements.audios.congrats);
    } else {
      playAudio(elements.audios.incorrect);
      elements.taskResults[2].textContent =
        "Some answers are incorrect. Please try again.";
    }
  };

  elements.submitTaskButtons[2].addEventListener(
    "click",
    handleTask3Submission
  );
});
