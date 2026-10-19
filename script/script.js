const state = {
    clicks: 0,
};

const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('clickBtn');
const btnImage = document.getElementById('btnImage');
const squeakSound = document.getElementById('dogToySound');

squeakSound.volume = 0.4;

// ==========================================
// TUS PAREJAS DE IMÁGENES
// Formato: [Imagen Normal, Imagen Presionada]
// ==========================================
const niveles = [
    { limite: 0, normal: 'img/IMG-20261018-WA0030.jpg', presionada: 'img/IMG-20261018-WA0031.jpg' },
    { limite: 50, normal: 'img/IMG-20261018-WA0032.jpg', presionada: 'img/IMG-20261018-WA0033.jpg' },
    { limite: 100, normal: 'img/IMG-20261018-WA0034.jpg', presionada: 'img/IMG-20261018-WA0035.jpg' },
    { limite: 160, normal: 'img/IMG-20261018-WA0036.jpg', presionada: 'img/IMG-20261018-WA0037.jpg' }
];

let nivelActual = niveles[0];

// Función para saber en qué nivel estamos según los clics
function obtenerNivel(clicks) {
    let nivel = niveles[0];
    for (let i = 0; i < niveles.length; i++) {
        if (clicks >= niveles[i].limite) {
            nivel = niveles[i];
        }
    }
    return nivel;
}

// Actualiza la pantalla
function actualizarUI() {
    scoreEl.textContent = Math.floor(state.clicks);
    nivelActual = obtenerNivel(state.clicks);

    // Actualizamos el brillo de fondo (opcional, según el nivel)
    clickBtn.className = 'click-btn';
    if (state.clicks >= 10) clickBtn.classList.add('stage-10');
    if (state.clicks >= 20) clickBtn.classList.add('stage-20');
    if (state.clicks >= 40) clickBtn.classList.add('stage-40');
}

// === CUANDO SE PRESIONA EL BOTÓN ===
clickBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // Evita selecciones raras de texto en móvil

    // Pone la imagen presionada
    btnImage.src = nivelActual.presionada;

    // Suena el juguete
    squeakSound.currentTime = 0;
    squeakSound.play().catch(error => { });

    // Suma 1 al contador
    state.clicks += 1;
    actualizarUI(); // Actualiza el número en pantalla

    // Evaluamos si con este clic subimos de nivel (para que la próxima vez que suelte ya sea la nueva)
    nivelActual = obtenerNivel(state.clicks);
});

// === CUANDO SE SUELTA EL BOTÓN ===
clickBtn.addEventListener('pointerup', () => {
    // Vuelve a poner la imagen normal (que será la del nuevo nivel si es que subió)
    btnImage.src = nivelActual.normal;
});

// Si el ratón sale del botón sin soltar (ej. arrastras hacia afuera), volvemos a la normal
clickBtn.addEventListener('pointerleave', () => {
    btnImage.src = nivelActual.normal;
});

// Iniciar el juego con la primera imagen
btnImage.src = nivelActual.normal;
actualizarUI();