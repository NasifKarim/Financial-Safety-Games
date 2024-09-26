const scenarios = [
  {
    id: 1,
    description:
      "You have received mail containing sensitive information like bank statements, credit card offers, or utility bills. What will you do?",
    imageSrc: "images/mail-management.jpg",
    choices: [
      {
        text: "Post the mail online",
        correct: false,
        outcome: "Bad choice! The internet is not a safe place"
      },
      {
        text: "Shred unnecessary documents",
        correct: true,
        outcome: "Excellent! You've shredded unnecessary documents."
      },
      {
        text: "Leave them on a table",
        correct: false,
        outcome: "Bad choice! Leaving mail on the table is risky."
      },
      {
        text: "Give it to your neighbor",
        correct: false,
        outcome: "Bad choice! Your sensitive information can be compromised!"
      },
    ],
  },
  {
    id: 2,
    description:
      "You have documents like your Social Security card, birth certificate, and credit card details left out on a table. What will you do?",
    imageSrc: "images/secure-documents.jpg",
    choices: [
      {
        text: "Lock these documents in a secure drawer",
        correct: true,
        outcome: "Great choice! This is a perfect way to store your documents."
      },
      {
        text: "Leave them on the table",
        correct: false,
        outcome:
          "Bad choice! Leaving important documents on the table is risky!"
      },
      {
        text: "Invite people over for a party ",
        correct: false,
        outcome:
          "Terrible Choice! Identity theft can occur with the documents out in the open"
      },
      {
        text: "Give them to your friends",
        correct: false,
        outcome: "Bad choice! You should keep personal documents to yourself!"
      },
    ],
  },
  {
    id: 3,
    description:
      "You need to dispose of old documents like tax returns, medical records, and bank statements. What will you do?",
    imageSrc: "images/shredding-documents.jpg",
    choices: [
      {
        text: "Shred the documents",
        correct: true,
        outcome:
          "Good Choice! Your important documents are disposed of properly."
      },
      {
        text: "Cut them with scissors in half",
        correct: false,
        outcome:
          "Bad Choice! Your documents can easily be put back together to form the full document."
      },
      {
        text: "Crumple paper into a ball and throw into the trash",
        correct: false,
        outcome: "Bad Choice! Your documents can still be discovered."
      },
      {
        text: "Throw the documents in a lake",
        correct: false,
        outcome: "Terrible Choice! Do not pollute the environment."
      },
    ],
  },
  {
    id: 4,
    description:
      "Your mailbox is in an unsecured location where anyone could access it. What will you do?",
    imageSrc: "images/unsecured-mailbox.jpg",
    choices: [
      {
        text: "Install a lock on the mailbox",
        correct: true,
        outcome: "Excellent! Installing a lock on your mailbox prevents theft."
      },
      {
        text: "Collect mail weeks later",
        correct: false,
        outcome: "Bad idea! Collect the mail promptly"
      },
      {
        text: "Ignore the security risk",
        correct: false,
        outcome: "Bad choice! Ignoring the security of your mailbox is risky."
      },
      {
        text: "Use the mailbox as a birdhouse",
        correct: false,
        outcome: "Terrible idea! Your mail isn't safe in a birdhouse."
      },
    ],
  },
  {
    id: 5,
    description:
      "You realize you lost your wallet containing your ID, credit cards, and insurance card. What will you do?",
    imageSrc: "images/lost-wallet.jpg",
    choices: [
      {
        text: "Contact your friends and look for the wallet",
        correct: false,
        outcome:
          "Bad choice! Your money might be gone as you spend time searching for the wallet"
      },
      {
        text: "Assume that your wallet will be returned",
        correct: false,
        outcome:
          "Terrible idea! The chances your wallet will be returned are not high."
      },
      {
        text: "Lock your cards!",
        correct: true,
        outcome:
          "Good choice! Locking your card will prevent loss of money from your bank account."
      },
      {
        text: "Post on social media hoping to find your wallet",
        correct: false,
        outcome: "Bad choice! Your social media peers are not your friends."
      },
    ],
  },
];

let currentScenarioIndex = 0;
let selectedChoice = null;
let score = 0;
let firstAttempt = true;

const submitButton = document.getElementById("submit");
const nextButton = document.getElementById("next");

document.addEventListener("DOMContentLoaded", () => {
  loadScenario(currentScenarioIndex);
  submitButton.addEventListener("click", submitChoice);
  nextButton.addEventListener("click", proceedToNextScenario);
  updateScore();
});

function loadScenario(index) {
  const { description, imageSrc, choices } = scenarios[index];
  const scenarioDescription = document.getElementById("scenario-description");
  const scenarioImage = document.getElementById("scenario-image");
  const answersSection = document.getElementById("answers");

  scenarioDescription.textContent = description;
  scenarioImage.src = imageSrc;

  answersSection.innerHTML = '';

  choices.forEach((choice, i) => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.id = `choice-${i + 1}`;
    button.className = 'answer-buttons';
    button.addEventListener("click", () => makeChoice(i));
    answersSection.appendChild(button);
  });

  submitButton.disabled = true;
  nextButton.style.display = "none"; // Hide the Next button initially
  firstAttempt = true; // Reset first attempt for each new scenario
}

function makeChoice(choiceIndex) {
  selectedChoice = choiceIndex;

  document.querySelectorAll('.answer-buttons').forEach((button, index) => {
    button.classList.toggle('selected', index === choiceIndex);
    button.classList.remove('wrong'); 
  });

  submitButton.disabled = false;
}

function submitChoice() {
  if (selectedChoice !== null) {
    const { choices } = scenarios[currentScenarioIndex];
    const chosenAnswer = choices[selectedChoice];
    updateOutcomeMessage(chosenAnswer.outcome);
    playSound(chosenAnswer.correct);
    showModal();
    submitButton.disabled = true;

    if (chosenAnswer.correct) {
      if (firstAttempt) {
        score += 1; 
        updateScore();
      }
      nextButton.style.display = "block"; 
    } else {
      firstAttempt = false; 
      document.querySelector(`#choice-${selectedChoice + 1}`).classList.add('wrong'); 
      nextButton.style.display = "none"; 
    }
  }
}

function updateOutcomeMessage(message) {
  document.getElementById("outcome-message").textContent = message;
}

function showModal() {
  document.getElementById("outcome-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("outcome-modal").style.display = "none";
}

function proceedToNextScenario() {
  closeModal();
  selectedChoice = null;
  currentScenarioIndex++;
  if (currentScenarioIndex < scenarios.length) {
    loadScenario(currentScenarioIndex);
  } else {
    displayFinalMessage(); 
    currentScenarioIndex = 0;
    score = 0; 
  }
  document.getElementById("next").style.display = "none"; 
}


function playSound(isCorrect) {
  document.getElementById(isCorrect ? "correct-sound" : "incorrect-sound").play();
}

function updateScore() {
  document.getElementById("score").textContent = `Score: ${score}`;
} 

function displayFinalMessage() {
  const lessonCompleteSound = document.getElementById("lesson-complete-sound");
  const endingModal = document.getElementById("ending-modal");
  const endingMessage = document.querySelector("#ending-modal-content p");
  endingMessage.textContent = `You have completed all the scenarios. Your final score is ${score}.`;
  endingModal.style.display = "flex";
  lessonCompleteSound.play();
}

function closeEndingModal() {
  const endingModal = document.getElementById("ending-modal");
  endingModal.style.display = "none";
  currentScenarioIndex = 0;
  score = 0;
  updateScore();
  loadScenario(currentScenarioIndex);
}
