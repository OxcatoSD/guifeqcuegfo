const state = {
    clicks: 0, // Inicia en 0 y se reinicia al recargar la página
};

const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('clickBtn');

// Actualiza el número del contador y revisa el color del botón
function updateUI() {
    scoreEl.textContent = Math.floor(state.clicks);
    updateButtonStage();
}

// Función que cambia el color del botón según la cantidad de clics
function updateButtonStage() {
    // Limpia las clases anteriores dejando solo la base
    clickBtn.className = 'click-btn';

    if (state.clicks >= 150) {
        clickBtn.classList.add('stage-150');
    } else if (state.clicks >= 100) {
        clickBtn.classList.add('stage-100');
    } else if (state.clicks >= 80) {
        clickBtn.classList.add('stage-80');
    } else if (state.clicks >= 60) {
        clickBtn.classList.add('stage-60');
    } else if (state.clicks >= 40) {
        clickBtn.classList.add('stage-40');
    } else if (state.clicks >= 20) {
        clickBtn.classList.add('stage-20');
    } else if (state.clicks >= 10) {
        clickBtn.classList.add('stage-10');
    }
}

// Evento que suma un clic al presionar el botón
clickBtn.addEventListener('click', () => {
    state.clicks += 1;
    updateUI();
});

// Iniciar el juego
updateUI();