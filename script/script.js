window.addEventListener('load', () => {

    // === REFERENCIAS DEL DOM ===
    const scoreEl = document.getElementById('score');
    const clickBtn = document.getElementById('clickBtn');
    const btnImage = document.getElementById('btnImage');
    const squeakSound = document.getElementById('dogToySound');
    const leaderboardList = document.getElementById('leaderboard-list');
    const fondoDiv = document.getElementById('fondo');
    const scoreLabel = document.querySelector('.score-label');

    const pantallaInicio = document.getElementById('pantalla-inicio');
    const inputNombre = document.getElementById('input-nombre');
    const btnEmpezar = document.getElementById('btn-empezar');

    squeakSound.volume = 0.4;

    // === ESTADO DEL JUEGO ===
    const state = { clicks: 0 };
    let playerName = "Anónimo";
    let juegoIniciado = false;

    // === LÓGICA DE LA TABLA (A PRUEBA DE BUGS) ===
    function cargarTablaLocal() {
        if (!leaderboardList) return;

        try {
            let records = JSON.parse(localStorage.getItem('lux_records')) || [];

            // Filtro de seguridad: solo aceptar registros que tengan nombre y puntos válidos
            records = records.filter(r => r && r.nombre && !isNaN(r.puntos));

            // Ordenar de mayor a menor forzando que se trate como números
            records.sort((a, b) => Number(b.puntos) - Number(a.puntos));

            // Cortar a solo los 5 mejores (por si acaso hay más guardados)
            records = records.slice(0, 5);

            leaderboardList.innerHTML = "";

            if (records.length === 0) {
                leaderboardList.innerHTML = "<li>Sin récords</li>";
                return;
            }

            records.forEach(record => {
                const li = document.createElement("li");
                // Si el nombre tiene "Cheat", le ponemos un emoji
                let displayName = record.nombre.includes("Cheat") ? "🛠️ " + record.nombre.replace(" (Cheat)", "") : record.nombre;
                li.textContent = `${displayName}: ${record.puntos}`;
                leaderboardList.appendChild(li);
            });
        } catch (e) {
            console.warn("Error al leer la tabla, limpiando memoria...");
            localStorage.removeItem('lux_records');
        }
    }

    // === PROCESAR LA SESIÓN ANTERIOR ===
    function procesarSesionAnterior() {
        try {
            let sesionGuardada = sessionStorage.getItem('lux_sesion_actual');
            if (sesionGuardada) {
                let datos = JSON.parse(sesionGuardada);

                // Solo guardamos si hizo más de 5 clics
                if (datos && datos.puntos > 5) {
                    let records = JSON.parse(localStorage.getItem('lux_records')) || [];
                    records.push({
                        nombre: String(datos.nombre),
                        puntos: Number(datos.puntos)
                    });

                    records.sort((a, b) => Number(b.puntos) - Number(a.puntos));
                    records = records.slice(0, 5);

                    localStorage.setItem('lux_records', JSON.stringify(records));
                }
                sessionStorage.removeItem('lux_sesion_actual');
            }
            cargarTablaLocal();
        } catch (e) {
            console.warn("Error al procesar la sesión");
        }
    }

    procesarSesionAnterior();

    // === BOTÓN DE LA PANTALLA DE INICIO ===
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

    // ==========================================
    // 🛠️ SISTEMA DE TRAMPAS
    // ==========================================
    function abrirMenuTrampas() {
        if (!juegoIniciado) return;

        let codigo = prompt("🔐 MODO TRAMPAS\n\nEscribe:\n- Un número (ej. 1500)\n- 'max' (9999 clics)\n- 'reset' (Volver a 0)");

        if (codigo === null) return;
        codigo = codigo.toLowerCase().trim();

        if (codigo === 'max') {
            state.clicks = 9999;
        } else if (codigo === 'reset') {
            state.clicks = 0;
        } else if (!isNaN(codigo) && codigo !== "") {
            state.clicks = parseInt(codigo);
        } else {
            alert("Código no válido.");
            return;
        }

        // Guardamos la trampa en la sesión para que se registre en la tabla (con el nombre y Cheat)
        try {
            sessionStorage.setItem('lux_sesion_actual', JSON.stringify({
                nombre: playerName + " (Cheat)",
                puntos: state.clicks
            }));
        } catch (e) { }

        // Actualizamos la UI
        actualizarUI();
    }

    // Atajo PC: Escribir "cheat"
    let bufferTeclas = "";
    window.addEventListener('keydown', (e) => {
        bufferTeclas += e.key.toLowerCase();
        if (bufferTeclas.includes("cheat")) {
            bufferTeclas = "";
            abrirMenuTrampas();
        }
        if (bufferTeclas.length > 10) bufferTeclas = bufferTeclas.slice(1);
    });

    // Atajo Celular: Tocar 3 veces "Pat-pats:"
    let toquesSeguidos = 0;
    let temporizadorToques;
    scoreLabel.addEventListener('click', () => {
        toquesSeguidos++;
        clearTimeout(temporizadorToques);

        if (toquesSeguidos >= 3) {
            toquesSeguidos = 0;
            abrirMenuTrampas();
        } else {
            temporizadorToques = setTimeout(() => {
                toquesSeguidos = 0;
            }, 800);
        }
    });
    // ==========================================

    // === LÓGICA DEL JUEGO Y LOS FONDOS ===
    const niveles = [
        { limite: 0, normal: 'img/IMG-20261018-WA0030.jpg', presionada: 'img/IMG-20261018-WA0031.jpg' },
        { limite: 300, normal: 'img/IMG-20261018-WA0032.jpg', presionada: 'img/IMG-20261018-WA0033.jpg' },
        { limite: 700, normal: 'img/IMG-20261018-WA0034.jpg', presionada: 'img/IMG-20261018-WA0035.jpg' },
        { limite: 1100, normal: 'img/IMG-20261018-WA0036.jpg', presionada: 'img/IMG-20261018-WA0037.jpg' }
    ];

    const fondos = [
        { limite: 0, ruta: 'img/background/IMG-20261019-WA0003.jpg' },
        { limite: 300, ruta: 'img/background/IMG-20261019-WA0004.jpg' },
        { limite: 700, ruta: 'img/background/IMG-20261019-WA0005.jpg' },
        { limite: 1100, ruta: 'img/background/IMG-20261019-WA0006.jpg' },
        { limite: 1500, ruta: 'img/background/IMG-20261019-WA0007.jpg' }
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

        // 1. Actualizar brillo del botón
        clickBtn.className = 'click-btn';
        if (state.clicks >= 300) clickBtn.classList.add('stage-300');
        if (state.clicks >= 700) clickBtn.classList.add('stage-700');
        if (state.clicks >= 1100) clickBtn.classList.add('stage-1100');
        if (state.clicks >= 1500) clickBtn.classList.add('stage-1500');

        // 2. Actualizar la imagen de fondo
        let fondoActual = fondos[0];
        for (let i = 0; i < fondos.length; i++) {
            if (state.clicks >= fondos[i].limite) {
                fondoActual = fondos[i];
            }
        }

        if (fondoDiv.style.backgroundImage !== `url("${fondoActual.ruta}")`) {
            fondoDiv.style.backgroundImage = `url('${fondoActual.ruta}')`;
        }
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