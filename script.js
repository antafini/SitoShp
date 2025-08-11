let currentGallery = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Prende tutte le immagini nelle card e aggiunge evento click
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {
    const images = carousel.querySelectorAll("img");

    images.forEach((img, index) => {
      img.addEventListener("click", () => {
        currentGallery = Array.from(images).map(i => i.src); // Salva tutte le immagini della card
        currentIndex = index; // Salva l'immagine cliccata
        openLightbox(currentGallery[currentIndex]);
      });
    });
  });
});

function openLightbox(src) {
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox").style.display = "flex";
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

function changeImage(direction) {
  currentIndex += direction;

  // Loop infinito: se arrivo alla fine ricomincio
  if (currentIndex < 0) {
    currentIndex = currentGallery.length - 1;
  } else if (currentIndex >= currentGallery.length) {
    currentIndex = 0;
  }

  document.getElementById("lightbox-img").src = currentGallery[currentIndex];
}
