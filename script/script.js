window.addEventListener("load", () => {
  // === REFERENCIAS DEL DOM ===
  const scoreEl = document.getElementById("score");
  const clickBtn = document.getElementById("clickBtn");
  const btnImage = document.getElementById("btnImage");
  const squeakSound = document.getElementById("dogToySound");
  const metalSound = document.getElementById("crakckedSound");
  const rockSound = document.getElementById("rockSound");
  const leaderboardList = document.getElementById("leaderboard-list");
  const fondoDiv = document.getElementById("fondo");
  const scoreLabel = document.querySelector(".score-label");
  const sideImage = document.getElementById("sideImage");
  const missionList = document.getElementById("mission-list");

  const elementosUI = [
    document.querySelector("h1"),
    document.querySelector(".score-container"),
    document.querySelector(".leaderboard"),
    document.querySelector("#mission-bar"),
  ];

  const glitchOverlay = document.getElementById("glitch-overlay");
  const tituloH1 = document.querySelector("h1");

  const btnToggleLeaderboard = document.getElementById("btnToggleLeaderboard");
  const leaderboardPanel = document.getElementById("leaderboardPanel");

  const pantallaInicio = document.getElementById("pantalla-inicio");
  const inputNombre = document.getElementById("input-nombre");
  const btnEmpezar = document.getElementById("btn-empezar");

  squeakSound.volume = 0.4;
  metalSound.volume = 1.0;
  rockSound.volume = 1.0;

  // ==========================================
  // 🎵 SONIDO GRUESO Y EFECTO GLITCH CAÓTICO
  // ==========================================
  function playThickMetalSound() {
    metalSound.currentTime = 0;
    metalSound.playbackRate = 0.7;
    metalSound.play().catch((e) => console.log("Audio bloqueado"));
  }

  function triggerGlitch() {
    glitchOverlay.classList.add("active");
    fondoDiv.classList.add("bg-roto");
    tituloH1.classList.add("glitch-text");

    elementosUI.forEach((el) => {
      el.style.transition = "none";
      const randX = (Math.random() - 0.5) * 300;
      const randY = (Math.random() - 0.5) * 300;
      const randRot = (Math.random() - 0.5) * 45;
      el.style.transform = `translate(${randX}px, ${randY}px) rotate(${randRot}deg)`;
    });

    setTimeout(() => {
      glitchOverlay.classList.remove("active");
      tituloH1.classList.remove("glitch-text");

      elementosUI.forEach((el) => {
        el.style.transition = "none";
        el.style.transform = "";
      });
    }, 800);
  }

  // === ESTADO DEL JUEGO ===
  const state = { clicks: 0 };
  let playerName = "Anónimo";
  let juegoIniciado = false;

  // === ESTADOS DEL MINI HUPIBOT ===
  let temporizadorInactividad;
  let ultimoClicTiempo = Date.now();
  let clicsRapidos = 0;
  let temporizadorEstadoMini;

  // === CONTADORES GLOBALES PARA LAS MISIONES ===
  let rockTotal = 0;
  let studyTotal = 0;
  let clicsRapidosTotales = 0;

  const imagenesMini = {
    idle: "img/minihupibot/idle.png",
    relaxing: "img/minihupibot/relaxing.png",
    study: "img/minihupibot/study.png",
    rock: "img/minihupibot/rock.png",
  };

  Object.values(imagenesMini).forEach((ruta) => {
    const img = new Image();
    img.src = ruta;
  });

  btnToggleLeaderboard.addEventListener("click", () => {
    leaderboardPanel.classList.toggle("show");
  });

  // ==========================================
  // SISTEMA DE MISIONES PROGRESIVO (12 MISIONES)
  // ==========================================
  const nivelesClicks = [0, 300, 700, 1100, 1500];

  let misiones = [
    // Nivel 0 (0 - 299)
    {
      id: "m_fast10",
      texto: "Da 10 clics rápidos",
      meta: 10,
      actual: 0,
      completada: false,
      nivelRequerido: 0,
      requiereHupi: false,
    },
    {
      id: "m_rock1",
      texto: "Haz rockear a Hupi",
      meta: 1,
      actual: 0,
      completada: false,
      nivelRequerido: 0,
      requiereHupi: true,
    }, // Aparece a los 29 clics

    // Nivel 1 (300 - 699)
    {
      id: "m_study1",
      texto: "Haz estudiar a Hupi",
      meta: 1,
      actual: 0,
      completada: false,
      nivelRequerido: 1,
      requiereHupi: true,
    },
    {
      id: "m_fast50",
      texto: "Da 50 clics rápidos",
      meta: 50,
      actual: 0,
      completada: false,
      nivelRequerido: 1,
      requiereHupi: false,
    },
    {
      id: "m_rock3",
      texto: "Haz rockear a Hupi 3 veces",
      meta: 3,
      actual: 0,
      completada: false,
      nivelRequerido: 1,
      requiereHupi: true,
    },

    // Nivel 2 (700 - 1099)
    {
      id: "m_study3",
      texto: "Haz estudiar a Hupi 3 veces",
      meta: 3,
      actual: 0,
      completada: false,
      nivelRequerido: 2,
      requiereHupi: true,
    },
    {
      id: "m_fast150",
      texto: "Da 150 clics rápidos",
      meta: 150,
      actual: 0,
      completada: false,
      nivelRequerido: 2,
      requiereHupi: false,
    },
    {
      id: "m_rock6",
      texto: "Haz rockear a Hupi 6 veces",
      meta: 6,
      actual: 0,
      completada: false,
      nivelRequerido: 2,
      requiereHupi: true,
    },

    // Nivel 3 (1100 - 1499)
    {
      id: "m_study5",
      texto: "Haz estudiar a Hupi 5 veces",
      meta: 5,
      actual: 0,
      completada: false,
      nivelRequerido: 3,
      requiereHupi: true,
    },
    {
      id: "m_fast300",
      texto: "Da 300 clics rápidos",
      meta: 300,
      actual: 0,
      completada: false,
      nivelRequerido: 3,
      requiereHupi: false,
    },
    {
      id: "m_rock10",
      texto: "Haz rockear a Hupi 10 veces",
      meta: 10,
      actual: 0,
      completada: false,
      nivelRequerido: 3,
      requiereHupi: true,
    },

    // Nivel 4 (1500+)
    {
      id: "m_max",
      texto: "Alcanza el Nivel Máximo",
      meta: 1500,
      actual: 0,
      completada: false,
      nivelRequerido: 4,
      requiereHupi: false,
    },
  ];

  function obtenerIndiceNivel(clicks) {
    let index = 0;
    for (let i = 0; i < nivelesClicks.length; i++) {
      if (clicks >= nivelesClicks[i]) index = i;
    }
    return index;
  }

  function renderMisiones() {
    missionList.innerHTML = "";
    let nivelActualIndex = obtenerIndiceNivel(state.clicks);

    // 1. MISIÓN PRINCIPAL (Siempre visible)
    let sigNivelIndex = nivelActualIndex + 1;
    let misionPrincipalHtml = "";

    if (sigNivelIndex < nivelesClicks.length) {
      let metaSiguiente = nivelesClicks[sigNivelIndex];
      let faltantes = metaSiguiente - state.clicks;
      let porcentaje =
        ((state.clicks - nivelesClicks[nivelActualIndex]) /
          (metaSiguiente - nivelesClicks[nivelActualIndex])) *
        100;

      misionPrincipalHtml = `
                <div class="mission-item" style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
                    <div class="mission-header">
                        <span>⭐ Nivel ${sigNivelIndex + 1}</span>
                        <span>Faltan ${faltantes}</span>
                    </div>
                    <div class="mission-bar-bg">
                        <div class="mission-bar-fill" style="width: ${porcentaje}%; background: #ffcc00;"></div>
                    </div>
                </div>
            `;
    } else {
      misionPrincipalHtml = `
                <div class="mission-item" style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
                    <div class="mission-header" style="color: #ffcc00;">
                        <span>⭐ Nivel Máximo Alcanzado</span>
                    </div>
                </div>
            `;
    }

    // 2. MISIONES SECUNDARIAS (Filtramos por nivel y por visibilidad de Hupi)
    let secundariasActivas = misiones
      .filter((m) => {
        // Si la misión requiere a Hupi, solo se muestra si state.clicks >= 29
        let hupiVisible = !m.requiereHupi || state.clicks >= 29;
        return (
          !m.completada && m.nivelRequerido <= nivelActualIndex && hupiVisible
        );
      })
      .slice(0, 2);

    let htmlSecundarias = secundariasActivas
      .map((m) => {
        let faltantes = m.meta - m.actual;
        let porcentaje = Math.min((m.actual / m.meta) * 100, 100);
        let textoFaltante = faltantes === 1 ? `Falta 1` : `Faltan ${faltantes}`;

        return `
                <div class="mission-item">
                    <div class="mission-header">
                        <span>${m.texto}</span>
                        <span>${textoFaltante}</span>
                    </div>
                    <div class="mission-bar-bg">
                        <div class="mission-bar-fill" style="width: ${porcentaje}%"></div>
                    </div>
                </div>
            `;
      })
      .join("");

    missionList.innerHTML = misionPrincipalHtml + htmlSecundarias;
  }

  function actualizarMisiones() {
    misiones.forEach((m) => {
      if (m.id.includes("rock")) m.actual = rockTotal;
      if (m.id.includes("study")) m.actual = studyTotal;
      if (m.id.includes("fast")) m.actual = clicsRapidosTotales;
      if (m.id === "m_max") m.actual = state.clicks;

      if (!m.completada && m.actual >= m.meta) {
        m.completada = true;
      }
    });

    renderMisiones();
  }

  // === LÓGICA DEL MINI HUPIBOT ===
  function cambiarEstadoMiniHupi(estado, duracion = 0) {
    if (sideImage.src.includes(estado)) return;
    sideImage.src = imagenesMini[estado];

    if (estado === "relaxing") {
      sideImage.classList.add("estado-relaxing");
    } else {
      sideImage.classList.remove("estado-relaxing");
    }

    clearTimeout(temporizadorEstadoMini);
    if (duracion > 0) {
      temporizadorEstadoMini = setTimeout(() => {
        cambiarEstadoMiniHupi("idle");
      }, duracion);
    }
  }

  function resetearInactividad() {
    clearTimeout(temporizadorInactividad);
    // 120000 ms = 2 minutos exactos
    temporizadorInactividad = setTimeout(() => {
      if (juegoIniciado) cambiarEstadoMiniHupi("relaxing");
    }, 120000);
  }

  sideImage.addEventListener("click", (e) => {
    e.preventDefault();
    if (!juegoIniciado) return;

    cambiarEstadoMiniHupi("rock", 6000);
    rockSound.currentTime = 0;
    rockSound.play().catch((err) => {});

    rockTotal++;
    actualizarMisiones();
    resetearInactividad();
  });

  // === LÓGICA DE LA TABLA ===
  function cargarTablaLocal() {
    if (!leaderboardList) return;
    try {
      let records = JSON.parse(localStorage.getItem("lux_records")) || [];
      records = records.filter((r) => r && r.nombre && !isNaN(r.puntos));
      records.sort((a, b) => Number(b.puntos) - Number(a.puntos));
      records = records.slice(0, 5);
      leaderboardList.innerHTML = "";

      if (records.length === 0) {
        leaderboardList.innerHTML = "<li>Sin récords</li>";
        return;
      }

      records.forEach((record) => {
        const li = document.createElement("li");
        let displayName = record.nombre.includes("Cheat")
          ? "🛠️ " + record.nombre.replace(" (Cheat)", "")
          : record.nombre;
        li.textContent = `${displayName}: ${record.puntos}`;
        leaderboardList.appendChild(li);
      });
    } catch (e) {
      localStorage.removeItem("lux_records");
    }
  }

  function procesarSesionAnterior() {
    try {
      let sesionGuardada = sessionStorage.getItem("lux_sesion_actual");
      if (sesionGuardada) {
        let datos = JSON.parse(sesionGuardada);
        if (datos && datos.puntos > 5) {
          let records = JSON.parse(localStorage.getItem("lux_records")) || [];
          records.push({
            nombre: String(datos.nombre),
            puntos: Number(datos.puntos),
          });
          records.sort((a, b) => Number(b.puntos) - Number(a.puntos));
          records = records.slice(0, 5);
          localStorage.setItem("lux_records", JSON.stringify(records));
        }
        sessionStorage.removeItem("lux_sesion_actual");
      }
      cargarTablaLocal();
    } catch (e) {}
  }

  procesarSesionAnterior();

  btnEmpezar.addEventListener("click", () => {
    let nombreEscrito = inputNombre.value.trim();
    playerName =
      nombreEscrito === "" ? "Anónimo" : nombreEscrito.substring(0, 12);
    pantallaInicio.style.display = "none";
    juegoIniciado = true;
    actualizarUI();
    resetearInactividad();
    renderMisiones();
  });

  function abrirMenuTrampas() {
    if (!juegoIniciado) return;
    let codigo = prompt(
      "🔐 MODO TRAMPAS\n\nEscribe:\n- Un número (ej. 1500)\n- 'max' (9999 clics)\n- 'reset' (Volver a 0)",
    );
    if (codigo === null) return;
    codigo = codigo.toLowerCase().trim();

    let limiteAnterior = nivelActual.limite;

    if (codigo === "max") state.clicks = 9999;
    else if (codigo === "reset") {
      state.clicks = 0;
      rockTotal = 0;
      studyTotal = 0;
      clicsRapidosTotales = 0;
      misiones.forEach((m) => {
        m.completada = false;
        m.actual = 0;
      });
    } else if (!isNaN(codigo) && codigo !== "") state.clicks = parseInt(codigo);
    else {
      alert("Código no válido.");
      return;
    }

    nivelActual = obtenerNivel(state.clicks);
    if (nivelActual.limite > limiteAnterior) {
      playThickMetalSound();
      triggerGlitch();
    }

    try {
      sessionStorage.setItem(
        "lux_sesion_actual",
        JSON.stringify({
          nombre: playerName + " (Cheat)",
          puntos: state.clicks,
        }),
      );
    } catch (e) {}

    actualizarUI();
    actualizarMisiones();
  }

  let bufferTeclas = "";
  window.addEventListener("keydown", (e) => {
    bufferTeclas += e.key.toLowerCase();
    if (bufferTeclas.includes("cheat")) {
      bufferTeclas = "";
      abrirMenuTrampas();
    }
    if (bufferTeclas.length > 10) bufferTeclas = bufferTeclas.slice(1);
  });

  let toquesSeguidos = 0;
  let temporizadorToques;
  scoreLabel.addEventListener("click", () => {
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

  const niveles = [
    {
      limite: 0,
      normal: "img/IMG-20261018-WA0030.jpg",
      presionada: "img/IMG-20261018-WA0031.jpg",
    },
    {
      limite: 300,
      normal: "img/IMG-20261018-WA0032.jpg",
      presionada: "img/IMG-20261018-WA0033.jpg",
    },
    {
      limite: 700,
      normal: "img/IMG-20261018-WA0034.jpg",
      presionada: "img/IMG-20261018-WA0035.jpg",
    },
    {
      limite: 1100,
      normal: "img/IMG-20261018-WA0036.jpg",
      presionada: "img/IMG-20261018-WA0037.jpg",
    },
  ];

  const fondos = [
    { limite: 0, ruta: "img/background/IMG-20261019-WA0003.jpg" },
    { limite: 300, ruta: "img/background/IMG-20261019-WA0004.jpg" },
    { limite: 700, ruta: "img/background/IMG-20261019-WA0005.jpg" },
    { limite: 1100, ruta: "img/background/IMG-20261019-WA0006.jpg" },
    { limite: 1500, ruta: "img/background/IMG-20261019-WA0007.jpg" },
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

    clickBtn.className = "click-btn";
    if (state.clicks >= 300) clickBtn.classList.add("stage-300");
    if (state.clicks >= 700) clickBtn.classList.add("stage-700");
    if (state.clicks >= 1100) clickBtn.classList.add("stage-1100");
    if (state.clicks >= 1500) clickBtn.classList.add("stage-1500");

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
      if (
        sideImage.style.display === "none" ||
        sideImage.style.display === ""
      ) {
        sideImage.style.display = "block";
      }
    } else {
      sideImage.style.display = "none";
    }
  }

  function mostrarFlotante(x, y) {
    const div = document.createElement("div");
    div.className = "floating-text";
    div.textContent = "+1";
    div.style.left = x + "px";
    div.style.top = y + "px";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 800);
  }

  clickBtn.addEventListener("pointerdown", (e) => {
    if (!juegoIniciado) return;
    e.preventDefault();

    mostrarFlotante(e.clientX, e.clientY);
    resetearInactividad();

    let ahora = Date.now();
    let esRapido = ahora - ultimoClicTiempo < 300;

    if (esRapido) {
      clicsRapidos++;
      clicsRapidosTotales++;
    } else {
      clicsRapidos = 1;
    }
    ultimoClicTiempo = ahora;

    if (clicsRapidos >= 10) {
      cambiarEstadoMiniHupi("study", 4000);
      studyTotal++;
      clicsRapidos = 0;
    } else if (
      !sideImage.src.includes("study") &&
      !sideImage.src.includes("rock")
    ) {
      cambiarEstadoMiniHupi("idle");
    }

    let limiteAnterior = nivelActual.limite;
    state.clicks += 1;
    nivelActual = obtenerNivel(state.clicks);

    if (nivelActual.limite > limiteAnterior) {
      playThickMetalSound();
      triggerGlitch();
    } else {
      squeakSound.currentTime = 0;
      squeakSound.play().catch((error) => {});
    }

    btnImage.src = nivelActual.presionada;

    try {
      sessionStorage.setItem(
        "lux_sesion_actual",
        JSON.stringify({
          nombre: playerName,
          puntos: state.clicks,
        }),
      );
    } catch (e) {}

    actualizarUI();
    actualizarMisiones();
  });

  clickBtn.addEventListener("pointerup", () => {
    if (!juegoIniciado) return;
    btnImage.src = nivelActual.normal;
  });

  clickBtn.addEventListener("pointerleave", () => {
    if (!juegoIniciado) return;
    btnImage.src = nivelActual.normal;
  });

  // === INICIAR ===
  btnImage.src = nivelActual.normal;
  actualizarUI();
});
