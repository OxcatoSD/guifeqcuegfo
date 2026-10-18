const state = {
    clicks: 0, // Siempre empezará en 0
};

const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('clickBtn');

// Actualiza el número y revisa si debe cambiar de color el botón
function updateUI() {
    scoreEl.textContent = Math.floor(state.clicks);
    updateButtonStage();
}

// Función que aplica las clases según los clics
function updateButtonStage() {
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

// Evento del click
clickBtn.addEventListener('click', () => {
    state.clicks += 1;
    updateUI();
});

// Iniciar
updateUI();