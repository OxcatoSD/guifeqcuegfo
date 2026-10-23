window.addEventListener('load', () => {

    // === REFERENCIAS DEL DOM ===
    const scoreEl = document.getElementById('score');
    const clickBtn = document.getElementById('clickBtn');
    const btnImage = document.getElementById('btnImage');
    const squeakSound = document.getElementById('dogToySound');
    const metalSound = document.getElementById('crakckedSound');
    const rockSound = document.getElementById('rockSound');
    const leaderboardList = document.getElementById('leaderboard-list');
    const fondoDiv = document.getElementById('fondo');
    const scoreLabel = document.querySelector('.score-label');
    const sideImage = document.getElementById('sideImage');
    const missionList = document.getElementById('mission-list');

    // Ref para el botón de la tabla en móviles
    const btnToggleLeaderboard = document.getElementById('btnToggleLeaderboard');
    const leaderboardPanel = document.getElementById('leaderboardPanel');

    const pantallaInicio = document.getElementById('pantalla-inicio');
    const inputNombre = document.getElementById('input-nombre');
    const btnEmpezar = document.getElementById('btn-empezar');

    squeakSound.volume = 0.4;
    metalSound.volume = 0.6;
    rockSound.volume = 1.0;

    // === ESTADO DEL JUEGO ===
    const state = { clicks: 0 };
    let playerName = "Anónimo";
    let juegoIniciado = false;

    // === ESTADOS DEL MINI HUPIBOT ===
    let temporizadorInactividad;
    let ultimoClicTiempo = Date.now();
    let clicsRapidos = 0;
    let temporizadorEstadoMini;

    const imagenesMini = {
        idle: 'img/minihupibot/idle.png',
        relaxing: 'img/minihupibot/relaxing.png',
        study: 'img/minihupibot/study.png',
        rock: 'img/minihupibot/rock.png'
    };

    Object.values(imagenesMini).forEach(ruta => {
        const img = new Image();
        img.src = ruta;
    });

    // === TOGGLE TABLA EN MÓVILES ===
    btnToggleLeaderboard.addEventListener('click', () => {
        leaderboardPanel.classList.toggle('show');
    });

    // === SISTEMA DE MISIONES ===
    let misiones = [
        { id: 'm1', texto: 'Da 50 pat-pats', meta: 50, actual: 0, completada: false },
        { id: 'm2', texto: 'Llega a 300 pat-pats', meta: 300, actual: 0, completada: false },
        { id: 'm3', texto: 'Haz rockear a Hupi', meta: 1, actual: 0, completada: false }
    ];

    function renderMisiones() {
        missionList.innerHTML = '';
        let activas = misiones.filter(m => !m.completada).slice(0, 2);

        if (activas.length === 0) {
            missionList.innerHTML = '<div class="mission-item completada" style="text-align:center;">¡Todo completado!</div>';
            return;
        }

        activas.forEach(m => {
            let porcentaje = Math.min((m.actual / m.meta) * 100, 100);
            missionList.innerHTML += `
                <div class="mission-item">
                    <div class="mission-header">
                        <span>${m.texto}</span>
                        <span>${m.actual}/${m.meta}</span>
                    </div>
                    <div class="mission-bar-bg">
                        <div class="mission-bar-fill" style="width: ${porcentaje}%"></div>
                    </div>
                </div>
            `;
        });
    }

    function actualizarMisiones() {
        misiones[0].actual = state.clicks;
        misiones[1].actual = state.clicks;

        misiones.forEach(m => {
            if (!m.completada && m.actual >= m.meta) {
                m.completada = true;
            }
        });
        renderMisiones();
    }

    // ==========================================
    // LÓGICA DE LAS IMÁGENES DEL MINI HUPIBOT
    // ==========================================
    function cambiarEstadoMiniHupi(estado, duracion = 0) {
        if (sideImage.src.includes(estado)) return;

        sideImage.src = imagenesMini[estado];

        if (estado === 'relaxing') {
            sideImage.classList.add('estado-relaxing');
        } else {
            sideImage.classList.remove('estado-relaxing');
        }

        clearTimeout(temporizadorEstadoMini);
        if (duracion > 0) {
            temporizadorEstadoMini = setTimeout(() => {
                cambiarEstadoMiniHupi('idle');
            }, duracion);
        }
    }

    function resetearInactividad() {
        clearTimeout(temporizadorInactividad);
        temporizadorInactividad = setTimeout(() => {
            if (juegoIniciado) cambiarEstadoMiniHupi('relaxing');
        }, 5000);
    }

    sideImage.addEventListener('click', (e) => {
        e.preventDefault();
        if (!juegoIniciado) return;

        cambiarEstadoMiniHupi('rock', 6000);

        rockSound.currentTime = 0;
        rockSound.play().catch(err => { });

        misiones[2].actual = 1;
        actualizarMisiones();

        resetearInactividad();
    });

    // === LÓGICA DE LA TABLA ===
    function cargarTablaLocal() {
        if (!leaderboardList) return;
        try {
            let records = JSON.parse(localStorage.getItem('lux_records')) || [];
            records = records.filter(r => r && r.nombre && !isNaN(r.puntos));
            records.sort((a, b) => Number(b.puntos) - Number(a.puntos));
            records = records.slice(0, 5);
            leaderboardList.innerHTML = "";

            if (records.length === 0) {
                leaderboardList.innerHTML = "<li>Sin récords</li>";
                return;
            }

            records.forEach(record => {
                const li = document.createElement("li");
                let displayName = record.nombre.includes("Cheat") ? "🛠️ " + record.nombre.replace(" (Cheat)", "") : record.nombre;
                li.textContent = `${displayName}: ${record.puntos}`;
                leaderboardList.appendChild(li);
            });
        } catch (e) {
            localStorage.removeItem('lux_records');
        }
    }

    function procesarSesionAnterior() {
        try {
            let sesionGuardada = sessionStorage.getItem('lux_sesion_actual');
            if (sesionGuardada) {
                let datos = JSON.parse(sesionGuardada);
                if (datos && datos.puntos > 5) {
                    let records = JSON.parse(localStorage.getItem('lux_records')) || [];
                    records.push({ nombre: String(datos.nombre), puntos: Number(datos.puntos) });
                    records.sort((a, b) => Number(b.puntos) - Number(a.puntos));
                    records = records.slice(0, 5);
                    localStorage.setItem('lux_records', JSON.stringify(records));
                }
                sessionStorage.removeItem('lux_sesion_actual');
            }
            cargarTablaLocal();
        } catch (e) { }
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
        resetearInactividad();
        renderMisiones();
    });

    // ==========================================
    // 🛠️ SISTEMA DE TRAMPAS
    // ==========================================
    function abrirMenuTrampas() {
        if (!juegoIniciado) return;
        let codigo = prompt("🔐 MODO TRAMPAS\n\nEscribe:\n- Un número (ej. 1500)\n- 'max' (9999 clics)\n- 'reset' (Volver a 0)");
        if (codigo === null) return;
        codigo = codigo.toLowerCase().trim();

        let limiteAnterior = nivelActual.limite;

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

        nivelActual = obtenerNivel(state.clicks);
        if (nivelActual.limite > limiteAnterior) {
            metalSound.currentTime = 0;
            metalSound.play().catch(error => { });
        }

        try {
            sessionStorage.setItem('lux_sesion_actual', JSON.stringify({
                nombre: playerName + " (Cheat)",
                puntos: state.clicks
            }));
        } catch (e) { }

        actualizarUI();
        actualizarMisiones();
    }

    let bufferTeclas = "";
    window.addEventListener('keydown', (e) => {
        bufferTeclas += e.key.toLowerCase();
        if (bufferTeclas.includes("cheat")) {
            bufferTeclas = "";
            abrirMenuTrampas();
        }
        if (bufferTeclas.length > 10) bufferTeclas = bufferTeclas.slice(1);
    });

    let toquesSeguidos = 0;
    let temporizadorToques;
    scoreLabel.addEventListener('click', () => {
        toquesSeguidos++;
        clearTimeout(temporizadorToques);
        if (toquesSeguidos >= 3) {
            toquesSeguidos = 0;
            abrirMenuTrampas();
        } else {
            temporizadorToques = setTimeout(() => { toquesSeguidos = 0; }, 800);
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

        clickBtn.className = 'click-btn';
        if (state.clicks >= 300) clickBtn.classList.add('stage-300');
        if (state.clicks >= 700) clickBtn.classList.add('stage-700');
        if (state.clicks >= 1100) clickBtn.classList.add('stage-1100');
        if (state.clicks >= 1500) clickBtn.classList.add('stage-1500');

        let fondoActual = fondos[0];
        for (let i = 0; i < fondos.length; i++) {
            if (state.clicks >= fondos[i].limite) {
                fondoActual = fondos[i];
            }
        }
        if (fondoDiv.style.backgroundImage !== `url("${fondoActual.ruta}")`) {
            fondoDiv.style.backgroundImage = `url('${fondoActual.ruta}')`;
        }

        if (state.clicks >= 29) {
            if (sideImage.style.display === 'none' || sideImage.style.display === '') {
                sideImage.style.display = 'block';
            }
        } else {
            sideImage.style.display = 'none';
        }
    }

    function mostrarFlotante(x, y) {
        const div = document.createElement('div');
        div.className = 'floating-text';
        div.textContent = '+1';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 800);
    }

    // === ACCIONES DEL BOTÓN ===
    clickBtn.addEventListener('pointerdown', (e) => {
        if (!juegoIniciado) return;
        e.preventDefault();

        mostrarFlotante(e.clientX, e.clientY);
        resetearInactividad();

        let ahora = Date.now();
        if (ahora - ultimoClicTiempo < 300) {
            clicsRapidos++;
        } else {
            clicsRapidos = 1;
        }
        ultimoClicTiempo = ahora;

        if (clicsRapidos >= 10) {
            cambiarEstadoMiniHupi('study', 4000);
            clicsRapidos = 0;
        } else if (!sideImage.src.includes('study') && !sideImage.src.includes('rock')) {
            cambiarEstadoMiniHupi('idle');
        }

        let limiteAnterior = nivelActual.limite;
        state.clicks += 1;
        nivelActual = obtenerNivel(state.clicks);

        if (nivelActual.limite > limiteAnterior) {
            metalSound.currentTime = 0;
            metalSound.play().catch(error => { });
        } else {
            squeakSound.currentTime = 0;
            squeakSound.play().catch(error => { });
        }

        btnImage.src = nivelActual.presionada;

        try {
            sessionStorage.setItem('lux_sesion_actual', JSON.stringify({
                nombre: playerName,
                puntos: state.clicks
            }));
        } catch (e) { }

        actualizarUI();
        actualizarMisiones();
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