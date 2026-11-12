const answerSlots = document.querySelector("#answer-slots");
const wordBank = document.querySelector("#word-bank");
const signVideos = document.querySelector("#sign-videos");
const videoPlaceholder = document.querySelector("#video-placeholder");
const message = document.querySelector("#game-message");
const roundNumber = document.querySelector("#round-number");
const scoreDisplay = document.querySelector("#score");
const newGameButton = document.querySelector("#new-game");
const nextRoundButton = document.querySelector("#next-round");
const checkAnswerButton = document.querySelector("#check-answer");
const clearAnswerButton = document.querySelector("#clear-answer");

const vocabulary = window.foodSignsVocabulary;
const phraseDefinitions = [
    [
        { text: "El" },
        { text: "frijol", sign: "Frijol" },
        { text: "está" },
        { text: "frío", sign: "Frio" }
    ],
    [
        { text: "La" },
        { text: "galleta", sign: "Galleta" },
        { text: "está" },
        { text: "fría", sign: "Frio" }
    ],
    [
        { text: "La" },
        { text: "gaseosa", sign: "Gaseosa" },
        { text: "está" },
        { text: "fría", sign: "Frio" }
    ]
];

let targetQueue = [];
let currentPhrase = null;
let placedWords = [];
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

function getPhraseWords(definition) {
    return definition.map(({ text, sign }) => {
        const vocabularyEntry = sign && vocabulary.find((item) => item.word === sign);
        if (sign && !vocabularyEntry?.videoUrl) {
            return null;
        }

        return { text, videoUrl: vocabularyEntry?.videoUrl ?? "" };
    });
}

function clearRound() {
    currentPhrase = null;
    placedWords = [];
    slotButtons = [];
    answered = false;
    answerSlots.replaceChildren();
    wordBank.replaceChildren();
    signVideos.replaceChildren();
    videoPlaceholder.hidden = false;
    videoPlaceholder.textContent = "Inicia una partida para ver los videos de las señas.";
    roundNumber.textContent = "0";
    scoreDisplay.textContent = "0";
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = true;
    nextRoundButton.hidden = true;
}

function removeWord(position) {
    if (answered || position < 0 || !placedWords[position]) {
        return;
    }

    placedWords[position].button.disabled = false;
    placedWords[position] = null;
    slotButtons[position].textContent = " ";
    slotButtons[position].classList.replace("is-filled", "is-empty");
    slotButtons[position].setAttribute("aria-label", `Espacio ${position + 1} de la frase`);
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = !placedWords.some(Boolean);
}

function placeWord(word) {
    if (answered || !currentPhrase) {
        return;
    }

    const position = placedWords.findIndex((placedWord) => placedWord === null);

    if (position === -1) {
        return;
    }

    placedWords[position] = word;
    word.button.disabled = true;
    slotButtons[position].textContent = word.text;
    slotButtons[position].classList.replace("is-empty", "is-filled");
    slotButtons[position].setAttribute(
        "aria-label",
        `Quitar ${word.text} de la posición ${position + 1}`
    );
    checkAnswerButton.disabled = placedWords.some((placedWord) => placedWord === null);
    clearAnswerButton.disabled = false;
}

function renderPhrase() {
    answerSlots.replaceChildren();
    wordBank.replaceChildren();
    signVideos.replaceChildren();
    placedWords = Array(currentPhrase.length).fill(null);
    slotButtons = [];

    const tiles = currentPhrase.map((word) => {
        const slot = document.createElement("button");
        slot.className = "word-slot is-empty";
        slot.type = "button";
        slot.textContent = " ";
        slot.setAttribute("aria-label", `Espacio ${slotButtons.length + 1} de la frase`);
        slot.addEventListener("click", () => removeWord(slotButtons.indexOf(slot)));
        slotButtons.push(slot);
        answerSlots.append(slot);

        const button = document.createElement("button");
        button.className = "word-tile";
        button.type = "button";
        button.textContent = word.text;
        button.addEventListener("click", () => placeWord(word));
        word.button = button;

        return word;
    });

    shuffle(tiles).forEach(({ button }) => wordBank.append(button));

    shuffle(currentPhrase.filter((word) => word.videoUrl)).forEach((word, index) => {
        const videoCard = document.createElement("div");
        videoCard.className = "sign-video";

        const video = document.createElement("video");
        video.controls = true;
        video.preload = "metadata";
        video.playsInline = true;
        video.setAttribute("aria-label", `Video de una seña, pista ${index + 1}`);
        video.src = word.videoUrl;
        video.addEventListener("error", () => {
            setMessage("No se pudo cargar un video de la ronda. Revisa los archivos de señas.", "error");
        });

        videoCard.append(video);
        signVideos.append(videoCard);
    });

    videoPlaceholder.hidden = true;
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = true;
}

function drawRound() {
    if (targetQueue.length === 0) {
        targetQueue = shuffle(phraseDefinitions);
    }

    const definition = targetQueue.pop();
    const words = getPhraseWords(definition);

    if (words.some((word) => !word)) {
        setMessage("No están disponibles todos los videos para esta frase.", "error");
        return;
    }

    currentPhrase = words;
    rounds += 1;
    answered = false;
    renderPhrase();
    roundNumber.textContent = String(rounds);
    scoreDisplay.textContent = String(score);
    newGameButton.textContent = "Nueva partida";
    nextRoundButton.hidden = true;
    setMessage("Mira los videos y organiza las palabras para formar la frase.");
}

function clearAnswer() {
    if (answered) {
        return;
    }

    placedWords.forEach((word, index) => {
        if (word) {
            word.button.disabled = false;
            slotButtons[index].textContent = " ";
            slotButtons[index].classList.replace("is-filled", "is-empty");
            slotButtons[index].setAttribute("aria-label", `Espacio ${index + 1} de la frase`);
        }
    });

    placedWords.fill(null);
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = true;
}

function checkAnswer() {
    if (answered || !currentPhrase || placedWords.some((word) => !word)) {
        return;
    }

    answered = true;
    const answer = placedWords.map((word) => word.text).join(" ").toLocaleLowerCase("es");
    const expected = currentPhrase.map((word) => word.text).join(" ").toLocaleLowerCase("es");
    const isCorrect = answer === expected;

    slotButtons.forEach((slot) => {
        slot.classList.add(isCorrect ? "is-correct" : "is-incorrect");
    });
    wordBank.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
    });
    checkAnswerButton.disabled = true;
    clearAnswerButton.disabled = true;

    if (isCorrect) {
        score += 1;
        scoreDisplay.textContent = String(score);
        setMessage("¡Frase correcta! Muy bien.", "success");
    } else {
        setMessage(`La frase correcta era: ${currentPhrase.map((word) => word.text).join(" ")}.`, "error");
    }

    nextRoundButton.hidden = false;
}

newGameButton.addEventListener("click", () => {
    const availableSigns = new Set(vocabulary.filter((item) => item.videoUrl).map((item) => item.word));
    const availablePhrases = phraseDefinitions.filter((definition) =>
        definition.every(({ sign }) => !sign || availableSigns.has(sign))
    );

    if (availablePhrases.length === 0) {
        clearRound();
        setMessage("Todavía no hay videos suficientes para crear frases.", "error");
        return;
    }

    score = 0;
    rounds = 0;
    targetQueue = shuffle(availablePhrases);
    drawRound();
});

nextRoundButton.addEventListener("click", drawRound);
checkAnswerButton.addEventListener("click", checkAnswer);
clearAnswerButton.addEventListener("click", clearAnswer);

clearRound();
