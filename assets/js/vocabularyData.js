const vocabularyVideoBase = document.currentScript.src;

window.foodSignsVocabulary = [
    { word: "Frijol", video: "" },
    { word: "Frio", video: "" },
    { word: "Galleta", video: "" },
    { word: "Gaseosa", video: "" },
    { word: "Gelatina", video: "" },
    { word: "Hambre", video: "" },
    { word: "Hamburguesa", video: "" },
    { word: "Helado", video: "" },
    { word: "Higado", video: "" },
    { word: "Huevo", video: "" },
    { word: "Jamón", video: "" },
    { word: "Jugo", video: "" },
    { word: "Leche", video: "" },
    { word: "Lenteja", video: "" },
    { word: "Lleno", video: "" },
    { word: "Mantequilla", video: "" },
    { word: "Mazorca", video: "" },
    { word: "Mermelada", video: "" },
    { word: "Naranja", video: "" },
    { word: "Oler", video: "" },
    { word: "Pan", video: "" },
    { word: "Panela", video: "" },
    { word: "Papa", video: "" },
    { word: "Perro caliente", video: "" }
].map((item) => ({
    ...item,
    videoUrl: item.video ? new URL(item.video, vocabularyVideoBase).href : ""
}));
