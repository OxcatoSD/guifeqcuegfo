window.addEventListener("load", () => {
  // ==========================================
  // 🥚 EASTER EGGS
  // ==========================================
  const probabilidadInicio = Math.floor(Math.random() * 1000) + 1;
  if (probabilidadInicio === 1) {
    const pantallaInicio = document.getElementById("pantalla-inicio");
    const tituloInicio = pantallaInicio.querySelector("h2");
    const textoInicio = pantallaInicio.querySelector("p");
    tituloInicio.textContent = "¿מן את?";
    tituloInicio.style.color = "#ff0000";
    tituloInicio.style.textShadow = "0 0 10px red, 0 0 20px darkred";
    pantallaInicio.style.backgroundImage =
      "url('img/background/IMG-20261019-WA0007.jpg')";
    pantallaInicio.style.backgroundSize = "cover";
    pantallaInicio.style.backgroundPosition = "center";
    pantallaInicio.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    textoInicio.textContent = "nombra tu alma...";
    textoInicio.style.color = "#ff3333";
  }

  const probabilidadJuego = Math.floor(Math.random() * 1000) + 1;
  let easterEggJuegoActivo = false;
  let clicsEasterEgg = 0;
  const imgEasterNormal = "img/hupiframes/easteregg1.jpg";
  const imgEasterPresionada = "img/hupiframes/easteregg2.jpg";
  if (probabilidadJuego === 1) easterEggJuegoActivo = true;

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

  const btnToggleLeaderboard = document.getElementById("btnToggleLeaderboard");
  const leaderboardPanel = document.getElementById("leaderboardPanel");
  const btnToggleInventory = document.getElementById("btnToggleInventory");
  const inventoryPanel = document.getElementById("inventoryPanel");

  const elementosUI = [
    document.querySelector("h1"),
    document.querySelector(".score-container"),
    leaderboardPanel,
    document.querySelector("#mission-bar"),
  ];
  const glitchOverlay = document.getElementById("glitch-overlay");
  const tituloH1 = document.querySelector("h1");

  const pantallaInicio = document.getElementById("pantalla-inicio");
  const inputNombre = document.getElementById("input-nombre");
  const btnEmpezar = document.getElementById("btn-empezar");

  squeakSound.volume = 0.4;
  metalSound.volume = 1.0;
  rockSound.volume = 1.0;

  // === FUNCIONES DE SONIDO Y GLITCH ===
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
      el.style.transform = `translate(${(Math.random() - 0.5) * 300}px, ${(Math.random() - 0.5) * 300}px) rotate(${(Math.random() - 0.5) * 45}deg)`;
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

  // === DETECTOR DE AUTOCLICKER ===
  let historialTiempos = [];
  let bloqueadoPorAutoclicker = false;
  function esAutoclicker() {
    const ahora = performance.now();
    historialTiempos.push(ahora);
    if (historialTiempos.length > 10) historialTiempos.shift();
    if (historialTiempos.length === 10) {
      let difs = [];
      for (let i = 1; i < historialTiempos.length; i++)
        difs.push(historialTiempos[i] - historialTiempos[i - 1]);
      if (Math.max(...difs) - Math.min(...difs) < 3) return true;
    }
    return false;
  }

  // === ESTADO DEL JUEGO ===
  const state = { clicks: 0 };
  let playerName = "Anónimo";
  let juegoIniciado = false;
  let temporizadorInactividad;
  let ultimoClicTiempo = Date.now();
  let clicsRapidos = 0;
  let temporizadorEstadoMini;
  let rockTotal = 0,
    studyTotal = 0,
    clicsRapidosTotales = 0;

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

  // === EVENTOS DE LOS BOTONES MÓVILES ===
  btnToggleLeaderboard.addEventListener("click", () => {
    leaderboardPanel.classList.toggle("show");
    if (window.innerWidth <= 600) inventoryPanel.classList.remove("show");
  });

  btnToggleInventory.addEventListener("click", () => {
    inventoryPanel.classList.toggle("show");
    if (window.innerWidth <= 600) leaderboardPanel.classList.remove("show");
  });

  // === MISIONES ===
  const nivelesClicks = [
    0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100,
  ];
  let misiones = [
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
    },
    {
      id: "m_study1",
      texto: "Haz estudiar a Hupi",
      meta: 1,
      actual: 0,
      completada: false,
      nivelRequerido: 2,
      requiereHupi: true,
    },
    {
      id: "m_fast50",
      texto: "Da 50 clics rápidos",
      meta: 50,
      actual: 0,
      completada: false,
      nivelRequerido: 2,
      requiereHupi: false,
    },
    {
      id: "m_rock3",
      texto: "Haz rockear a Hupi 3 veces",
      meta: 3,
      actual: 0,
      completada: false,
      nivelRequerido: 3,
      requiereHupi: true,
    },
    {
      id: "m_study3",
      texto: "Haz estudiar a Hupi 3 veces",
      meta: 3,
      actual: 0,
      completada: false,
      nivelRequerido: 5,
      requiereHupi: true,
    },
    {
      id: "m_fast150",
      texto: "Da 150 clics rápidos",
      meta: 150,
      actual: 0,
      completada: false,
      nivelRequerido: 5,
      requiereHupi: false,
    },
    {
      id: "m_rock6",
      texto: "Haz rockear a Hupi 6 veces",
      meta: 6,
      actual: 0,
      completada: false,
      nivelRequerido: 6,
      requiereHupi: true,
    },
    {
      id: "m_study5",
      texto: "Haz estudiar a Hupi 5 veces",
      meta: 5,
      actual: 0,
      completada: false,
      nivelRequerido: 8,
      requiereHupi: true,
    },
    {
      id: "m_fast300",
      texto: "Da 300 clics rápidos",
      meta: 300,
      actual: 0,
      completada: false,
      nivelRequerido: 8,
      requiereHupi: false,
    },
    {
      id: "m_rock10",
      texto: "Haz rockear a Hupi 10 veces",
      meta: 10,
      actual: 0,
      completada: false,
      nivelRequerido: 9,
      requiereHupi: true,
    },
    {
      id: "m_max",
      texto: "Alcanza el Nivel Máximo",
      meta: 1100,
      actual: 0,
      completada: false,
      nivelRequerido: 11,
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
    let sigNivelIndex = nivelActualIndex + 1;
    let misionPrincipalHtml = "";

    if (sigNivelIndex < nivelesClicks.length) {
      let metaSiguiente = nivelesClicks[sigNivelIndex];
      let faltantes = metaSiguiente - state.clicks;
      let porcentaje =
        ((state.clicks - nivelesClicks[nivelActualIndex]) /
          (metaSiguiente - nivelesClicks[nivelActualIndex])) *
        100;
      let nombreMision =
        state.clicks >= 400
          ? "💖 Que sienta tu amor"
          : `⭐ Nivel ${sigNivelIndex + 1}`;
      misionPrincipalHtml = `
        <div class="mission-item" style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;">
            <div class="mission-header"><span>${nombreMision}</span><span>Faltan ${faltantes}</span></div>
            <div class="mission-bar-bg"><div class="mission-bar-fill" style="width: ${porcentaje}%; background: #ffcc00;"></div></div>
        </div>`;
    } else {
      misionPrincipalHtml = `<div class="mission-item" style="border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px;"><div class="mission-header" style="color: #ffcc00;"><span>💖 Nivel Máximo Alcanzado</span></div></div>`;
    }

    let secundariasActivas = misiones
      .filter((m) => {
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
        return `<div class="mission-item"><div class="mission-header"><span>${m.texto}</span><span>${faltantes === 1 ? "Falta 1" : "Faltan " + faltantes}</span></div><div class="mission-bar-bg"><div class="mission-bar-fill" style="width: ${porcentaje}%"></div></div></div>`;
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
      if (!m.completada && m.actual >= m.meta) m.completada = true;
    });
    renderMisiones();
  }

  // === LÓGICA DEL MINI HUPIBOT ===
  function cambiarEstadoMiniHupi(estado, duracion = 0) {
    if (sideImage.src.includes(estado)) return;
    sideImage.src = imagenesMini[estado];
    sideImage.classList.toggle("estado-relaxing", estado === "relaxing");
    clearTimeout(temporizadorEstadoMini);
    if (duracion > 0)
      temporizadorEstadoMini = setTimeout(
        () => cambiarEstadoMiniHupi("idle"),
        duracion,
      );
  }

  function resetearInactividad() {
    clearTimeout(temporizadorInactividad);
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
        li.textContent = `${record.nombre.includes("Cheat") ? "🛠️ " + record.nombre.replace(" (Cheat)", "") : record.nombre}: ${record.puntos}`;
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
          localStorage.setItem(
            "lux_records",
            JSON.stringify(records.slice(0, 5)),
          );
        }
        sessionStorage.removeItem("lux_sesion_actual");
      }
      cargarTablaLocal();
    } catch (e) {}
  }
  procesarSesionAnterior();

  btnEmpezar.addEventListener("click", () => {
    playerName =
      inputNombre.value.trim() === ""
        ? "Anónimo"
        : inputNombre.value.trim().substring(0, 12);
    pantallaInicio.style.display = "none";
    juegoIniciado = true;
    actualizarUI();
    resetearInactividad();
    renderMisiones();
  });

  // === MENÚ DE TRAMPAS ===
  function abrirMenuTrampas() {
    if (!juegoIniciado) return;
    let codigo = prompt(
      "🔐 MODO TRAMPAS\n\nEscribe:\n- Un número (ej. 500)\n- 'max' (1100 clics)\n- 'reset' (Volver a 0)",
    );
    if (codigo === null) return;
    codigo = codigo.toLowerCase().trim();
    let limiteAnterior = nivelActual.limite;

    if (codigo === "max") state.clicks = 1100;
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
    // Atajo para abrir la mochila en PC (Teclas 'B' o 'I')
    if (e.key.toLowerCase() === "b" || e.key.toLowerCase() === "i") {
      inventoryPanel.classList.toggle("show");
    }

    bufferTeclas += e.key.toLowerCase();
    if (bufferTeclas.includes("cheat")) {
      bufferTeclas = "";
      abrirMenuTrampas();
    }
    if (bufferTeclas.length > 10) bufferTeclas = bufferTeclas.slice(1);
  });

  let toquesSeguidos = 0,
    temporizadorToques;
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

  // === IMÁGENES Y FONDOS ===
  const niveles = [
    {
      limite: 0,
      normal: "img/hupiframes/hupi frames 1.png",
      presionada: "img/hupiframes/hupi frames 2.png",
    },
    {
      limite: 100,
      normal: "img/hupiframes/hupi frames 3.png",
      presionada: "img/hupiframes/hupi frames 4.png",
    },
    {
      limite: 200,
      normal: "img/hupiframes/hupi frames 5.png",
      presionada: "img/hupiframes/hupi frames 6.png",
    },
    {
      limite: 300,
      normal: "img/hupiframes/hupi frames 7.png",
      presionada: "img/hupiframes/hupi frames 8.png",
    },
    {
      limite: 400,
      normal: "img/hupiframes/hupi frames 9.png",
      presionada: "img/hupiframes/hupi frames 10.png",
    },
    {
      limite: 500,
      normal: "img/hupiframes/hupi frames 11.png",
      presionada: "img/hupiframes/hupi frames 12.png",
    },
    {
      limite: 600,
      normal: "img/hupiframes/hupi frames 13.png",
      presionada: "img/hupiframes/hupi frames 14.png",
    },
    {
      limite: 700,
      normal: "img/hupiframes/hupi frames 15.png",
      presionada: "img/hupiframes/hupi frames 16.png",
    },
    {
      limite: 800,
      normal: "img/hupiframes/hupi frames 17.png",
      presionada: "img/hupiframes/hupi frames 18.png",
    },
    {
      limite: 900,
      normal: "img/hupiframes/hupi frames 19.png",
      presionada: "img/hupiframes/hupi frames 20.png",
    },
    {
      limite: 1000,
      normal: "img/hupiframes/hupi frames 21.png",
      presionada: "img/hupiframes/hupi frames 22.png",
    },
    {
      limite: 1100,
      normal: "img/hupiframes/hupi frames 23.png",
      presionada: "img/hupiframes/hupi frames 24.png",
    },
  ];

  const fondos = [
    { limite: 0, ruta: "img/background/IMG-20261019-WA0003.jpg" },
    { limite: 100, ruta: "img/background/IMG-20261019-WA0004.jpg" },
    { limite: 200, ruta: "img/background/IMG-20261019-WA0005.jpg" },
    { limite: 300, ruta: "img/background/IMG-20261019-WA0006.jpg" },
    { limite: 400, ruta: "img/background/IMG-20261019-WA0007.jpg" },
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

    if (easterEggJuegoActivo) {
      tituloH1.textContent = "no quiero amar";
      tituloH1.style.color = "#ff0000";
      tituloH1.style.textShadow = "0 0 10px red, 0 0 20px darkred";
      fondoDiv.style.filter =
        "sepia(1) hue-rotate(-50deg) saturate(2) brightness(0.5)";
    } else {
      clickBtn.className = "click-btn";
      if (state.clicks < 500) {
        if (state.clicks >= 100) clickBtn.classList.add("stage-300");
        if (state.clicks >= 200) clickBtn.classList.add("stage-700");
        if (state.clicks >= 300) clickBtn.classList.add("stage-1100");
        if (state.clicks >= 400) clickBtn.classList.add("stage-1500");

        let fondoActual = fondos[0];
        for (let i = 0; i < fondos.length; i++) {
          if (state.clicks >= fondos[i].limite) fondoActual = fondos[i];
        }
        if (fondoDiv.style.backgroundImage !== `url("${fondoActual.ruta}")`)
          fondoDiv.style.backgroundImage = `url('${fondoActual.ruta}')`;
        fondoDiv.style.backgroundColor = "transparent";
      } else {
        clickBtn.classList.add("square-btn");
        fondoDiv.style.backgroundImage = "none";
        fondoDiv.style.backgroundColor = "#000000";
      }
    }

    if (state.clicks >= 29) {
      if (sideImage.style.display === "none" || sideImage.style.display === "")
        sideImage.style.display = "block";
    } else {
      sideImage.style.display = "none";
    }
  }

  function mostrarFlotante(x, y, texto = "+1", color = "#00ffff") {
    const div = document.createElement("div");
    div.className = "floating-text";
    div.textContent = texto;
    div.style.color = color;
    div.style.textShadow = `2px 2px 0 #000`;
    div.style.left = x + "px";
    div.style.top = y + "px";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 800);
  }

  clickBtn.addEventListener("pointerdown", (e) => {
    if (!juegoIniciado) return;
    e.preventDefault();

    if (easterEggJuegoActivo) {
      clicsEasterEgg++;
      if (clicsEasterEgg >= 6) {
        window.open("", "_self", "");
        window.close();
        setTimeout(() => {
          document.body.innerHTML =
            "<h1 style='color:white; font-family:sans-serif; text-align:center; margin-top:20%;'>El vacío te ha consumido.</h1>";
        }, 100);
        return;
      }
    }

    if (esAutoclicker()) {
      if (!bloqueadoPorAutoclicker) {
        bloqueadoPorAutoclicker = true;
        if (state.clicks >= 50) {
          state.clicks -= 50;
          mostrarFlotante(e.clientX, e.clientY, "-50", "#ff0000");
        } else {
          state.clicks = 0;
          mostrarFlotante(e.clientX, e.clientY, "¡BOT!", "#ff0000");
        }
        playThickMetalSound();
        triggerGlitch();
        actualizarUI();
        actualizarMisiones();
        setTimeout(() => {
          bloqueadoPorAutoclicker = false;
        }, 2000);
      }
      return;
    }

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

    if (easterEggJuegoActivo) btnImage.src = imgEasterPresionada;
    else btnImage.src = nivelActual.presionada;

    try {
      sessionStorage.setItem(
        "lux_sesion_actual",
        JSON.stringify({ nombre: playerName, puntos: state.clicks }),
      );
    } catch (e) {}
    actualizarUI();
    actualizarMisiones();
  });

  clickBtn.addEventListener("pointerup", () => {
    if (!juegoIniciado) return;
    if (easterEggJuegoActivo) btnImage.src = imgEasterNormal;
    else btnImage.src = nivelActual.normal;
  });

  clickBtn.addEventListener("pointerleave", () => {
    if (!juegoIniciado) return;
    if (easterEggJuegoActivo) btnImage.src = imgEasterNormal;
    else btnImage.src = nivelActual.normal;
  });

  // === INICIAR ===
  btnImage.src = niveles[0].normal;
  actualizarUI();
});
