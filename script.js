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

  // --- Swipe su mobile ---
  const lightbox = document.getElementById("lightbox");
  let startX = 0;
  let endX = 0;

  lightbox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, false);

  lightbox.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const swipeDistance = startX - endX;
    if (swipeDistance > 50) {
      changeImage(1); // avanti
    } else if (swipeDistance < -50) {
      changeImage(-1); // indietro
    }
  }
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
