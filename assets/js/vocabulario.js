const wordGrid = document.querySelector("#word-grid");

window.foodSignsVocabulary.forEach(({ word, videoUrl, imageUrls }) => {
    const card = document.createElement("article");
    card.className = "word-card";

    const mediaContainer = document.createElement("div");
    mediaContainer.className = "word-card__media";

    const imagePanel = document.createElement("div");
    imagePanel.className = "word-card__media-item";

    const imageLabel = document.createElement("p");
    imageLabel.className = "word-card__media-label";
    imageLabel.textContent = "Imagen";

    const signImage = document.createElement("img");
    signImage.className = "word-card__image";
    signImage.alt = `Imagen de referencia de la seña para ${word}`;
    signImage.hidden = true;

    const imagePlaceholder = document.createElement("p");
    imagePlaceholder.className = "word-card__placeholder";
    imagePlaceholder.textContent = "Imagen pendiente de agregar.";
    let imageUrlIndex = 0;

    signImage.addEventListener("load", () => {
        signImage.hidden = false;
        imagePlaceholder.hidden = true;
    });
    signImage.addEventListener("error", () => {
        if (imageUrlIndex < imageUrls.length) {
            signImage.src = imageUrls[imageUrlIndex++];
            return;
        }

        signImage.hidden = true;
        imagePlaceholder.hidden = false;
    });
    if (imageUrls.length > 0) {
        signImage.src = imageUrls[imageUrlIndex++];
    }
    imagePanel.append(imageLabel, signImage, imagePlaceholder);

    const videoPanel = document.createElement("div");
    videoPanel.className = "word-card__media-item";

    const videoLabel = document.createElement("p");
    videoLabel.className = "word-card__media-label";
    videoLabel.textContent = "Video";
    videoPanel.append(videoLabel);

    if (videoUrl) {
        const video = document.createElement("video");
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("aria-label", `Video de la seña para ${word}`);

        const videoPlaceholder = document.createElement("p");
        videoPlaceholder.className = "word-card__placeholder";
        videoPlaceholder.textContent = "Cargando video...";

        video.addEventListener("loadeddata", () => {
            videoPlaceholder.hidden = true;
        });

        video.addEventListener("error", () => {
            videoPlaceholder.hidden = false;
            videoPlaceholder.textContent = "Video pendiente de agregar.";
        });

        video.src = videoUrl;
        videoPanel.append(video, videoPlaceholder);
    } else {
        const videoPlaceholder = document.createElement("p");
        videoPlaceholder.className = "word-card__placeholder";
        videoPlaceholder.textContent = "Video pendiente de agregar.";
        videoPanel.append(videoPlaceholder);
    }

    const heading = document.createElement("h2");
    heading.textContent = word;

    mediaContainer.append(imagePanel, videoPanel);
    card.append(mediaContainer, heading);
    wordGrid.append(card);
});
