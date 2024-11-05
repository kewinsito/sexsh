// Configuración del carrusel automático
let currentIndex = 1;
const totalSlides = 3;

function autoSlide() {
    currentIndex++;
    if (currentIndex > totalSlides) {
        currentIndex = 1;
    }
    document.getElementById('slide-' + currentIndex).checked = true;
}

// Cambiar de imagen cada 3 segundos
setInterval(autoSlide, 3000);
