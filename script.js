"use strict";

// Seleção dos elementos HTML

const [btnPlay, btnExit, btnContinue, btnExitWin, btnPlayAgain] =
  document.querySelectorAll("button");

const [sectionInfo, sectionStart, sectionCards, sectionPause, sectionWin] =
  document.querySelectorAll("section");

const [iconPause, iconInfo, iconExitInfo] = document.querySelectorAll("i");

const divTemporizador = document.querySelector(".temp");

const timer = document.querySelector("#timer");

// Variáveis e inicializações

const animals = [
  "bear",
  "bee",
  "coal",
  "cow",
  "dog",
  "elephant",
  "panda",
  "pig",
  "rex",
  "sheep",
  "unicorn",
  "whale",
];

let card1 = "";
let card2 = "";
let segundos = 0;
let minutos = 0;
let interval;
let numMoves = 0;

sectionInfo.style.display = "none";
sectionPause.style.display = "none";
sectionWin.style.display = "none";

// Função que checa se o jogo acabou
const checkEndGame = () => {
  const cards = document.querySelectorAll(".card-container");
  console.log(cards);
  let flag = true;

  for (const card of cards) {
    if (!card.firstChild.className.includes("disabled")) {
      flag = false;
      break;
    }
  }

  if (flag) {
    sectionCards.opacity = ".5";
    iconPause.style.display = "none";
    setTimeout(() => {
      sectionWin.style.display = "grid";
    }, 3000);
    clearInterval(interval);
  }
};

// Função que faz a comparação de duas cartas
const compareCards = (c1, c2) => {
  if (c1.getAttribute("data-info") === c2.getAttribute("data-info")) {
    c1.firstChild.classList.add("disabled");
    c2.firstChild.classList.add("disabled");
    setTimeout(() => {
      c1.firstChild.classList.add("animation-correct-cards");
      c2.firstChild.classList.add("animation-correct-cards");
      card1 = "";
      card2 = "";
      checkEndGame();
    }, 1500);
  } else {
    setTimeout(() => {
      c1.classList.remove("clicked");
      c2.classList.remove("clicked");
    }, 2000);
    setTimeout(() => {
      card1 = "";
      card2 = "";
    }, 1000);
  }

  numMoves++;
  displayMoves(numMoves);
};

// Função que controla a jogada e efeitos
const revealCard = (card) => {
  if (card.className.includes("clicked")) return;

  if (card1 === "") {
    card.classList.add("clicked");
    card1 = card;
  } else if (card2 === "") {
    card.classList.add("clicked");
    card2 = card;
    compareCards(card1, card2);
  }
};

//Função que cria as cartas do jogo
const createCards = (animal) => {
  const card = document.createElement("div");
  const divFront = document.createElement("div");
  const divBack = document.createElement("div");

  card.className = "card-container";
  divFront.className = "card front";
  divBack.className = "card back";
  card.setAttribute("data-info", animal);

  divFront.style.backgroundImage = `url(images/${animal}.jpg)`;

  card.appendChild(divFront);
  card.appendChild(divBack);
  sectionCards.appendChild(card);

  card.addEventListener("click", () => revealCard(card));
};

// Função que embaralha o array
const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Função de display do numero de jogadas
const displayMoves = (num) => {
  const moves = document.querySelector("#moves");
  moves.textContent = `${num} moves`;
};

// Função de display do cronometro
const displayTimer = (s, min, temp) =>
  (temp.textContent = `${min.toString().length === 1 ? `0` + min : min}:${
    s.toString().length === 1 ? `0` + s : s
  }`);

// Função que inicia o cronometro
const initCronometer = () => {
  interval = setInterval(() => {
    segundos++;

    if (segundos === 60) {
      segundos = 0;
      minutos++;
    }

    displayTimer(segundos, minutos, timer);
  }, 1000);
};

// Função que inicia o jogo
const initGame = (array) => {
  const duplicateArray = [...array, ...array];
  const shuffledArray = shuffleArray(duplicateArray);

  shuffledArray.forEach((element) => createCards(element));
  iconPause.style.display = "block";

  sectionCards.classList.add("appear-cards");
  divTemporizador.classList.add("opacity-animation");
  timer.classList.add("opacity-animation");

  divTemporizador.style.animationDuration = timer.style.animationDuration =
    "1s";
  divTemporizador.style.animationDelay = timer.style.animationDelay = "0s";

  setTimeout(() => {
    initCronometer();
    displayMoves(numMoves);
  }, 1000);
};

// Evento para o botão de jogar
btnPlay.addEventListener("click", () => {
  sectionStart.style.display = "none";
  initGame(animals);
});

// Eventos e funções da seção INFO

iconInfo.addEventListener("click", () => {
  sectionInfo.style.display = "flex";
  sectionStart.style.opacity = ".5";
  sectionCards.style.opacity = ".5";
});

iconExitInfo.addEventListener("click", () => {
  sectionInfo.style.display = "none";
  sectionStart.style.opacity = "1";
  sectionCards.style.opacity = "1";
});

// Eventos e funções da seção PAUSE

iconPause.addEventListener("click", () => {
  sectionPause.style.display = "grid";
  sectionStart.style.opacity = ".5";
  sectionCards.style.opacity = ".5";
  clearInterval(interval);
});

btnContinue.addEventListener("click", () => {
  sectionPause.style.display = "none";
  sectionStart.style.opacity = "1";
  sectionCards.style.opacity = "1";
  initCronometer();
});

btnExit.addEventListener("click", () => {
  location.reload();
});

// Eventos e funções da seção WIN

btnExitWin.addEventListener("click", () => {
  location.reload();
});

btnPlayAgain.addEventListener("click", () => {
  const cards = document.querySelectorAll(".card-container");
  segundos = 0;
  minutos = 0;
  numMoves = 0;

  cards.forEach((card) => sectionCards.removeChild(card));
  sectionWin.style.display = "none";

  initGame(animals);
  displayTimer(0, 0, timer);
  displayMoves(numMoves);
});

// Evento de inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", function () {
  const [img, h1, btn] = document.querySelectorAll(".start > *");
  const header = document.querySelector("header");

  img.classList.add("img-animation");
  h1.classList.add("title-animation");
  btn.classList.add("opacity-animation");
  header.classList.add("opacity-animation");
  btn.disabled = true;

  setTimeout(() => {
    img.classList.remove("grow-animation");
    h1.classList.remove("title-animation");
    btn.classList.remove("opacity-animation");
    header.classList.remove("opacity-animation");
    btn.disabled = false;
  }, 7500);

  setTimeout(() => {
    img.classList.add("jump-animation");
    btn.classList.add("gradient");
  }, 9000);
});
