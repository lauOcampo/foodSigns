const vocabularyVideoBase = document.currentScript.src;

window.foodSignsVocabulary = [
    { word: "Frijol", video: "../videos/frijol.mp4" },
    { word: "Frio", video: "../videos/frio.mp4" },
    { word: "Galleta", video: "../videos/galleta.mp4" },
    { word: "Gaseosa", video: "../videos/gaseosa.mp4" },
    { word: "Gelatina", video: "../videos/gelatina.mp4" },
    { word: "Hambre", video: "../videos/hambre.mp4" },
    { word: "Hamburguesa", video: "../videos/hamburguesa.mp4" },
    { word: "Helado", video: "../videos/helado.mp4" },
    { word: "Higado", video: "../videos/higado.mp4" },
    { word: "Huevo", video: "../videos/huevo.mp4" },
    { word: "Jamón", video: "../videos/jamon.mp4" },
    { word: "Jugo", video: "../videos/jugo.mp4" },
    { word: "Leche", video: "../videos/leche.mp4" },
    { word: "Lenteja", video: "../videos/lenteja.mp4" },
    { word: "Lleno", video: "../videos/lleno.mp4" },
    { word: "Mantequilla", video: "../videos/mantequilla.mp4" },
    { word: "Mazorca", video: "../videos/mazorca.mp4" },
    { word: "Mermelada", video: "../videos/mermelada.mp4" },
    { word: "Naranja", video: "../videos/naranja.mp4" },
    { word: "Oler", video: "../videos/oler.mp4" },
    { word: "Pan", video: "../videos/pan.mp4" },
    { word: "Panela", video: "../videos/panela.mp4" },
    { word: "Papa", video: "../videos/papa.mp4" },
    { word: "Perro caliente", video: "../videos/perro.mp4" }
].map((item) => ({
    ...item,
    videoUrl: item.video ? new URL(item.video, vocabularyVideoBase).href : "",
    imageUrls: item.video
        ? [".jpg", ".webp"].map((extension) => {
            const imageName = item.video.split("/").pop().replace(/\.mp4$/i, extension);
            return new URL(`../img/${imageName}`, vocabularyVideoBase).href;
        })
        : []
}));
