const wordGrid = document.querySelector("#word-grid");

window.foodSignsVocabulary.forEach(({ word, videoUrl }) => {
    const card = document.createElement("article");
    card.className = "word-card";

    const video = document.createElement("video");
    video.controls = true;
    video.preload = "none";
    video.setAttribute("aria-label", `Video de la seña para ${word}`);

    if (videoUrl) {
        video.src = videoUrl;
    }

    const heading = document.createElement("h2");
    heading.textContent = word;

    card.append(video, heading);
    wordGrid.append(card);
});
