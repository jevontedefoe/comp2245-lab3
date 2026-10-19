const fruits = [
  { name: "apple", symbol: "🍎" },
  { name: "banana", symbol: "🍌" },
  { name: "cherry", symbol: "🍒" },
  { name: "coconut", symbol: "🥥" },
  { name: "grapes", symbol: "🍇" },
  { name: "mango", symbol: "🥭" },
  { name: "pineapple", symbol: "🍍" },
  { name: "watermelon", symbol: "🍉" }
];

const gameBoard = document.querySelector("#board");
const moveDisplay = document.querySelector("#moves");
const restartBtn = document.querySelector("#new-game");
const statusMsg = document.querySelector("#status");

let cardDeck = [];
let selectedCards = [];
let totalMoves = 0;
let locked = false;
let mismatchTimeout = null;

function shuffleArray(arr) {
  let currentIndex = arr.length;
  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
}

function initGame() {
  if (mismatchTimeout) {
    clearTimeout(mismatchTimeout);
    mismatchTimeout = null;
  }

  gameBoard.replaceChildren();
  cardDeck = shuffleArray([...fruits, ...fruits]);
  selectedCards = [];
  totalMoves = 0;
  locked = false;
  
  if (moveDisplay) moveDisplay.textContent = totalMoves;
  if (statusMsg) {
    statusMsg.textContent = "Turn over two cards to find a matching pair.";
    statusMsg.classList.remove("you-won");
  }

  for (let i = 0; i < cardDeck.length; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("card");
    btn.dataset.index = i;
    btn.setAttribute("aria-label", `Card ${i + 1}, face down`);
    gameBoard.appendChild(btn);
  }
}

gameBoard.addEventListener("click", (e) => {
  const activeCard = e.target.closest(".card");
  if (!activeCard || locked || activeCard.classList.contains("flipped") || activeCard.classList.contains("matched")) return;

  const idx = Number(activeCard.dataset.index);
  const fruitData = cardDeck[idx];

  activeCard.textContent = fruitData.symbol;
  activeCard.classList.add("flipped");
  activeCard.setAttribute("aria-label", `Card ${idx + 1}, ${fruitData.name}`);

  selectedCards.push({ card: activeCard, fruit: fruitData });

  if (selectedCards.length === 2) {
    totalMoves++;
    if (moveDisplay) moveDisplay.textContent = totalMoves;

    const [cardOne, cardTwo] = selectedCards;

    if (cardOne.fruit.name === cardTwo.fruit.name) {
      cardOne.card.classList.add("matched");
      cardTwo.card.classList.add("matched");
      selectedCards = [];

      const allMatched = document.querySelectorAll(".card.matched");
      if (allMatched.length === cardDeck.length && statusMsg) {
        statusMsg.textContent = `You found all the pairs in ${totalMoves} moves!`;
        statusMsg.classList.add("you-won");
      }
    } else {
      locked = true;
      mismatchTimeout = setTimeout(() => {
        cardOne.card.textContent = "";
        cardTwo.card.textContent = "";
        cardOne.card.classList.remove("flipped");
        cardTwo.card.classList.remove("flipped");
        cardOne.card.setAttribute("aria-label", `Card ${Number(cardOne.card.dataset.index) + 1}, face down`);
        cardTwo.card.setAttribute("aria-label", `Card ${Number(cardTwo.card.dataset.index) + 1}, face down`);
        selectedCards = [];
        locked = false;
        mismatchTimeout = null;
      }, 1000);
    }
  }
});

if (restartBtn) {
  restartBtn.addEventListener("click", initGame);
}

initGame();