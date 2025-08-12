let currentGallery = [];
let currentIndex = 0;
let isLightboxOpen = false;

document.addEventListener("DOMContentLoaded", () => {
  // Crea il lightbox se non esiste
  createLightboxIfNotExists();
  
  // Inizializza i listener per le immagini
  initializeImageListeners();
  
  // Inizializza i controlli del lightbox
  initializeLightboxControls();
  
  // Gestione tastiera
  document.addEventListener("keydown", handleKeyboardNavigation);
});

function createLightboxIfNotExists() {
  let lightbox = document.getElementById("lightbox");
  
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.innerHTML = `
      <img id="lightbox-img" alt="Lightbox Image">
      <span class="close" onclick="closeLightbox()">&times;</span>
      <span class="prev" onclick="changeImage(-1)">&#8249;</span>
      <span class="next" onclick="changeImage(1)">&#8250;</span>
    `;
    document.body.appendChild(lightbox);
  }
}

function initializeImageListeners() {
  // Gestisce sia carousel che immagini singole
  const carousels = document.querySelectorAll(".carousel");
  const singleImages = document.querySelectorAll(".card img:not(.carousel img)");
  
  // Carousel images
  carousels.forEach(carousel => {
    const images = carousel.querySelectorAll("img");
    
    images.forEach((img, index) => {
      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        currentGallery = Array.from(images).map(i => i.src);
        currentIndex = index;
        openLightbox(currentGallery[currentIndex]);
      });
      
      // Aggiungi cursor pointer
      img.style.cursor = "pointer";
    });
  });
  
  // Single images
  singleImages.forEach(img => {
    img.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      currentGallery = [img.src];
      currentIndex = 0;
      openLightbox(img.src);
    });
    
    img.style.cursor = "pointer";
  });
}

function initializeLightboxControls() {
  const lightbox = document.getElementById("lightbox");
  
  if (!lightbox) return;
  
  // Click sul background per chiudere
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Gestione touch/swipe per mobile
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  
  lightbox.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  
  lightbox.addEventListener("touchmove", (e) => {
    // Previene lo scroll della pagina
    if (isLightboxOpen) {
      e.preventDefault();
    }
  }, { passive: false });
  
  lightbox.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeDistanceX = startX - endX;
    const swipeDistanceY = Math.abs(startY - endY);
    
    // Solo se lo swipe è principalmente orizzontale
    if (swipeDistanceY < 100) {
      if (swipeDistanceX > 50) {
        changeImage(1); // avanti
      } else if (swipeDistanceX < -50) {
        changeImage(-1); // indietro
      }
    }
  }
}

function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  
  if (!lightbox || !lightboxImg) {
    console.error("Lightbox elements not found");
    return;
  }
  
  // Preload dell'immagine per evitare flickering
  const img = new Image();
  img.onload = () => {
    lightboxImg.src = src;
    lightbox.style.display = "flex";
    
    // Aggiungi classe per animazione
    setTimeout(() => {
      lightbox.classList.add("show");
    }, 10);
    
    isLightboxOpen = true;
    document.body.style.overflow = "hidden"; // Previene scroll della pagina
  };
  
  img.onerror = () => {
    console.error("Error loading image:", src);
  };
  
  img.src = src;
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  
  if (!lightbox) return;
  
  lightbox.classList.remove("show");
  
  setTimeout(() => {
    lightbox.style.display = "none";
    isLightboxOpen = false;
    document.body.style.overflow = ""; // Ripristina scroll
  }, 300);
}

function changeImage(direction) {
  if (currentGallery.length <= 1) return;
  
  currentIndex += direction;
  
  // Loop infinito
  if (currentIndex < 0) {
    currentIndex = currentGallery.length - 1;
  } else if (currentIndex >= currentGallery.length) {
    currentIndex = 0;
  }
  
  const lightboxImg = document.getElementById("lightbox-img");
  
  if (lightboxImg) {
    // Effetto slide smoothe
    const slideDirection = direction > 0 ? 'translateX(-100px)' : 'translateX(100px)';
    
    // Prima fase: slide out
    lightboxImg.style.transform = slideDirection;
    lightboxImg.style.opacity = "0";
    
    // Preload della nuova immagine
    const img = new Image();
    img.onload = () => {
      // Cambia immagine quando è caricata
      lightboxImg.src = currentGallery[currentIndex];
      
      // Seconda fase: slide in dall'altro lato
      const slideIn = direction > 0 ? 'translateX(100px)' : 'translateX(-100px)';
      lightboxImg.style.transform = slideIn;
      
      // Animazione di entrata
      setTimeout(() => {
        lightboxImg.style.transform = 'translateX(0)';
        lightboxImg.style.opacity = "1";
      }, 50);
    };
    img.src = currentGallery[currentIndex];
  }
}

function handleKeyboardNavigation(e) {
  if (!isLightboxOpen) return;
  
  switch(e.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowLeft":
      changeImage(-1);
      break;
    case "ArrowRight":
      changeImage(1);
      break;
  }
}

// Funzioni globali per i controlli onclick
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.changeImage = changeImage;