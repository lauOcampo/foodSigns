const answerSlots = document.querySelector("#answer-slots");
const letterBank = document.querySelector("#letter-bank");
const message = document.querySelector("#game-message");
const video = document.querySelector("#sign-video");
const videoPlaceholder = document.querySelector("#video-placeholder");
const roundNumber = document.querySelector("#round-number");
const scoreDisplay = document.querySelector("#score");
const newGameButton = document.querySelector("#new-game");
const nextRoundButton = document.querySelector("#next-round");
const checkAnswerButton = document.querySelector("#check-answer");
const clearAnswerButton = document.querySelector("#clear-answer");

const vocabulary = window.foodSignsVocabulary;
let playableWords = [];
let targetQueue = [];
let currentWord = null;
let symbols = [];
let placedLetters = [];
let slotButtons = [];
let score = 0;
let rounds = 0;
let answered = false;

function shuffle(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
}

function setMessage(text, state = "") {
    message.textContent = text;
    message.classList.toggle("is-error", state === "error");
    message.classList.toggle("is-success", state === "success");
}

function clearRound() {
    currentWord = null;
    symbols = [];
    placedLetters = [];
    slotButtons = [];
    answered = false;
    answerSlots.replaceChildren();
    letterBank.replaceChildren();
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.hidden = true;
    videoPlaceholder.hidden = false;
    videoPlaceholder.textContent = "Inicia una partida para ver el video de la seña.";
    roundNumber.textContent = "0";
    scoreDisplay.textContent = "0";
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = true;
    nextRoundButton.hidden = true;
}

function removeLetter(position) {
    if (answered || !placedLetters[position]) {
        return;
    }

    placedLetters[position].button.disabled = false;
    placedLetters[position] = null;
    slotButtons[position].textContent = "·";
    slotButtons[position].classList.replace("is-filled", "is-empty");
    slotButtons[position].setAttribute("aria-label", `Espacio para letra ${position + 1}`);
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = !placedLetters.some(Boolean);
}

function placeLetter(letter) {
    if (answered || !currentWord) {
        return;
    }

    const position = symbols.findIndex((symbol, index) => symbol !== " " && placedLetters[index] === null);

    if (position === -1) {
        return;
    }

    placedLetters[position] = letter;
    letter.button.disabled = true;
    slotButtons[position].textContent = letter.character;
    slotButtons[position].classList.replace("is-empty", "is-filled");
    slotButtons[position].setAttribute(
        "aria-label",
        `Quitar letra ${letter.character} de la posición ${position + 1}`
    );

    const allLettersPlaced = symbols.every((symbol, index) => symbol === " " || placedLetters[index] !== null);
    checkAnswerButton.disabled = !allLettersPlaced;
    clearAnswerButton.disabled = false;
}

function renderWord() {
    answerSlots.replaceChildren();
    letterBank.replaceChildren();
    symbols = [...currentWord.word.normalize("NFC")];
    placedLetters = Array(symbols.length).fill(null);
    slotButtons = Array(symbols.length).fill(null);

    const tiles = [];
    let position = 0;

    symbols.forEach((symbol, index) => {
        if (symbol === " ") {
            const gap = document.createElement("span");
            gap.className = "answer-slots__word-gap";
            gap.setAttribute("aria-hidden", "true");
            answerSlots.append(gap);
            return;
        }

        const slot = document.createElement("button");
        slot.className = "letter-slot is-empty";
        slot.type = "button";
        slot.textContent = "·";
        slot.setAttribute("aria-label", `Espacio para letra ${position + 1}`);
        slot.addEventListener("click", () => removeLetter(index));
        answerSlots.append(slot);
        slotButtons[index] = slot;

        const tile = {
            character: symbol,
            button: document.createElement("button")
        };
        tile.button.className = "letter-tile";
        tile.button.type = "button";
        tile.button.textContent = symbol.toLocaleUpperCase("es");
        tile.button.setAttribute("aria-label", `Usar letra ${symbol}`);
        tile.button.addEventListener("click", () => placeLetter(tile));
        tiles.push(tile);
        position += 1;
    });

    shuffle(tiles).forEach(({ button }) => letterBank.append(button));
    clearAnswerButton.disabled = true;
    checkAnswerButton.disabled = true;
}

function drawRound() {
    if (targetQueue.length === 0) {
        targetQueue = shuffle(playableWords);
    }

    currentWord = targetQueue.pop();
    rounds += 1;
    answered = false;

    video.src = currentWord.videoUrl;
    video.hidden = false;
    videoPlaceholder.hidden = true;
    video.load();

    renderWord();
    roundNumber.textContent = String(rounds);
    scoreDisplay.textContent = String(score);
    newGameButton.textContent = "Nueva partida";
    nextRoundButton.hidden = true;
    setMessage("Ordena las letras para formar la palabra de la seña.");
}

function clearAnswer() {
    if (answered) {
        return;
    }

    placedLetters.forEach((letter, index) => {
        if (letter) {
            letter.button.disabled = false;
            slotButtons[index].textContent = "·";
            slotButtons[index].classList.replace("is-filled", "is-empty");
            slotButtons[index].setAttribute("aria-label", `Espacio para letra ${index + 1}`);
        }
    });

    placedLetters.fill(null);
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = true;
}

function checkAnswer() {
    if (answered || !currentWord) {
        return;
    }

    if (placedLetters.some((letter, index) => symbols[index] !== " " && !letter)) {
        setMessage("Primero coloca todas las letras.", "error");
        return;
    }

    answered = true;
    const answer = symbols.map((symbol, index) => (symbol === " " ? " " : placedLetters[index].character))
        .join("")
        .toLocaleLowerCase("es");
    const isCorrect = answer === currentWord.word.normalize("NFC").toLocaleLowerCase("es");

    slotButtons.forEach((slot) => {
        if (slot) {
            slot.classList.add(isCorrect ? "is-correct" : "is-incorrect");
        }
    });

    letterBank.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
    });
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = true;

    if (isCorrect) {
        score += 1;
        scoreDisplay.textContent = String(score);
        setMessage("¡Correcto! Muy bien.", "success");
    } else {
        setMessage(`La palabra era: ${currentWord.word}.`, "error");
    }

    nextRoundButton.hidden = false;
}

newGameButton.addEventListener("click", () => {
    playableWords = vocabulary.filter((item) => item.videoUrl);

    if (playableWords.length === 0) {
        clearRound();
        setMessage(
            "Todavía no hay videos disponibles. Agrega la ruta de cada video en assets/js/vocabularyData.js para poder jugar.",
            "error"
        );
        return;
    }

    score = 0;
    rounds = 0;
    targetQueue = shuffle(playableWords);
    drawRound();
});

nextRoundButton.addEventListener("click", drawRound);
checkAnswerButton.addEventListener("click", checkAnswer);
clearAnswerButton.addEventListener("click", clearAnswer);

video.addEventListener("error", () => {
    if (currentWord) {
        video.hidden = true;
        videoPlaceholder.hidden = false;
        videoPlaceholder.textContent = `No se pudo cargar el video de ${currentWord.word}. Revisa su ruta en assets/js/vocabularyData.js.`;
        setMessage("No se pudo reproducir el video. Revisa la ruta del archivo.", "error");
    }
});

clearRound();
