const wordGrid = document.querySelector("#word-grid");

window.foodSignsVocabulary.forEach(({ word, videoUrl }) => {
    const card = document.createElement("article");
    card.className = "word-card";

    const mediaContainer = document.createElement("div");
    mediaContainer.className = "word-card__media";

    if (videoUrl) {
        const video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("aria-label", `Video de la seña para ${word}`);

        const placeholder = document.createElement("p");
        placeholder.className = "word-card__placeholder";
        placeholder.textContent = "Cargando video...";

        video.addEventListener("loadeddata", () => {
            placeholder.hidden = true;
        });

        video.addEventListener("error", () => {
            placeholder.hidden = false;
            placeholder.textContent = "Video pendiente de agregar.";
        });

        video.src = videoUrl;
        mediaContainer.append(video, placeholder);
    } else {
        const placeholder = document.createElement("p");
        placeholder.className = "word-card__placeholder";
        placeholder.textContent = "Video pendiente de agregar.";
        mediaContainer.append(placeholder);
    }

    const heading = document.createElement("h2");
    heading.textContent = word;

    card.append(mediaContainer, heading);
    wordGrid.append(card);
});
