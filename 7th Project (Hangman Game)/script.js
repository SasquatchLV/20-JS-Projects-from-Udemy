const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const figureParts = document.querySelectorAll('.figure-part');

let selectedWord;

const correctLetters = [];
const wrongLetters = [];

// Fetch some random words
async function getRandomWord() {
  try {
    const res = await fetch('https://randomuser.me/api');
    const data = await res.json();

    const randomWord = data.results[0].location.country;

    return randomWord.toUpperCase().replace(/\s+/g, '');

    // words.push(randomWord.toUpperCase());
  } catch (e) {
    console.log(
      'There has been a problem with your fetch operation: ' + e.message
    );
  }
}

// Show hidden word
async function displayWord() {
  // selectedWord = words[Math.floor(Math.random() * words.length)];
  wordEl.innerHTML = `
${selectedWord
  .split('')
  .map(
    (letter) => `<span class="letter">${
      correctLetters.includes(letter) ? letter : ''
    }
      </span>
`
  )
  .join('')}
`;

  const innerrWord = wordEl.innerText.replace(/\n/g, '');

  if (innerrWord === selectedWord) {
    finalMessage.innerText = 'Congratulations! You won!';
    popup.style.display = 'flex';
  }
}

// Update the wrong letters

function updateWrongLettersEl() {
  // Adding letters to Wrong-Letter-Container
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
  ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // Drawing SVG by looping through figurePart class using index starting from 0
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
    } else {
      part.style.display = 'none';
    }
  });

  // Check if we lost the game
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerHTML = `Oh no, you hanged the dude :( <br /> The word was ${selectedWord}`;
    popup.style.display = 'flex';
  }
}

// Show notification

function showNotification() {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// Keydown letter press
window.addEventListener('keydown', (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key.toUpperCase();

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);

        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

// Restart the game function
function restartGame() {
  // Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  (async () => {
    selectedWord = await getRandomWord();
    displayWord();
  })();

  updateWrongLettersEl();

  popup.style.display = 'none';
}

// Restart game and play again button
playAgainBtn.onclick = restartGame;

(async () => {
  selectedWord = await getRandomWord();
  displayWord();
})();
