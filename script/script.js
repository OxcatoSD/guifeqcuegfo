window.addEventListener('load', () => {

    const scoreEl = document.getElementById('score');
    const clickBtn = document.getElementById('clickBtn');
    const btnImage = document.getElementById('btnImage');
    const squeakSound = document.getElementById('dogToySound');
    const leaderboardList = document.getElementById('leaderboard-list');

    const pantallaInicio = document.getElementById('pantalla-inicio');
    const inputNombre = document.getElementById('input-nombre');
    const btnEmpezar = document.getElementById('btn-empezar');

    squeakSound.volume = 0.4;

    const state = { clicks: 0 };
    let playerName = "Anónimo";
    let juegoIniciado = false;

    // === LÓGICA DE LA TABLA ===
    function cargarTablaLocal() {
        if (!leaderboardList) return;

        let records = JSON.parse(localStorage.getItem('lux_records')) || [];

        // Forzar el orden de mayor a menor
        records.sort((a, b) => Number(b.puntos) - Number(a.puntos));

        leaderboardList.innerHTML = "";

        if (records.length === 0) {
            leaderboardList.innerHTML = "<li>Sin récords aún</li>";
            return;
        }

        records.forEach(record => {
            const li = document.createElement("li");
            li.textContent = `${record.nombre}: ${record.puntos}`;
            leaderboardList.appendChild(li);
        });
    }

    // === PROCESAR LA SESIÓN ANTERIOR (SE EJECUTA AL CARGAR LA PÁGINA) ===
    function procesarSesionAnterior() {
        try {
            let sesionGuardada = sessionStorage.getItem('lux_sesion_actual');

            if (sesionGuardada) {
                // Recuperamos los datos de la sesión pasada (clics y nombre de ESE momento)
                let datos = JSON.parse(sesionGuardada);

                // Si hizo más de 5 clics, lo guardamos en la tabla
                if (datos.puntos > 5) {
                    let records = JSON.parse(localStorage.getItem('lux_records')) || [];

                    records.push({
                        nombre: datos.nombre, // Usamos el nombre que estaba jugando, no el nuevo
                        puntos: Number(datos.puntos)
                    });

                    records.sort((a, b) => Number(b.puntos) - Number(a.puntos));
                    records = records.slice(0, 5); // Solo el Top 5

                    localStorage.setItem('lux_records', JSON.stringify(records));
                }

                // Limpiamos la sesión para que la nueva partida empiece de cero
                sessionStorage.removeItem('lux_sesion_actual');
            }

            // Dibujamos la tabla actualizada
            cargarTablaLocal();
        } catch (e) {
            console.warn("Error al procesar sesión");
        }
    }

    // EJECUTAMOS ESTO DE INMEDIATO AL CARGAR LA PÁGINA
    procesarSesionAnterior();

    // === PANTALLA DE INICIO ===
    btnEmpezar.addEventListener('click', () => {
        let nombreEscrito = inputNombre.value.trim();
        if (nombreEscrito === "") {
            playerName = "Anónimo";
        } else {
            playerName = nombreEscrito.substring(0, 12);
        }

        pantallaInicio.style.display = 'none';
        juegoIniciado = true;
        actualizarUI();
    });

    // === LÓGICA DEL JUEGO ===
    const niveles = [
        { limite: 0, normal: 'img/IMG-20261018-WA0030.jpg', presionada: 'img/IMG-20261018-WA0031.jpg' },
        { limite: 50, normal: 'img/IMG-20261018-WA0032.jpg', presionada: 'img/IMG-20261018-WA0033.jpg' },
        { limite: 100, normal: 'img/IMG-20261018-WA0034.jpg', presionada: 'img/IMG-20261018-WA0035.jpg' },
        { limite: 160, normal: 'img/IMG-20261018-WA0036.jpg', presionada: 'img/IMG-20261018-WA0037.jpg' }
    ];

    let nivelActual = niveles[0];

    function obtenerNivel(clicks) {
        let nivel = niveles[0];
        for (let i = 0; i < niveles.length; i++) {
            if (clicks >= niveles[i].limite) nivel = niveles[i];
        }
        return nivel;
    }

    function actualizarUI() {
        scoreEl.textContent = Math.floor(state.clicks);
        nivelActual = obtenerNivel(state.clicks);

        clickBtn.className = 'click-btn';
        if (state.clicks >= 50) clickBtn.classList.add('stage-50');
        if (state.clicks >= 100) clickBtn.classList.add('stage-100');
        if (state.clicks >= 160) clickBtn.classList.add('stage-160');
        if (state.clicks >= 200) clickBtn.classList.add('stage-200');
        if (state.clicks >= 280) clickBtn.classList.add('stage-280');
        if (state.clicks >= 340) clickBtn.classList.add('stage-340');
        if (state.clicks >= 500) clickBtn.classList.add('stage-500');
    }

    // === ACCIONES DEL BOTÓN ===
    clickBtn.addEventListener('pointerdown', (e) => {
        if (!juegoIniciado) return;
        e.preventDefault();

        btnImage.src = nivelActual.presionada;
        squeakSound.currentTime = 0;
        squeakSound.play().catch(error => { });

        state.clicks += 1;

        try {
            // ¡AQUÍ ESTÁ EL TRUCO! Guardamos el nombre actual junto con los clics
            sessionStorage.setItem('lux_sesion_actual', JSON.stringify({
                nombre: playerName,
                puntos: state.clicks
            }));
        } catch (e) { }

        actualizarUI();
        nivelActual = obtenerNivel(state.clicks);
    });

    clickBtn.addEventListener('pointerup', () => {
        if (!juegoIniciado) return;
        btnImage.src = nivelActual.normal;
    });

    clickBtn.addEventListener('pointerleave', () => {
        if (!juegoIniciado) return;
        btnImage.src = nivelActual.normal;
    });

    // === INICIAR ===
    btnImage.src = nivelActual.normal;
    actualizarUI();
});