const answerContainer = document.querySelector("#answer-options");
const message = document.querySelector("#game-message");
const video = document.querySelector("#sign-video");
const videoPlaceholder = document.querySelector("#video-placeholder");
const roundNumber = document.querySelector("#round-number");
const scoreDisplay = document.querySelector("#score");
const newGameButton = document.querySelector("#new-game");
const nextRoundButton = document.querySelector("#next-round");
const difficultyButtons = [...document.querySelectorAll(".difficulty__option")];

const optionCounts = {
    facil: 3,
    medio: 6,
    dificil: 10
};

const vocabulary = window.foodSignsVocabulary;
let level = "facil";
let playableWords = [];
let targetQueue = [];
let currentWord = null;
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
    answered = false;
    answerContainer.replaceChildren();
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.hidden = true;
    videoPlaceholder.hidden = false;
    videoPlaceholder.classList.remove("round__placeholder--word");
    videoPlaceholder.textContent = "La palabra aparecerá aquí.";
    roundNumber.textContent = "0";
    scoreDisplay.textContent = "0";
    nextRoundButton.hidden = true;
}

function drawRound() {
    if (targetQueue.length === 0) {
        targetQueue = shuffle(playableWords);
    }

    currentWord = targetQueue.pop();
    rounds += 1;
    answered = false;

    video.pause();
    video.removeAttribute("src");
    video.load();
    video.hidden = true;
    videoPlaceholder.hidden = false;
    videoPlaceholder.textContent = currentWord.word;
    videoPlaceholder.classList.add("round__placeholder--word");

    const numberOfOptions = Math.min(optionCounts[level], vocabulary.length);
    const distractors = shuffle(vocabulary.filter((item) => item.word !== currentWord.word))
        .slice(0, numberOfOptions - 1);
    const options = shuffle([currentWord, ...distractors]);

    answerContainer.replaceChildren(...options.map((item) => {
        const button = document.createElement("button");
        button.className = "answer-option answer-video-option";
        button.type = "button";
        button.dataset.word = item.word;

        const optionVideo = document.createElement("video");
        optionVideo.src = item.videoUrl;
        optionVideo.autoplay = true;
        optionVideo.loop = true;
        optionVideo.muted = true;
        optionVideo.playsInline = true;
        optionVideo.preload = "auto";
        optionVideo.controls = false;
        optionVideo.setAttribute("aria-label", `Video de la palabra ${item.word}`);

        button.append(optionVideo);
        button.addEventListener("click", () => selectAnswer(button, item));
        return button;
    }));

    roundNumber.textContent = String(rounds);
    scoreDisplay.textContent = String(score);
    newGameButton.textContent = "Nueva partida";
    nextRoundButton.hidden = true;
    setMessage("Selecciona el video que corresponde a la palabra.");
}

function selectAnswer(button, selectedWord) {
    if (answered || !currentWord) {
        return;
    }

    answered = true;
    const isCorrect = selectedWord.word === currentWord.word;

    answerContainer.querySelectorAll("button").forEach((option) => {
        option.disabled = true;

        if (option.dataset.word === currentWord.word) {
            option.classList.add("is-correct");
        }
    });

    if (isCorrect) {
        score += 1;
        button.classList.add("is-correct");
        setMessage("¡Correcto! Muy bien.", "success");
    } else {
        button.classList.add("is-incorrect");
        video.src = currentWord.videoUrl;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.hidden = false;
        videoPlaceholder.hidden = true;
        video.load();
        setMessage("Ese no era. Aquí está el video correcto.", "error");
    }

    scoreDisplay.textContent = String(score);
    nextRoundButton.hidden = false;
}

difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
        level = button.dataset.level;

        difficultyButtons.forEach((option) => {
            const isSelected = option === button;
            option.classList.toggle("is-selected", isSelected);
            option.setAttribute("aria-pressed", String(isSelected));
        });

        clearRound();
        setMessage(`Nivel ${button.querySelector("strong").textContent} seleccionado. Inicia una partida nueva.`);
        newGameButton.textContent = rounds > 0 ? "Nueva partida" : "Iniciar partida";
    });
});

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

video.addEventListener("error", () => {
    if (currentWord) {
        video.hidden = true;
        videoPlaceholder.hidden = false;
        videoPlaceholder.textContent = `No se pudo cargar el video de ${currentWord.word}. Revisa su ruta en assets/js/vocabularyData.js.`;
        setMessage("No se pudo reproducir el video. Revisa la ruta del archivo.", "error");
    }
});

clearRound();
